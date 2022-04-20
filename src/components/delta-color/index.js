import html from './template.html';
import css from './styles.css';

class DeltaColor extends window.HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).innerHTML = `<style type="text/css">${css}</style>${html}`;

    this._$color = this.shadowRoot.getElementById('color');
    this._$input = this.shadowRoot.getElementById('input');
    this._$delta = this.shadowRoot.getElementById('delta');
    this._$output = this.shadowRoot.getElementById('output');
  }

  connectedCallback() {
    this._$color.addEventListener('input', () => this.color = this._$color.value);
  }

  _onChange(color) { 
    const { delta, ...display } = this.onColorChange(color);
    this._$delta.value = delta;
    this._setDisplay(this._$input, { output: color });
    this._setDisplay(this._$output, display);
  }

  _setDisplay(target, { output, color = output }) {
    target.style.setProperty('--deltaColor--backgroundColor', color);
    target.style.setProperty('--deltaColor--foregroundColor', this.contrast(color));
    target.value = output;
  }

  set color(newVal) {
    this._onChange(this.toObject(newVal));
  }

  onColorChange(rgb) {
    return { delta: 0, output: rgb }
  }

  contrast(color) {
    if (typeof color === 'string') {
      color = this.toObject(color);
    }
    return this.luminance(color) > Math.sqrt(1.05 * 0.05) - 0.05 > 0.179 ? '#000' : '#fff';
  }

  luminance({ r, g, b }) {
    const multipliers = [ 0.2126, 0.7152, 0.0722 ];
    return [r, g, b].map((v) => {
      v /= 255;
      return v <= 0.03928
          ? v / 12.92
          : Math.pow( (v + 0.055) / 1.055, 2.4 );
    }).reduce((lum, v, i) =>  lum + (v * multipliers[i]), 0);
  }

  toObject(color) {
    if (color.startsWith('rgb')) {
      const { groups } = color.match(/rgb\((?<r>\d{1,3}),\s*(?<g>\d{1,3}),\s*(?<b>\d{1,3})\)/) || {};
      return groups ? {
        r: parseInt(groups.r, 10),
        g: parseInt(groups.g, 10),
        b: parseInt(groups.b, 10),
        toString() { return `rgb(${[this.r, this.g, this.b].join(',')})` }
      } : null;
    }
  
    const { groups } = color.match(/^#?(?<r>[a-f\d]{2})(?<g>[a-f\d]{2})(?<b>[a-f\d]{2})$/i) || {};
    return groups ? {
      r: parseInt(groups.r, 16),
      g: parseInt(groups.g, 16),
      b: parseInt(groups.b, 16),
      toString() { return `rgb(${[this.r, this.g, this.b].join(',')})` }
    } : null;
  }
}

window.customElements.define('delta-color', DeltaColor);
