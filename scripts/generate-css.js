import { toCustomIdent } from './properties.js';

function colorMix(value, base) {
    const lightness = typeof value?.$influence === 'number'
        ? 'none'
        : 'l';
    const { $value, $influence } = Object.assign({
        $value: 'transparent',
        $influence: 100
    }, value);
    return `color-mix(
        in oklch,
        oklch(from ${base} l c none),
        oklch(from ${$value} ${lightness} c h) ${$influence}%
    )`;
}

function getGroup(name) {
    return name.split('_').slice(0, -1).join('_');
}

function familyKey([fontName, fontWeights]) {
    const weight = [...fontWeights.keys()].filter(Boolean).sort().join(';');
    return [fontName, `wght@${weight}`].join(':');
}

function fontImports(names, { tokens }) {
    const url = new URL('https://fonts.googleapis.com/css2');
    const fontFamilyNames = names
        .filter((name) => name.includes('fontFamily'))
        .map(getGroup);
    const groupings = fontFamilyNames.reduce((acc, groupName) => {
        const { fontFamily, fontWeight } = groupName.split('_').reduce((acc, key) => acc[key], tokens);
        if (!acc[fontFamily.$value]) acc[fontFamily.$value] = new Set();
        acc[fontFamily.$value].add(fontWeight.$value);
        return acc;
    }, {});
    Object.entries(groupings)
        .map(familyKey)
        .forEach((family) => url.searchParams.set('family', family));
    url.searchParams.set('display', 'swap');
    return `@import url('${url.toString()}');`;
}

function declaration(name, { tokens }, systemTokens) {
    // Get value within tokens
    const value = name.split('_').reduce((acc, key) => acc[key], tokens);
    // Assume we are going to use this as the result
    const decl = [toCustomIdent(name), value.$value];
    if (name.endsWith('Color')) {
        const system = name.split('_').reduce((acc, key) => acc[key], systemTokens);
        decl[1] = colorMix(value, system.$value);
    }

    if (name.endsWith('FontFamily')) {
        decl[1] = [value.$value, value.$fallback].filter(Boolean).join(',');
    }
    return `\t${decl.join(': ')};`;
}

function getNames(obj, path = '') {
    return Object.entries(obj).reduce((names, [key, value]) => {
        const update = [path, key].filter(Boolean).join('_');
        if (key.startsWith('$')) return path;
        return typeof value === 'object' && value !== null
            ? names.concat(getNames(value, update))
            : names.concat(update);
    }, []);
}

export default function main({ tokens, mode, lang }, systemTokens = {}) {
    const selector = [`[data-mode~="${mode}"]`];
    if (lang) selector.push(`:lang(${lang})`);
    const names = getNames(tokens);
    const fonts = fontImports(names, { tokens });
    const rules = names.map((name) => declaration(name, { tokens }, systemTokens));
    const message = `/** Generated file: generate-css.js */`
    return `${message}
${fonts}\n
@scope {
    ${selector.join('')} {
        ${rules.join('\n')}
    }
}`
}
