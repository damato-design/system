class ModeManager {
    #sizes;
    #modes = {};
    #inventory;
    #MODE_LISTENER = '__MODE_LISTENER__';

    constructor(preload = '', sizes = 1) {
        this.#sizes = Number(sizes);
        fetch('/_inventory.json')
            .then((res) => res.json())
            .then((data) => this.#load(data, preload));
        this.listen();
        this.style();
    }

    get #isClient() {
        return typeof document !== 'undefined';
    }

    #queue(modes) {
        this.#split(modes).forEach((mode) => {
            if (this.#modes[mode]) return;
            this.#modes[mode] = false;
        }, this);
    }

    #split(str) {
        return str.split(/\s+/);
    }

    #coverage(inventory, preload) {
        const completed = this.#split(preload).reduce((results, mode) => {
            if (!(mode in inventory)) return results;
            inventory[mode].forEach((entry) => {
                const { coverage } = entry;
                if (coverage.color === 100) results.color = true;
                if (coverage.typography === 100) results.typography = true;
                if (coverage.space === 100) results.space = true;
            });
            return results;
        }, {
            color: false,
            typography: false,
            space: false,
        });
        Object.entries(completed).forEach(([category, bool]) => {
            if (!bool) console.warn(`Preloaded modes do not have 100% coverage for ${category}`);
        });
    }

    #load(inventory, preload) {
        this.#inventory = inventory;
        this.#coverage(inventory, preload);
        return this.update(preload);
    }

    #denser(_, index, arr) {
        const name = 'system:denser';
        const level = index + 1;
        const selector = Array
            .from({ length: level }, () => `[data-mode="${name}"]`)
            .join(' ');
        return `${selector} { --level: ${arr.length - level};  }`;
    }

    style() {
        const name = this.#MODE_LISTENER;
        const maxLevel = this.#sizes - 1;
        const css = `
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
        if (!this.#isClient) return css;
        const $style = document.createElement('style');
        $style.innerHTML = css;
        document.head.appendChild($style);
    }

    update(modes) {
        if (!this.#inventory) return;
        if (modes) this.#queue(modes);
        const linkAttrs = this.#linkAttrs();
        if (!this.#isClient) return linkAttrs.toString();
        linkAttrs.forEach(({ rel, href }) => {
            const $link = document.createElement('link');
            $link.rel = rel;
            $link.href = href;
            document.head.appendChild($link);
        });
    }

    listen() {
        if (!this.#isClient) return;
        document.documentElement.addEventListener('animationend', (ev) => {
            if (ev.animationName !== this.#MODE_LISTENER) return;
            this.update(ev.target.dataset.mode);
        });
    }

    #linkAttrs() {
        const attrs = Object.keys((this.#modes)).flatMap((mode) => {
            if (this.#modes[mode]) return;
            this.#modes[mode] = true;
            if (!(mode in this.#inventory)) return console.info(`Mode does not exist in inventory: ${mode}`);
            return this.#inventory[mode].map((entry) => ({
                href: entry.href,
                rel: 'stylesheet'
            }));
        }, this).filter(Boolean);
        attrs.toString = function () {
            return this.map(({ href, rel }) => `<link rel="${rel}" href="${href}"/>`).join('\n');
        }
        return attrs;
    }

}

const $script = document.currentScript;
const manager = new ModeManager($script.dataset.preload, $script.dataset.sizes);
