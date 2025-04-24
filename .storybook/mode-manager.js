import inventory from '../src/assets/_inventory.json';

function scriptContents({ brand, ssr }) {
    const channel = new BroadcastChannel('mode-channel');
    const root = document.currentScript?.getRootNode?.() || document;
    const ssrHrefs = ssr.split(',');
    const range = document.createRange();
    new Worker('mode-worker.js');

    range.setStartAfter(document.currentScript);
    range.collapse(true);

    channel.addEventListener('message', (ev) => {
        if (ev.data?.type === 'MODE_RESPONSE') {
            const { payload } = ev.data;

            range.deleteContents();

            payload.filter((href) => !ssrHrefs.includes(href)).forEach((href) => {
                range.insertNode(Object.assign(document.createElement('link'), { href, rel: 'stylesheet' }));
            });
        }
    });

    root.addEventListener('animationend', (ev) => {
        const modes = ev.target.dataset?.mode?.split(' ') || [];

        channel.postMessage({
            type: 'MODE_REQUEST',
            payload: {
                mode: modes,
                brand
            }
        });
    });

    if (typeof window?.requestIdleCallback === 'function'
        && navigator?.connection?.downlink >= 10)
        requestIdleCallback(() => channel.postMessage({ type: 'PAGE_IDLE' }));
}

function styleContents(sizes) {
    const animationName = '__modedetector__';
    const maxLevel = (Number(sizes) || 1) - 1;

    return `
    :where([data-mode]) {
        visibility: hidden;
        animation: ${animationName} .0001s linear forwards;
    }

    @keyframes ${animationName} { to { visibility: visible } }

    :where(:root, :host) { --level: ${ maxLevel }; }
    
    ${Array.from({ length: maxLevel }).map(denser).join('\n')}
    `;
}

function denser(_, index, arr) {
    const name = 'system:denser';
    const level = index + 1;
    const selector = Array
        .from({ length: level }, () => `:where([data-mode="${name}"])`)
        .join(' ');
    return `${selector} { --level: ${arr.length - level};  }`;
}

function checkCoverage(assets) {
    const coverage = assets.reduce((acc, asset) => {
        return Object.entries(asset.coverage).reduce((a, [key, value]) => {
            return Object.assign(a, { [key]: Math.max(a?.[key] || 0, value) });
        }, acc);
    }, {});

    if (Object.values(coverage).some((percent) => percent !== 100))
        console.warn(`Initial modes provided may not have 100% coverage`);

    return assets;
}

function hrefLookup({ modes, brand }) {

    const ssrAssets = inventory.filter((entry) =>
        (!entry.brand || entry.brand === brand)
        && modes.includes(entry.mode));

    checkCoverage(ssrAssets);

    return ssrAssets.map(({ href }) => href);
}

export function modeManager(config = {}) {

    const { sizes, brand, modes } = config;
    const hrefs = hrefLookup({ brand, modes });
    const args = Object.entries({ brand, ssr: hrefs })
        .filter(([_, val]) => Boolean(val))
        .map(([key, val]) => `${key}: '${val}'`)
        .join(',');
    
    return [
        `<style>${styleContents(sizes)}</style>`,
        ...hrefs.map((href) => `<link href="${href}" rel="stylesheet" data-lifecycle="ssr">`),
        `<script>(${scriptContents.toString()})({${args}})</script>`
    ].join('\n');
}
