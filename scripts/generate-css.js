import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { prefix, toCustomIdent } from './properties.js';

const MODE_YAML_PATH = path.join(process.cwd(), 'src', 'modes');
const SYSTEM_YAML_PATH = path.join(MODE_YAML_PATH, '_system.yml');
const MODE_CSS_PATH = path.join(process.cwd(), 'src', 'assets');
const _system = yaml.load(fs.readFileSync(SYSTEM_YAML_PATH, 'utf8'));

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
    const decl = [toCustomIdent(prefix(name, 'brand')), value.$value];
    if (name.endsWith('Color')) {
        const system = name.split('_').reduce((acc, key) => acc[key], _system.tokens);
        decl[1] = colorMix(value, system.$value);
        if (symbolic) {
            decl[1] = colorMix(value, decl[0]);
            decl[0] = toCustomIdent(prefix(name, 'symbolic'));
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

function qualifyingFile(file) {
    const { name, ext } = path.parse(file);
    return !(name.startsWith('_') || !ext.endsWith('yml'))
}

function processFile(file) {
    const { name } = path.parse(file);
    const fullPath = path.join(MODE_YAML_PATH, file);
    const contents = yaml.load(fs.readFileSync(fullPath, 'utf8'));
    if (!contents.alias) throw new Error(`Alias is missing for ${file}`);
    const css = mode(contents);
    fs.writeFileSync(path.join(MODE_CSS_PATH, `${name}.css`), css, 'utf8');
}

function main() {
    const files = fs.readdirSync(MODE_YAML_PATH);
    files.filter(qualifyingFile).map(processFile);
}

main();
