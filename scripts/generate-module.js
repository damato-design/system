import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

import { 
    PRIORITY,
    PROPERTY_COLOR,
    PROPERTY_FONT,
    PROPERTY_SPACE
} from './properties.js';

const SYSTEM_YAML_PATH = path.join(process.cwd(), 'src', 'modes', '_system.yml');
const _system = yaml.load(fs.readFileSync(SYSTEM_YAML_PATH, 'utf8'));

function permutate(...arrays) {
    const recurse = (arrs, path = []) => {
        if (arrs.length === 0) {
            return [path.join('_')]
        }

        const [first, ...rest] = arrs;
        return first.flatMap((item) => recurse(rest, [...path, item]));
    }
    return recurse(arrays);
}

function prefix(pre, value) {
    return `--${pre}-${value}`;
}

function variable(token) {
    const { $value } = token.split('_').reduce((acc, key) => acc[key], _system.tokens);
    const value =  `var(${prefix('symbolic', token)}, var(${prefix('brand', token)}, ${$value}))`;
    return `$${token}: ${value};`;
}

// $action_primary_backgroundColor: var(--symbolic, var(--brand, _system));
function variables(arr) {
    return arr.map(variable).join('\n');
}

// #{'action_primary_backgroundColor'}: $action_primary_backgroundColor;
function exports(arr) {
    return `:exports {
    ${ arr.map((token) => `\t#{'${token}'}: $${token};`).join('\n') }
    }`;
}

/**
 * _tokens.module.scss
 * $action_primary_backgroundColor: var(--symbolic, var(--brand, _system));
 * :export {
 *  #{'action_primary_backgroundColor'}: $action_primary_backgroundColor;
 * }
 */

function content() {
    const surface = permutate(['surface'], PRIORITY, PROPERTY_COLOR);
    const action = permutate(['action'], PRIORITY, PROPERTY_COLOR);
    const control = permutate(['control'], PROPERTY_COLOR);
    const text = permutate(['text'], PRIORITY, PROPERTY_FONT);
    const space = permutate(['space'], PROPERTY_SPACE);
    
    const message = `/* Generated file: npm run generate:module */`;
    const tokens = [].concat(surface, action, control, text, space);
    return [message, variables(tokens), exports(tokens)].join('\n');

}

fs.writeFileSync('src/components/_tokens.module.scss', content(), 'utf-8');
