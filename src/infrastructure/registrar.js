import observer from './observer.js';
const REGISTRAR_IIFE_NAME = 'registrar.iife.js';

const SOURCE = document.currentScript.src.replace(REGISTRAR_IIFE_NAME, '');

class Registrar {
  constructor() {

    this.observer = observer;
    this.observer(document.documentElement);

    const detail = { registrar: this };
    const event = new CustomEvent('registrarready', { detail });
    window.dispatchEvent(event);
  }

  define(tagName, definition) {
    if (window.customElements.get(tagName)) return;
    window.customElements.define(tagName, definition);
  }

  fetchDefinition(tagName) {
    if (window.customElements.get(tagName)) return;
    const url = this._getComponentUrl(tagName);
    this._injectScript(url);
  }

  getSystemUrl() {
    return SOURCE;
  }

  _getComponentUrl(tagName) {
    return new URL(`components/${tagName}.iife.js`, this.getSystemUrl());
  }

  _injectScript(url) {
    const script = Object.assign(document.createElement('script'), {
      type: 'text/javascript',
      defer: true,
      onload: () => script.remove(),
      onerror: () => script.remove(),
      src: url
    });
    document.head.appendChild(script);
  }
}

if (!(window.__library instanceof Registrar)) {
  window.__library = new Registrar();
}