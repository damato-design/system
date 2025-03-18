function toCSSVar(token, fallback) {
    return `var(${[token.replace('$', '--🔒'), fallback].filter(Boolean).join(', ')})`;
}

// $action_primary_backgroundColor: var(--$token_name, _system);
function variables(arr, systemTokens) {
    return arr.map((token) => `${token}: ${toCSSVar(token, systemTokens[token].$value)};`).join('\n');
}

// #{'$action_primary_backgroundColor'}: $action_primary_backgroundColor;
function exports(arr) {
    return `:export {
${ arr.map((token) => `\t#{'${token}'}: ${token};`).join('\n') }
}`;
}

/**
 * _tokens.module.scss
 * $action_primary_backgroundColor: var(--$token_name, _system);
 * :export {
 *  #{'$action_primary_backgroundColor'}: $action_primary_backgroundColor;
 * }
 */

export default function main(intents, systemTokens = {}) {
    return [
        `/* Generated file: generate-module.js */`,
        variables(intents, systemTokens),
        exports(intents)
    ].join('\n');
}
