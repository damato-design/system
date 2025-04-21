import inventory from '/_inventory.json' assert { type: 'json' };

function generateVersionFromJSON(json) {
    const str = JSON.stringify(json);
    let hash = 0;

    for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0;
    }

    return 'v' + Math.abs(hash);
}

const CACHE_NAME = generateVersionFromJSON(inventory);
const KBPS_MIN_THRESHOLD = 50;

const trackedAssets = inventory.map(entry => ({
    ...entry,
    requested: false
}));

// Install and activate
self.addEventListener('install', () => {
    console.info('Service Worker installed with cache:', CACHE_NAME);
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
            )
        )
    );
});

// Fetch event, happens with SSRed resources & lifecycle adds
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(cached => {
            if (cached) return cached;
            const asset = resolveAsset(event.request);
            if (!asset) return fetch(event.request);
            return fetchAndCacheAsset(asset);
        })
    );
});

// Message event
self.addEventListener('message', event => {
    const { type, payload } = event.data || {};

    if (type === 'MODE_REQUEST' && typeof payload === 'string') {
        const asset = resolveAsset(payload);
        if (asset) {
            fetchAndCacheAsset(asset).then(() => {
                event.source.postMessage({
                    type: 'MODE_RESPONSE',
                    payload: [asset.href]
                });
            });
        }
    }

    if (type === 'PAGE_IDLE') {
        const remainingAssets = trackedAssets.filter(entry => !entry.kbps);
        const avgKbps = trackedAssets.reduce((acc, entry) => acc + Number(entry.kbps), 0)
            / (trackedAssets.length - remainingAssets.length);
        
        if (avgKbps > KBPS_MIN_THRESHOLD) return;

        Promise.all(remainingAssets.map(fetchAndCacheAsset)).then(() => {
            event.source.postMessage({
                type: 'MODE_RESPONSE',
                payload: remainingAssets.map(a => a.href)
            });
        });
    }
});

// Resolve asset from either a request or a mode string
function resolveAsset(input) {
    if (input instanceof Request) {
        const requestURL = new URL(input.url);
        return trackedAssets.find(entry =>
            !entry.kbps
            && requestURL.pathname.endsWith(entry.href)
        );
    }

    if (typeof input === 'string') {
        return trackedAssets.find(entry =>
            !entry.kbps
            && entry.mode === input
        );
    }
}

// Fetch and cache the asset
function fetchAndCacheAsset(asset) {
    const url = new URL(asset.href, self.registration.scope).toString();

    const fetchStart = performance.now();  // Start time of the fetch

    return fetch(url).then(resp => {
        const fetchEnd = performance.now();  // End time of the fetch
        const timeTaken = (fetchEnd - fetchStart) / 1000; // Time in seconds
        
        // Calculate KBps (Kilobytes per second)
        const fileSize = asset.bytes / 1024;  // Convert bytes to KB
        const kbps = fileSize / timeTaken;    // Calculate KB per second

        asset.kbps = kbps;  // Set the calculated kbps value

        if (resp.ok) {
            return caches.open(CACHE_NAME).then(cache => {
                cache.put(asset.href, resp.clone());
            });
        }
    }).catch(err => {
        console.warn(`Failed to fetch ${asset.href}:`, err);
    });
}
