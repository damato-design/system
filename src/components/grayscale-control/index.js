class GrayscaleControl extends window.HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).innerHTML = `
      <toggle-range type="range" step="1" min="1" max="8">
        Grayscale Factor
      </toggle-range>
    `;
  }

  connectedCallback() {
    const { documentElement } = document;
    window.customElements.whenDefined('toggle-range').then(() => {
      this._$range = this.shadowRoot.querySelector('toggle-range');
      this._$range.addEventListener('change', ({ detail }) =>  documentElement.style.setProperty(this.reference, detail.value));

      this._$range.value = window.getComputedStyle(documentElement).getPropertyValue(this.reference);
    });
  }

  get reference() {
    return this.getAttribute('reference');
  }
  
}

window.customElements.define('grayscale-control', GrayscaleControl);
