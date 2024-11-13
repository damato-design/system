export const PRIORITY = [
    'primary',
    'secondary',
    'auxiliary'
];
export const PROPERTY_COLOR = [
    'backgroundColor',
    'foregroundColor',
    'borderColor'
];
export const PROPERTY_FONT = [
    'fontFamily',
    'fontWeight',
    'lineHeight',
    'minRem',
    'scaleFactor'
];
export const PROPERTY_SPACE = [
    'minDimension',
    'scaleFactor',
];

export function prefix(token, pre) {
    return [pre, token].filter(Boolean).join('-');
}

export function toCustomIdent(token) {
    return `--${token}`;
}

export function toCSSVar(token, fallback) {
    return `var(${[toCustomIdent(token), fallback].filter(Boolean).join(', ')})`;
}