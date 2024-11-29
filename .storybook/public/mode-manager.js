class ModeManager {
    #modes = {};
    #inventory;

    constructor(preload = '', sizes = 1) {
        this.#listen(Number(sizes));
        fetch('/_inventory.json')
            .then((res) => res.json())
            .then((data) => this.#load(data, preload));
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
        this.update(preload);
    }

    #denser(_, index, arr) {
        const name = 'system:denser';
        const level = index + 1;
        const selector = Array
            .from({ length: level }, () => `[data-mode="${name}"]`)
            .join(' ');
        return `${selector} { --level: ${arr.length - level};  }`;
    }

    #listen(sizes) {
        const name = '__MODE_LISTENER__';
        const maxLevel = sizes - 1;
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
    
        const $style = document.createElement('style');
        $style.innerHTML = css;
        document.head.appendChild($style);
        document.documentElement.addEventListener('animationend', (ev) => {
            if (ev.animationName !== name) return;
            this.update(ev.target.dataset.mode);
        });
    }

    update(modes) {
        if (!this.#inventory) return;
        if (modes) this.#queue(modes);

        Object.keys((this.#modes)).forEach((mode) => {
            if (this.#modes[mode]) return;
            this.#modes[mode] = true;
            if (!(mode in this.#inventory)) return console.info(`Mode does not exist in inventory: ${mode}`);
            this.#inventory[mode].forEach((entry) => {
                const $link = document.createElement('link');
                $link.rel = 'stylesheet';
                $link.href = entry.href;
                document.head.appendChild($link);
            });
        }, this);
    }

}

const $script = document.currentScript;
const manager = new ModeManager($script.dataset.preload, $script.dataset.sizes);
