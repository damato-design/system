const channel = new BroadcastChannel('mode-channel');
let inventory = [];
const state = { csr: new Set() };

fetch('/_inventory.json')
    .then((res) => res.json())
    .then((data) => { inventory = data })
    .then(processQueue);

function processQueue() {
    if (!inventory.length) return;
    const assets = filterAssets();
    if (!assets.length) return;
    channel.postMessage({
        type: 'MODE_RESPONSE',
        payload: assets,
    });
}

function filterAssets() {
    return inventory.filter((asset) =>
        // Any asset without a brand or a matching brand
        (!asset.brand || state?.brand === asset.brand)
        // If preloading or mode matches list in CSR
        && state.csr.has(asset.mode)
    ).map((asset) => asset.href);
}

function resetAssets(brand) {
    if (!brand) return;
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
        processQueue();
    }

    if (type === 'PAGE_IDLE') {
        processQueue();
    }
});

