import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { prefixType, toCustomIdent } from './properties.js';

const MODE_YAML_PATH = path.join(process.cwd(), 'src', 'modes');
const SYSTEM_YAML_PATH = path.join(MODE_YAML_PATH, '_system.yml');
const MODE_CSS_PATH = path.join(process.cwd(), 'src', 'assets');
const INVENTORY_JSON_PATH = path.join(process.cwd(), '.storybook', 'public', 'inventory.json');
const _system = yaml.load(fs.readFileSync(SYSTEM_YAML_PATH, 'utf8'));

function qualifyingYaml(file) {
    const { name, ext } = path.parse(file);
    return !(name.startsWith('_') || !ext.endsWith('yml'))
}

function createCSSFileName(file) {
    const { name } = path.parse(file);
    return `${name}.css`;
}

function colorMix(value, base) {
    const { $value, $influence } = Object.assign({
        $value: 'transparent',
        $influence: 100
    }, value);
    return `color-mix(in oklch, ${base}, ${$value} ${$influence}%)`;
}

function declaration(name, { tokens, symbolic }) {
    // Get value within tokens
    const value = name.split('_').reduce((acc, key) => acc[key], tokens);
    // Assume we are going to use this as the result
    const decl = [toCustomIdent(prefixType(name, 'brand')), value.$value];
    if (name.endsWith('Color')) {
        const system = name.split('_').reduce((acc, key) => acc[key], _system.tokens);
        decl[1] = colorMix(value, system.$value);
        if (symbolic) {
            decl[1] = colorMix(value, decl[0]);
            decl[0] = toCustomIdent(prefixType(name, 'symbolic'));
        }
    }
    return `\t${decl.join(': ')};`;
}

function getNames(obj, path = '') {
    return Object.entries(obj).reduce((names, [key, value]) => {
        const update = [path, key].filter(Boolean).join('_');
        if (key === '$value') return path;
        return typeof value === 'object' && value !== null
            ? names.concat(getNames(value, update))
            : names.concat(update);
    }, []);
}

function mode({ tokens, alias, symbolic, lang }) {
    const selector = [`[data-mode~="${alias}"]`];
    if (lang) selector.push(`:lang(${lang})`);
    const rules = getNames(tokens).map((name) => declaration(name, { tokens, symbolic }));
    return `${selector.join('')} {
${rules.join('\n')}
}`
}

function processFile(acc, file) {
    const fullPath = path.join(MODE_YAML_PATH, file);
    const contents = yaml.load(fs.readFileSync(fullPath, 'utf8'));
    const { alias, lang } = contents;
    if (!alias) throw new Error(`Alias is missing for ${file}`);
    const fileName = createCSSFileName(file);
    fs.writeFileSync(path.join(MODE_CSS_PATH, fileName), mode(contents), 'utf8');
    if (!acc[alias]) acc[alias] = [];
    acc[alias] = lang
        ? acc[alias].concat(fileName)
        : [fileName].concat(acc[alias]);
    return acc;
}

function main() {
    const files = fs.readdirSync(MODE_YAML_PATH);
    const inventory = files.filter(qualifyingYaml).reduce(processFile, {});
    fs.writeFileSync(INVENTORY_JSON_PATH, JSON.stringify(inventory, null, 2), 'utf8');
}

main();
