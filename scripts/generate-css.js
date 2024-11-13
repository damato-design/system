import fs from 'fs';
import path from 'path';
import { prefix, toCustomIdent } from './properties';

const SYSTEM_YAML_PATH = path.join(process.cwd(), 'src', 'modes', '_system.yml');
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
        const system = name.split('_').reduce((acc, key) => acc[key], _system);
        decl[1] = colorMix(value, system.$value);
        if (symbolic) {
            decl[1] = colorMix(value, decl[0]);
            decl[0] = toCustomIdent(prefix('symbolic', name));
        }
    }
    return `${decl.join(':')};`;
}

function content({ tokens, alias, symbolic }) {
    return `[data-mode~="${alias}"] {

    }`
}

fs.writeFileSync(path.join(MODE_CSS_PATH, fileName), content(), 'utf-8');