const TYPESCALE_CSS_CUSTOMPROPERTY = '--typescale--factor';

class TypescaleRange extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
    <js-togglerange type="range" min="1" max="2" step="0.1">
      Typescale Factor
      <output slot="output"></output>
    </js-togglerange>`;

    this._toggleRange = this.shadowRoot.querySelector('js-togglerange');
    
  }

  connectedCallback() {
    setTimeout(() => {
      this._toggleRange.setComputedStyleValue(TYPESCALE_CSS_CUSTOMPROPERTY);
      this._toggleRange.addEventListener('change', (ev) => {
        document.documentElement.style.setProperty(TYPESCALE_CSS_CUSTOMPROPERTY, ev.detail.value);
      });
    }, 0);
  }
}

window.customElements.whenDefined('js-togglerange').then(() => {
  window.customElements.define('typescale-range', TypescaleRange);
});

