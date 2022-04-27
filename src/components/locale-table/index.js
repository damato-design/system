import html from './template.html';
import css from './styles.css';
import json from './locales.json';

class LocaleTable extends window.HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).innerHTML = `<style type="text/css">${css}</style>${html}`;
  }

  connectedCallback() {
    const tbody = this.shadowRoot.getElementById('data');
    const wrap = (c) => `<td>${c}</td>`;
    tbody.innerHTML = Object.entries(json).reduce((html, [id, { formalName, nativeName }]) => {
      return html + `<tr>${[`<code>${id}</code>`, formalName, nativeName].map(wrap).join('')}</tr>`
    }, '');
  }
}

window.customElements.define('locale-table', LocaleTable);
