const HEXJSON_URL = 'json/a11yColorsOnBlackAndWhite.json';
const ACCENT_CSS_CUSTOMPROPERTY = '--accent--defaultColor';

class ClosestColor extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
    <js-colorfield colorvalue>
      <label slot="label-input">Chosen</label>
      <label slot="label-delta">Distance</label>
      <label slot="label-value">Closest</label>
    </js-colorfield>`;
    
    this._colorfield = this.shadowRoot.querySelector('js-colorfield');
    this._colorfield.onColorchange = (hex) => {
      const rgb = this._colorfield.hexToRGB(hex);
      const { closest, distance } = getClosestColor(this._colors, rgb);
      return {
        delta: distance && distance.toFixed(2),
        value: this._colorfield.rgbToString(closest)
      }
    };

    this.loadColors(HEXJSON_URL).then(() => this._colorfield.color = this.value);
  }

  connectedCallback() {
    setTimeout(() => {
      this.value = this._getAccentColor();
      this._colorfield.addEventListener('change', (ev) => {
        if (ev.detail.userchange) {
          document.documentElement.style.setProperty(ACCENT_CSS_CUSTOMPROPERTY, ev.detail.value);
        }
      });
      this._manageObserver();
    }, 0)
  }

  disconnectedCallback() {
    this._manageObserver();
  }

  _getAccentColor() {
    return window
     .getComputedStyle(document.documentElement)
     .getPropertyValue(ACCENT_CSS_CUSTOMPROPERTY)
     .replace(/\s+/gm, '');
   }

   _manageObserver() {
    if (this._observer) {
      this._observer.disconnect();
      return;
    }

    this._observer = new MutationObserver((entries) => {
      entries.forEach(({ attributeName }) => {
        if (attributeName !== 'style') {
          this.value = this._getAccentColor();
        }
      });
    })
    this._observer.observe(document.documentElement, { attributes: true });
  }

  get value() {
    return this.getAttribute('value');
  }

  set value(newVal) {
    this.setAttribute('value', newVal);
  }

  static get observedAttributes() {
    return ['value'];
  }

  attributeChangedCallback(attrName) {
    if (attrName === 'value' && Array.isArray(this._colors)) {
      this._colorfield.color = this.value;
    }
  }

  get value() {
    return this.getAttribute('value');
  }

  set value(newVal) {
    this.setAttribute('value', newVal);
  }

  async loadColors(hexcolors) {
    let colors = Array.isArray(hexcolors) ? hexcolors : [];
    if (typeof hexcolors === 'string') {
      colors = await fetch(hexcolors).then((res) => res.json()); 
    }

    this._colors = colors.map(this._colorfield.hexToRGB);
  }
}

function getDistance(input, ref) {
  const total = Object.keys(input).reduce((base, key) => {
    return base + Math.pow(input[key] - ref[key], 2);
  }, 0);
  return Math.sqrt(total);
}

function getClosestColor(colors, target) {
  if (!colors || !target) {
    return {};
  }

  const distances = colors.map((color) => getDistance(target, color));
  const closestDistance = Math.min(...distances);
  const index = distances.findIndex((distance) => distance === closestDistance);
  return {
    closest: colors[index], // { r, g, b }
    distance: closestDistance,
    original: target // { r, g, b }
  }
}

window.customElements.whenDefined('js-colorfield').then(() => {
  window.customElements.define('closest-color', ClosestColor);
});