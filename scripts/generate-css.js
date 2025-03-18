function colorMix(tokenObj, base) {
    const lightness = typeof tokenObj?.$influence === 'number'
        ? 'none'
        : 'l';
    const { $value, $influence } = Object.assign({
        $value: 'transparent',
        $influence: 100
    }, tokenObj);
    return `color-mix(
        in oklch,
        oklch(from ${base} l c none),
        oklch(from ${$value} ${lightness} c h) ${$influence}%
    )`;
}

function familyKey([fontName, fontWeights]) {
    const weight = [...fontWeights.keys()].filter(Boolean).sort().join(';');
    return [fontName, `wght@${weight}`].join(':');
}

function fontImports(tokens) {
    const url = new URL('https://fonts.googleapis.com/css2');

    const familyGroups = Object
        .keys(tokens)
        .filter((name) => name.includes('fontFamily'))
        .reduce((acc, familyToken) => {
            const familyValue = tokens[familyToken].$value;
            const assocFontWeight = familyToken.replace('_fontFamily', '_fontWeight');
            if (!acc[familyValue]) acc[familyValue] = new Set();
            acc[familyValue].add(tokens[assocFontWeight].$value);
            return acc;
        }, {});

    Object.entries(familyGroups)
        .map(familyKey)
        .forEach((family) => url.searchParams.set('family', family));

    url.searchParams.set('display', 'swap');

    return `@import url('${url.toString()}');`;
}

function declaration(token, tokenObj, systemObj) {
    // Get value within tokens
    // Assume we are going to use this as the result
    const decl = [token.replace('$', '--🔒'), tokenObj.$value];
    if (token.endsWith('Color')) {
        decl[1] = colorMix(tokenObj, systemObj.$value);
    }

    if (token.endsWith('fontFamily')) {
        decl[1] = [tokenObj.$value, tokenObj.$fallback].filter(Boolean).join(',');
    }
    return `\t${decl.join(': ')};`;
}

export default function main({ tokens, mode, lang }, systemTokens = {}) {
    const selector = [`[data-mode~="${mode}"]`];
    if (lang) selector.push(`:lang(${lang})`);
    const fonts = fontImports(tokens);
    const rules = Object.keys(tokens).map((token) => declaration(token, tokens[token], systemTokens[token]));
    const message = `/** Generated file: generate-css.js */`
    return `${message}
${fonts}\n
@scope {
    ${selector.join('')} {
        ${rules.join('\n')}
    }
}`
}
