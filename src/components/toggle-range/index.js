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
    this._$output.value = this.value;
    const detail = {
      type: this.type,
      value: this.value,
    };
    this.dispatchEvent(new CustomEvent('change', { detail }));
  }

  static get observedAttributes() {
    return ['type', 'value', 'min', 'max', 'step'];
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    switch(attrName) {
      case 'type':
        this.type = newVal;
        break;
      case 'value':
        this.value = newVal;
        break;
      default:
        this._$input.setAttribute(attrName, newVal);
    }
  }

  get type() {
    return this._$input.getAttribute('type');
  }

  set type(newVal) {
    this._$input.setAttribute('type', newVal);
  }

  get value() {
    return this.type === 'checkbox'
      ? Number(this._$input.checked)
      : Number(this._$input.value);
  }

  set value(newVal) {
    if (isNaN(newVal)) return;
    if (this.type === 'checkbox') {
      this._$input.checked = Boolean(newVal);
    } else {
      this._$input.value = Number(newVal);
    }
  }
}

window.customElements.define('toggle-range', ToggleRange);
