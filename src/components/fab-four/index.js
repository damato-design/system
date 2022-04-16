import html from './template.html';
import css from './styles.css';

class FabFour extends window.HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).innerHTML = `<style type="text/css">${css}</style>${html}`;
    const root = this.shadowRoot.getElementById('fab-four');
    root.firstElementChild.addEventListener('slotchange', function () {
      root.style.setProperty('--children', this.assignedElements().length);
    });

    root.style.setProperty('--gap', this.getAttribute('gap') || '0rem');
    root.style.setProperty('--threshold', this.getAttribute('threshold') || '60ch');
    root.style.setProperty('--column-max', this.getAttribute('column-max') || 2);
    root.style.setProperty('--column-min', this.getAttribute('column-min') || 1);
  }
}

window.customElements.define('fab-four', FabFour);
