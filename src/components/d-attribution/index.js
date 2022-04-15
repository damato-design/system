import html from './template.html';
import css from './styles.css';

class DAttribution extends window.HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).innerHTML = `<style type="text/css">${css}</style>${html}`;
    window.__library.observer(this.shadowRoot);
  }
}

window.__library.define('d-attribution', DAttribution);
