class DeltaColorText extends window.HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).innerHTML = `
      <delta-color>
        <span slot="label-input">Text Color</span>
        <span slot="label-delta">Ratio</span>
        <span slot="label-output">WCAG AA</span>
      </delta-color>
    `;
  }

  connectedCallback() {
    window.customElements.whenDefined('delta-color').then(() => {
      const control = this.shadowRoot.querySelector('delta-color');
      const { luminance, toObject } = control;
      control.onColorChange = (input) => {
        const { backgroundColor } = window.getComputedStyle(document.body);
        const params = [toObject(backgroundColor), input].map(luminance);
        const ratio = getRatio(...params);

        return { 
          delta: `${(1/ratio).toFixed(1)}:1`,
          output: ratio < 1/4.5 ? 'Pass' : 'Fail',
          color: input
        };
      }

      control.color = window.getComputedStyle(document.body).getPropertyValue(this.reference);
    });
  }

  get reference() {
    return this.getAttribute('reference');
  }
}

function getRatio(bgLuma, fgLuma) {
  return bgLuma > fgLuma 
      ? ((fgLuma + 0.05) / (bgLuma + 0.05))
      : ((bgLuma + 0.05) / (fgLuma + 0.05));
}

window.customElements.define('delta-color-text', DeltaColorText);
