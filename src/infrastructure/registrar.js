import RootObserver from './root-observer.js';
const SOURCE = new URL(document.currentScript.src).href.replace(/[^/]*$/, '');

class Registrar {
  constructor() {
    this.elements = new Set();
    this.observer = new RootObserver();
    this.observer.observe(document.documentElement);
  }

  lookup(tagName) {
    if (this.elements.has(tagName)) return;
    this.elements.add(tagName);
    const script = Object.assign(document.createElement('script'), {
      type: 'text/javascript',
      defer: true,
      onload: () => script.remove(),
      onerror: () => script.remove(),
      src: new URL(`components/${tagName}.iife.js`, SOURCE)
    });
    document.head.appendChild(script);
  }
}

if (!(window.__library instanceof Registrar)) {
  window.__library = new Registrar();
}