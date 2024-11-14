import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { prefix, toCustomIdent } from './properties.js';

const MODE_YAML_PATH = path.join(process.cwd(), 'src', 'modes');
const SYSTEM_YAML_PATH = path.join(MODE_YAML_PATH, '_system.yml');
const MODE_CSS_PATH = path.join(process.cwd(), 'src', 'assets');
const _system = yaml.load(fs.readFileSync(SYSTEM_YAML_PATH, 'utf8'));
const fileName = 'alias.css';

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
    const decl = [toCustomIdent(prefix('brand', name)), value.$value];
    if (name.endsWith('Color')) {
        const system = name.split('_').reduce((acc, key) => acc[key], _system.tokens);
        decl[1] = colorMix(value, system.$value);
        if (symbolic) {
            decl[1] = colorMix(value, decl[0]);
            decl[0] = toCustomIdent(prefix('symbolic', name));
        }
    }
    return `${decl.join(':')};`;
}

function getNames(obj, path = '') {
    return Object.entries(obj).reduce((names, [key, value]) => {
        const update = [path, key].join('_');
        return typeof value === 'object' && value !== null
            ? names.concat(getNames(value, update))
            : names.concat(update);
    }, []);
}

function content({ tokens, alias, symbolic }) {


    return `[data-mode~="${alias}"] {
        ${getNames(tokens).map((name) => declaration(name, { tokens, symbolic }).join('\n'))}
    }`
}

function main() {
    const files = fs.readdirSync(MODE_YAML_PATH);
    const f = files.filter((file) => {
        const { name, ext } = path.parse(file);
        return !(name.startsWith('_') || !ext.endsWith('yml'))
    });

    console.log(f);
    // fs.writeFileSync(path.join(MODE_CSS_PATH, fileName), content(), 'utf-8');
}


main();