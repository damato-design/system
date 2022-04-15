import html from './template.html';
import css from './styles.css';

class SiteAttribution extends window.HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).innerHTML = `<style type="text/css">${css}</style>${html}`;
  }
}

window.customElements.define('site-attribution', SiteAttribution);
