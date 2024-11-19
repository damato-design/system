import { 
    PRIORITY,
    PROPERTY_COLOR,
    PROPERTY_FONT,
    PROPERTY_SPACE,
    prefixType,
    toCSSVar,
} from './properties.js';

function permutate(...arrays) {
    const recurse = (arrs, path = []) => {
        if (arrs.length === 0)  return [path.join('_')];
        const [first, ...rest] = arrs;
        return first.flatMap((item) => recurse(rest, [...path, item]));
    }
    return recurse(arrays);
}

// $action_primary_backgroundColor: var(--symbolic, var(--brand, _system));
function variable(token) {
    const { $value } = token.split('_').reduce((acc, key) => acc[key], this);
    const brand = toCSSVar(prefixType(token, 'brand'), $value);
    const symbolic = toCSSVar(prefixType(token, 'symbolic'), brand);
    return `$${token}: ${symbolic};`;
}

function variables(arr, systemTokens) {
    return arr.map(variable, systemTokens).join('\n');
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

export default function main(systemTokens = {}) {
    const surface = permutate(['surface'], PRIORITY, PROPERTY_COLOR);
    const action = permutate(['action'], PRIORITY, PROPERTY_COLOR);
    const control = permutate(['control'], PROPERTY_COLOR);
    const text = permutate(['text'], PRIORITY, PROPERTY_FONT);
    const space = permutate(['space'], PROPERTY_SPACE);
    
    const message = `/* Generated file: generate-module.js */`;
    const tokens = [].concat(surface, action, control, text, space);
    return [message, variables(tokens, systemTokens), exports(tokens)].join('\n');
}
