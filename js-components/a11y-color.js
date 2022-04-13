const ACCENT_CSS_CUSTOMPROPERTY = '--accent--defaultColor';
const BACKGROUND_CSS_CUSTOMPROPERTY = '--box--backgroundColor';
const FOREGROUND_CSS_CUSTOMPROPERTY = '--box--foregroundColor';

class A11yColor extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
    <js-colorfield>
      <label slot="label-input">Text Color</label>
      <label slot="label-delta">Ratio</label>
      <label slot="label-value">WCAG AA</label>
    </js-colorfield>`;

    this._colors = {
      backgroundColor: this._getComputedColor(BACKGROUND_CSS_CUSTOMPROPERTY),
      foregroundColor: this._getComputedColor(FOREGROUND_CSS_CUSTOMPROPERTY),
      accentColor: this._getComputedColor(ACCENT_CSS_CUSTOMPROPERTY),
    }
    
    this._colorfield = this.shadowRoot.querySelector('js-colorfield');
    this._colorfield.onColorchange = (hex) => {

      const params =  [
        this._colorfield.rgbStringToHex(this._colors.backgroundColor),
        hex
      ].map(this._colorfield.hexToRGB);

      const ratio = this.getContrastRatio(...params);
      return {
        delta: `${(1/ratio).toFixed(1)}:1`,
        value: ratio < 1/4.5 ? 'Pass' : 'Fail'
      }
    };
  }

  connectedCallback() {
    setTimeout(() => {
      this._manageObserver();
      this._colorfield.color = this._colorfield.rgbStringToHex(this._colors.foregroundColor);
      this._colorfield.addEventListener('change', (ev) => {
        if (ev.detail.userchange) {
          document.documentElement.style.setProperty(FOREGROUND_CSS_CUSTOMPROPERTY, ev.detail.input);
        }
      });
    }, 0);
  }

  disconnectedCallback() {
    this._manageObserver();
  }

  _getComputedColor(cssCustomProp) {
    let color = window
    .getComputedStyle(document.documentElement)
    .getPropertyValue(cssCustomProp)
    .replace(/\s+/gm, '');

    if (color.startsWith('hsl')) {
      // Convert to an rgb string
      const grayscaleFactor = color.match(/[*\/]\d+/g);
      const graycalc = grayscaleFactor.reduce((math, str) => {
        return str.startsWith('*') ? math * Number(str.substr(1)) : math / Number(str.substr(1));
      }, 1);
      const grayvalue = parseInt(255 / (1 + graycalc));
      color = `rgb(${grayvalue}, ${grayvalue}, ${grayvalue})`;
    }

    return color;
  }

  _manageObserver() {
    if (this._observer) {
      this._observer.disconnect();
      return;
    }

    this._observer = new MutationObserver((entries) => {
      entries.forEach(({ attributeName }) => {
        if (attributeName !== 'style') {
          this._colors = {
            backgroundColor: this._getComputedColor(BACKGROUND_CSS_CUSTOMPROPERTY),
            foregroundColor: this._getComputedColor(FOREGROUND_CSS_CUSTOMPROPERTY),
            accentColor: this._getComputedColor(ACCENT_CSS_CUSTOMPROPERTY),
          };
          this._colorfield.color = this._colorfield.rgbStringToHex(this._colors.foregroundColor);
        }
      });
    })
    this._observer.observe(document.documentElement, { attributes: true });
  }

  getContrastRatio(bgColor, fgColor) {
    const bgLuma = this._colorfield.getLuminance(bgColor);
    const fgLuma = this._colorfield.getLuminance(fgColor);
    return bgLuma > fgLuma 
      ? ((fgLuma + 0.05) / (bgLuma + 0.05))
      : ((bgLuma + 0.05) / (fgLuma + 0.05));
  }
}

window.customElements.whenDefined('js-colorfield').then(() => {
  window.customElements.define('a11y-color', A11yColor);
});