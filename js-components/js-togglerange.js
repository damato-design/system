import html from '../components/toggle-range/toggle-range.html';
import css from '../components/toggle-range/toggle-range.css';
import { BOX_SIZING } from '../const.json';

class ToggleRange extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `<style type="text/css">${BOX_SIZING}${css}</style>${html}`;

    this._toggleRange = this.shadowRoot.querySelector('.toggleRange');
    this._toggleRange.setAttribute('type', this.type);
    this._label = this.shadowRoot.querySelector('.toggleRange--label');
    this._input = this.shadowRoot.querySelector('.toggleRange--input');

    if (this.type === 'checkbox') {
      this._input.type = 'checkbox';
    }

    if (this.type === 'range') {
      this._input.type = 'range';
    }

    this._input.id = 'toggleRange-inputId';
    this._label.setAttribute('for', this._input.id);
    this._input.step = this.getAttribute('step') || 1;
    const labelSlot = this.shadowRoot.querySelector('slot:not([name])');
    labelSlot.addEventListener('slotchange', () => {
      const label = labelSlot.assignedNodes()[0];
      this.setAttribute('aria-label', label.nodeValue.trim());
    });


    const outputSlot = this.shadowRoot.querySelector('slot[name="output"]');
    outputSlot.addEventListener('slotchange', () => {
      this._output = outputSlot.assignedElements()[0];
      this._output.value = this._output.value || this._output.innerText || this.value;
    });
  }
  

  connectedCallback() {
    if (this.type === 'checkbox') {
      this._input.setAttribute('checked', Boolean(this.chosen) || Boolean(this.value));
      this.setAttribute('role', 'checkbox');
      this.setAttribute('aria-checked', this.chosen);
    }

    if (this.type === 'range') {
      this._input.min = this.min;
      this._input.max = this.max;
      this._input.value = this.value;
      this.setAttribute('role', 'slider');
      this._input.setAttribute('value', this._input.value);
    }
    this._direction = this.value === this.max ? -1 : 1;

    this._input.addEventListener('input', (ev) => this.value = this._transformInputValue(ev.target));
    this._input.addEventListener('change', (ev) => this.value = this._transformInputValue(ev.target));

    this.addEventListener('keydown', (ev) => {
      if (this.type === 'range' && ev.code.toLowerCase() === 'space') {
        ev.preventDefault();
        this._traverseStep();
      }
    });
  }

  setComputedStyleValue(cssCustomProp) {
    this.value = window
      .getComputedStyle(document.documentElement)
      .getPropertyValue(cssCustomProp)
      .trim();
  }

  _transformInputValue(input) {
    if (this.type === 'checkbox') {
      return Number(input.checked);
    }
    return input.value;
  }

  _traverseStep() {
    const step = Number(this.getAttribute('step')) || 1;
    const update = formatter(step, this.value + (step * this._direction));

    if (update > this.max || update < this.min) {
      this._direction *= -1;
    }

    this.value = formatter(step, this.value + (step * this._direction));
  }

  static get observedAttributes() {
    return ['value', 'chosen'];
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    if (attrName === 'chosen') {
      this.value = Number(this.chosen);
      if (this.chosen) {
        this._input.setAttribute('checked', '');
        this.setAttribute('aria-checked', this.chosen);
      } else {
        this._input.removeAttribute('checked');
        this.setAttribute('aria-checked', this.chosen);
      }
    }

    if (attrName === 'value') {
      this._direction = Number(oldVal) > Number(newVal) ? -1 : 1;
      if (this._output) {
        this._output.value = this.value;
      }
      this._input.value = this.value;
      this._input.setAttribute('value', this.value);

      const asBool = Boolean(this.value);
      if (this.type === 'checkbox' && this.chosen !== asBool) {
        this.chosen = asBool
      }

      this.sendChangedEvent();
    }
  }

  get type() {
    return this.getAttribute('type');
  }

  set type(newVal) {
    this.setAttribute('type', newVal);
  }

  get chosen() {
    return this.hasAttribute('chosen');
  }

  set chosen(newVal) {
    if (newVal) {
      this.setAttribute('chosen', '');
    } else {
      this.removeAttribute('chosen');
    }
  }

  get min() {
    return Number(this.getAttribute('min')) || 0;
  }

  set min(newVal) {
    this.setAttribute('min', newVal);
  }

  get max() {
    return Number(this.getAttribute('max')) || 1;
  }

  set max(newVal) {
    this.setAttribute('max', newVal);
  }

  get value() {
    return Number(this.getAttribute('value'));
  }

  set value(newVal) {
    this.setAttribute('value', newVal);
  }

  sendChangedEvent() {
    const event = new CustomEvent('change', {
      detail: {
        type: this.type,
        chosen: this.chosen,
        value: this.value,
      }
    });
    this.dispatchEvent(event);
  }
}

function formatter(step, num) {
  const signfigantDigitMax = 6;
  const stepRef = [...Array(signfigantDigitMax).keys()]
    .map((index) => Math.pow(10, index) * step)
    .findIndex((num) => num === parseInt(num));
  return parseFloat(num.toFixed(stepRef));

}

window.customElements.define('js-togglerange', ToggleRange);