const GRAYSCALE_CSS_CUSTOMPROPERTY = '--grayscale--factor';

class GrayscaleRange extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
    <js-togglerange type="range" min="1" max="8" step="1">
      Grayscale Factor
      <output slot="output"></output>
    </js-togglerange>`;

    this._toggleRange = this.shadowRoot.querySelector('js-togglerange');
  }

  connectedCallback() {
    setTimeout(() => {
      this._toggleRange.setComputedStyleValue(GRAYSCALE_CSS_CUSTOMPROPERTY);
      this._toggleRange.addEventListener('change', (ev) => {
        document.documentElement.style.setProperty(GRAYSCALE_CSS_CUSTOMPROPERTY, ev.detail.value);
      });
    }, 0);
  }
}

window.customElements.whenDefined('js-togglerange').then(() => {
  window.customElements.define('grayscale-range', GrayscaleRange);
});