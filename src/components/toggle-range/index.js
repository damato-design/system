import html from './template.html';
import css from './styles.scss';

class ToggleRange extends window.HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).innerHTML = `<style type="text/css">${css}</style>${html}`;

    this._$input = this.shadowRoot.querySelector('input');
    this._$label = this.shadowRoot.querySelector('label');
    this._$output = this.shadowRoot.querySelector('output');
  }

  connectedCallback() {
    this._$input.addEventListener('change', () => this._onChange());
    this._onChange();
  }

  _onChange() {
    this._$output.value = this.type === 'checkbox'
      ? Number(this._$input.checked)
      : this._$input.value;
  }

  static get observedAttributes() {
    return ['type'];
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    if (attrName === 'type') {
      this.type = newVal;
    }
  }

  get type() {
    return this._$input.getAttribute('type');
  }

  set type(newVal) {
    this._$input.setAttribute('type', newVal);
  }
}

window.customElements.define('toggle-range', ToggleRange);
