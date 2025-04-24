const channel = new BroadcastChannel('mode-channel');
let inventory = [];
const state = { csr: new Set() };

fetch('/_inventory.json')
    .then((res) => res.json())
    .then((data) => { inventory = data })
    .then(processQueue);

function processQueue(preload) {
    if (!inventory.length) return;
    const assets = filterAssets(preload);
    if (!assets.length) return;
    channel.postMessage({
        type: 'MODE_RESPONSE',
        payload: assets,
    });
}

function filterAssets(preload) {
    return inventory.filter((asset) =>
        // Any asset without a brand or a matching brand
        (!asset.brand || state?.brand === asset.brand)
        // If preloading or mode matches list in CSR
        && ((preload && !state.csr.has(asset.mode)) || state.csr.has(asset.mode))
    ).map((asset) => {
        asset.rel = 'stylesheet';
        return {
            'data-lifecycle': 'csr',
            href: asset.href,
            rel: asset.rel
        };
    });
}

function resetAssets(brand) {
    if (!brand) return;
    if (inventory.length && brand !== state.brand)
        inventory.forEach((asset) => delete asset.rel);
    state.brand = brand;
    channel.postMessage({
        type: 'MODE_RESPONSE',
        payload: [],
    });
}

channel.addEventListener('message', (event) => {
    const { type, payload } = event.data || {};

    if (type === 'MODE_REQUEST') {
        if (payload.mode) state.csr.add(...payload.mode);
        resetAssets(payload.brand);
        processQueue(false);
    }

    if (type === 'PAGE_IDLE') {
        processQueue(true);
    }
});

