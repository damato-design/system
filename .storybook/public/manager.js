class ModeManager {
    #target;
    #inventory = [];
    #secret = '__modemanager__';
    #scopes = new Map();

    constructor($target) {
        if (!globalThis[this.#secret]) {
            globalThis[this.#secret] = this;
        }
        this.#target = $target;
        this.#clientRoot();
    }

    get ready() {
        const globalManager = globalThis[this.#secret];
        return Boolean(
            Array.isArray(globalManager.inventory)
            && globalManager.inventory.length
        );
    }

    get scopes() {
        const globalManager = globalThis[this.#secret];
        if (this === globalManager) return this.#scopes;
        return globalManager.scopes;
    }

    get inventory() {
        const globalManager = globalThis[this.#secret];
        if (this === globalManager) return this.#inventory;
        return globalManager.inventory;
    }

    set inventory(data) {
        this.#inventory = data;
        const globalManager = globalThis[this.#secret];
        if (this !== globalManager) {
            globalManager.inventory = this.#inventory;
        }
        this.#clientReady();
    }

    get #rootIds() {
        return {
            style: `${this.#secret}-style`,
            script: `${this.#secret}-script`
        }
    }

    get #animationName() {
        return `${this.#secret}-animationName`
    }

    #clientRoot() {
        const { style, script } = this.#rootIds;
        if (!this.#target
            || globalThis[style]
            || globalThis[script]
        ) return;
        const rootHTML = this.root(this.#target.dataset);
        this.#target.insertAdjacentHTML('afterend', rootHTML);
    }

    #split(str) {
        return str.split(/\s+/);
    }

    #links() {
        return this.map((href) => {
            return `<link rel="stylesheet" href="${href}" />`
        }).join('\n');
    }

    #denser(_, index, arr) {
        const name = 'system:denser';
        const level = index + 1;
        const selector = Array
            .from({ length: level }, () => `[data-mode="${name}"]`)
            .join(' ');
        return `${selector} { --level: ${arr.length - level};  }`;
    }

    listen(ev) {
        if (ev.animationName !== this.#animationName) return;
        const $target = ev.target.closest('[data-brand]');
        const { brand } = $target.dataset;
        const { mode } = ev.target.dataset;
        this.#clientScope($target, { brand, mode });
    }

    #queue(brand = this.#secret, items = []) {
        this.scopes.set(
            brand, 
            (this.scopes.get(brand) || [])
            .concat(items)
            .filter(Boolean)
        );
        return this.scopes.get(brand);
    }

    root({ sizes }) {
        // Returns code meant for the <head/> (style, script)
        const name = this.#animationName;
        const maxLevel = (Number(sizes) || 1) - 1;
        const style = `
            :root {
                --level: ${ maxLevel };
            }
        
            [data-mode] {
                visibility: hidden;
                animation: ${name} .0001s linear forwards;
            }
    
            @keyframes ${name} { to { visibility: visible } }

            ${Array.from({ length: maxLevel }).map(this.#denser, this).join('\n')}
        `;

        const bound = `window['${this.#secret}'].listen.bind(window['${this.#secret}'])`;
        return `
            <style id=${this.#rootIds.style}>${style}</style>
            <script id=${this.#rootIds.script}>
                getRootNode().addEventListener('animationend', ${bound});
            </script>
        `;
    }

    scope({ brand, mode }) {
        // Returns <link/> tags for each mode as object
        const queue = this.#queue(brand, this.#split(mode));

        if (!this.ready) return [];

        const resources = queue.reduce((acc, item, index) => {
            if (item.endsWith('.css')) return acc;
            const candidate = this.inventory.find((entry) => (
                entry.mode === item
                && (!entry.brand || entry.brand === brand)
            ));
            // If not found, set as undefined
            queue[index] = candidate?.href;
            return acc.concat(queue[index]);
        }, []);

        // Clean null values
        this.#queue(brand);

        resources.toString = this.#links.bind(resources);
        return resources;
    }

    #clientScope($target, config) {
        if (!$target) return;
        const scopeHTML = this.scope(config);
        $target.insertAdjacentHTML('afterend', scopeHTML);
    }

    #clientReady() {
        if (!this.#target) return;
        // Set links that have been preloaded
        const { brand } = this.#target.dataset;
        const hrefs = [...this.#target.parentElement.children]
            .filter(($sibling) => $sibling.tagName === 'LINK')
            .map(($sibling) => $sibling.href);
        this.#queue(brand, hrefs);
        this.#clientScope(this.#target, this.#target.dataset);
    }
}

if (document?.currentScript) {
    const manager = new ModeManager(document.currentScript);
    if (!manager.ready) {
        fetch('/_inventory.json')
            .then((res) => res.json())
            .then((inventory) => {
                manager.inventory = inventory;
            })
    }
}
