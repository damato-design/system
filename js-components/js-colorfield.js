import html from '../components/colorfield/colorfield.html';
import css from '../components/colorfield/colorfield.css';
import { BOX_SIZING } from '../const.json';

const COLORFIELD_BACKGROUNDCOLOR = '--colorfield--backgroundColor';
const COLORFIELD_FOREGROUNDCOLOR = '--colorfield--foregroundColor';

class JsColorfield extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `<style type="text/css">${BOX_SIZING}${css}</style>${html}`;
    this._input = this.shadowRoot.querySelector('.colorfield--input');
    this._outputInput  = this.shadowRoot.querySelector('.colorfield--outputInput');
    this._outputDelta  = this.shadowRoot.querySelector('.colorfield--outputDelta');
    this._outputValue  = this.shadowRoot.querySelector('.colorfield--outputValue');

    if (!this.hasAttribute('hex')) {
      this.setAttribute('rgb', '');
    }

    this._input.addEventListener('change', () => this._manageColorChange(true));
    this._input.addEventListener('input', () => this._manageColorChange(true));
  }

  static get observedAttributes() {
    return ['color'];
  }

  setComputedStyleValue(cssCustomProp) {
    this.value = window
      .getComputedStyle(document.documentElement)
      .getPropertyValue(cssCustomProp)
      .trim();
  }

  attributeChangedCallback(attrName) {
    if (attrName === 'color') {
      this._input.value = this.color;
      this._manageColorChange(false);
    }
  }

  _manageColorChange(userchange) {
    const { delta, value } = this.onColorchange(this._input.value) || {};
    this.delta = delta;
    this.value = value;
    this._render();
    this._sendChangedEvent(userchange);
  }

  _sendChangedEvent(userchange) {
    const event = new CustomEvent('change', {
      detail: {
        delta: this.delta,
        value: this.value,
        input: this._input.value,
        userchange,
      }
    });
    this.dispatchEvent(event);
  }

  _render() {
    this._setOutput(this._outputInput, this._input.value);
    this._outputDelta.value = this.delta;
    this._setOutput(this._outputValue, this.value);
  }

  _setOutput(output, value) {
    const values = {};

    if (value.startsWith('rgb')) {
      values.hex = this.rgbStringToHex(value),
      values.rgb = value;
    }

    if (value.startsWith('#')) {
      values.hex = value,
      values.rgb = this.rgbToString(this.hexToRGB(value));
    }

    if (this.hasAttribute('hex')) {
      output.value = values.hex
    }

    if (this.hasAttribute('rgb')) {
      output.value = values.rgb;
    }

    if (this.hasAttribute('colorvalue') || output ===  this._outputInput) {
      const contrast = this._getContrastHex(values.hex);
      output.style.setProperty(COLORFIELD_BACKGROUNDCOLOR, output.value);
      output.style.setProperty(COLORFIELD_FOREGROUNDCOLOR, contrast);
    } else {
      output.value = value;
    }
  }

  getLuminance({ r, g, b }) {
    const multipliers = [ 0.2126, 0.7152, 0.0722 ];
    return [r, g, b].map((v) => {
      v /= 255;
      return v <= 0.03928
          ? v / 12.92
          : Math.pow( (v + 0.055) / 1.055, 2.4 );
    }).reduce((lum, v, i) =>  lum + (v * multipliers[i]), 0);
  }

  _getContrastHex(hex) {
    const luma = this.getLuminance(this.hexToRGB(hex));
    return luma > Math.sqrt(1.05 * 0.05) - 0.05 > 0.179 ? '#000' : '#fff';
  }

  hexToRGB(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  rgbToString(rgb) {
    return rgb && `rgb(${Object.values(rgb).join(',')})`;
  }

  rgbStringToHex(str) {
    const match = str.match(/(\d+)/gm);
    if (match) {
      return '#' + match.slice(0, 3).map((digit) => parseInt(digit).toString(16).padStart(2, '0')).join('');
    }
    return '#000000';
  }

  get color() {
    return this.getAttribute('color');
  }

  set color(newVal) {

    if (newVal.startsWith('rgb')) {
      newVal = this.rgbStringToHex(newVal);
    }

    this.setAttribute('color', newVal);
  }

  get value() {
    return this.getAttribute('value');
  }

  set value(newVal) {
    if (this.hasAttribute('hex') && newVal.startsWith('rgb')) {
      newVal = this.rgbStringToHex(newVal);
    }

    if (this.hasAttribute('rgb') && newVal.startsWith('#')) {
      newVal = this.rgbToString(this.hexToRGB(newVal));
    }

    this.setAttribute('value', newVal);
  }

  get delta() {
    return this.getAttribute('delta');
  }

  set delta(newVal) {
    this.setAttribute('delta', newVal);
  }
  
  onColorchange() {}
}

window.customElements.define('js-colorfield', JsColorfield);