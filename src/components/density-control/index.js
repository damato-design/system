const UNIT_PARSE_REGEX = /(?<number>[\d.]+)(?=\w)/i;

class DensityControl extends window.HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).innerHTML = `
      <toggle-range type="range" step="0.1" min="0.1" max="0.9">
        Density Factor
      </toggle-range>
    `;
  }

  connectedCallback() {
    const { documentElement } = document;
    window.customElements.whenDefined('toggle-range').then(() => {
      const units = window.getComputedStyle(documentElement).getPropertyValue(this.reference);

      this._$range = this.shadowRoot.querySelector('toggle-range');
      this._$range.addEventListener('change', ({ detail }) => 
        documentElement.style.setProperty(this.reference, units.replace(UNIT_PARSE_REGEX, detail.value)));

      const { groups } = units.match(UNIT_PARSE_REGEX) || {};
      this._$range.value = Number(groups.number) || .5;
    });
  }

  get reference() {
    return this.getAttribute('reference');
  }
  
}

window.customElements.define('density-control', DensityControl);
