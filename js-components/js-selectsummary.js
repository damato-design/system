import html from '../components/select-summary/select-summary.html';
import css from '../components/select-summary/select-summary.css';
import { BOX_SIZING } from '../const.json';

class SelectSummary extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `<style type="text/css">${BOX_SIZING}${css}</style>${html}`;

    this._selectSummary = this.shadowRoot.querySelector('.selectSummary');
    this._checkbox = this.shadowRoot.querySelector('.selectSummary--checkbox');
    this._valueSlot = this.shadowRoot.querySelector('slot[name="value"]');
    this._valueRef = this.querySelector('[slot="value"]');
    this._contentSlot = this.shadowRoot.querySelector('slot:not([name])');

    this._indicatorOpenRef = this.querySelector('[slot="indicator-open"]');
    this._indicatorCloseRef = this.querySelector('[slot="indicator-close"]');

    if (!this._indicatorOpenRef) {
      const state = 'open';
      this.type === 'select' && this.appendChild(getIndicator('caret-down', state, 'keyboard_arrow_down'));
      this.type === 'menu' && this.appendChild(getIndicator('plus', state, 'add'));
      this.type === 'summary' && this.appendChild(getIndicator('eye-open', state, 'visibility'));
    }

    if (!this._indicatorCloseRef) {
      const state = 'close';
      this.type === 'select' && this.appendChild(getIndicator('caret-down', state, 'keyboard_arrow_down'));
      this.type === 'menu' && this.appendChild(getIndicator('plus', state, 'add'));
      this.type === 'summary' && this.appendChild(getIndicator('eye-close', state, 'visibility_off'));
    }
    
  }

  connectedCallback() {

    this.setAttribute('aria-expanded', this.open);
    this._checkbox.addEventListener('change', () => {
      this.open = this._checkbox.checked;
    });

    if (this.type !== 'summary') {
      this._selectSummary.classList.add('selectSummary--single');
      this._contentSlot.addEventListener('slotchange', () => {
        const options = this._contentSlot.assignedElements();
        this._selectSummary.classList.toggle('selectSummary--single', options.length === 1);

        let chosen = options[0];
        [...options].forEach((option) => {
          if (!option.href) {

            if (option.hasAttribute('chosen')) {
              chosen = option;
            }

            option.addEventListener('click', () => {
              this.setValueRef(option.innerText);
              this.value = option.getAttribute('value');
              this.sendChangedEvent();
            })
          }
        });

        if (this.type === 'select') {
          if (!this._valueRef) {
            this.setValueRef(chosen.innerText);
          }
          this.value = chosen.getAttribute('value');
          this.sendChangedEvent();
        }
      });
    }
  }

  setValueRef(innerText) {
    if (!this._valueRef) {
      this._valueRef = document.createElement('span');
      this._valueRef.slot = 'value';
      this.appendChild(this._valueRef);
    }
    this._valueRef.innerHTML = innerText;
  }

  static get observedAttributes() {
    return ['type', 'value', 'open'];
  }

  attributeChangedCallback(attrName) {
    if (attrName === 'type') {
      this._selectSummary.setAttribute('type', this.type);
    }

    if (attrName === 'open') {
      this._checkbox.checked = this.open;
      this.setAttribute('aria-expanded', this.open);
    }
  }

  get type() {
    return this.getAttribute('type');
  }

  set type(newVal) {
    this.setAttribute('type', newVal);
  }

  get value() {
    return this.getAttribute('value');
  }

  set value(newVal) {
    this.setAttribute('value', newVal);
  }

  get open() {
    return this.hasAttribute('open');
  }

  set open(newVal) {
    if (newVal) {
      this.setAttribute('open', '');
    } else {
      this.removeAttribute('open');
    }
  }

  sendChangedEvent() {
    const event = new CustomEvent('change', {
      detail: {
        name: this._valueSlot.innerText,
        type: this.type,
        value: this.value
      }
    });
    this.dispatchEvent(event);
  }
}

function getIndicator(value, state, fallback) {
  const className = `selectSummary--indicator${state.charAt(0).toUpperCase() + state.slice(1)}`;
  const svgIcon = document.createElement('svg-icon');
  svgIcon.innerText = fallback;
  svgIcon.value = value;
  svgIcon.slot = `indicator-${state}`;
  svgIcon.classList.add(className);
  return svgIcon;
}

window.customElements.define('js-selectsummary', SelectSummary);