const GRIDSCALE_CSS_CUSTOMPROPERTY = '--gridscale--factor';

class GridscaleRange extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
    <js-togglerange type="range" min="0.1" max="2" step="0.1">
      Gridscale Factor
      <output slot="output"></output>
    </js-togglerange>`;

    this._toggleRange = this.shadowRoot.querySelector('js-togglerange');
    
  }

  connectedCallback() {
    setTimeout(() => {
      this._toggleRange.setComputedStyleValue(GRIDSCALE_CSS_CUSTOMPROPERTY);
      this._toggleRange.addEventListener('change', (ev) => {
        document.documentElement.style.setProperty(GRIDSCALE_CSS_CUSTOMPROPERTY, ev.detail.value);
      });
    }, 0);
  }
}

window.customElements.whenDefined('js-togglerange').then(() => {
  window.customElements.define('gridscale-range', GridscaleRange);
});

