import { prefixType, toCustomIdent } from './properties.js';

function colorMix(value, base) {
    const { $value, $influence } = Object.assign({
        $value: 'transparent',
        $influence: 100
    }, value);
    return `color-mix(in oklch, ${base}, ${$value} ${$influence}%)`;
}

function declaration(name, { tokens, symbolic }, systemTokens) {
    // Get value within tokens
    const value = name.split('_').reduce((acc, key) => acc[key], tokens);
    // Assume we are going to use this as the result
    const decl = [toCustomIdent(prefixType(name, 'brand')), value.$value];
    if (name.endsWith('Color')) {
        const system = name.split('_').reduce((acc, key) => acc[key], systemTokens);
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

export default function main({ tokens, alias, symbolic, lang }, systemTokens = {}) {
    const selector = [`[data-mode~="${alias}"]`];
    if (lang) selector.push(`:lang(${lang})`);
    const rules = getNames(tokens).map((name) => declaration(name, { tokens, symbolic }, systemTokens));
    const message = `/** Generated file: generate-css.js */`
    return `${message}
${selector.join('')} {
${rules.join('\n')}
}`
}
