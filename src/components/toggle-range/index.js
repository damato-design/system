import html from './template.html';
import css from './styles.scss';

class ToggleRange extends window.HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).innerHTML = `<style type="text/css">${css}</style>${html}`;

    this._$input = this.shadowRoot.querySelector('input');
    this._$output = this.shadowRoot.querySelector('output');
  }

  connectedCallback() {
    this._$input.addEventListener('input', () => {
      this.value = this.type === 'checkbox'
        ? this._$input.checked
        : this._$input.value;
      const detail = { value: this.value, type: this.type };
      this.dispatchEvent(new CustomEvent('change', { detail }));
    });
    this.value = this.value;
  }

  static get observedAttributes() {
    return ['type', 'value', 'min', 'max', 'step'];
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    if (attrName === 'value') {
      if (this.type === 'checkbox') {
        this._$input.checked = Boolean(this.value);
      } else {
        this._$input.value = this.value;
      }
      this._$output.value = this.value;
    } else {
      this._$input.setAttribute(attrName, newVal);
    }
  }

  get type() {
    return this._$input.getAttribute('type');
  }

  get value() {
    return Number(this.getAttribute('value'));
  }

  set value(newVal) {
    this.setAttribute('value', Number(newVal));
  }
}

window.customElements.define('toggle-range', ToggleRange);
