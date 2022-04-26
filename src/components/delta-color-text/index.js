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
    let userchange;
    window.customElements.whenDefined('delta-color').then(() => {
      const control = this.shadowRoot.querySelector('delta-color');
      const { luminance, toObject } = control;
      control.onColorChange = (input) => {
        const { backgroundColor } = window.getComputedStyle(document.body);    const params = [toObject(backgroundColor), input].map(luminance);
        const ratio = getRatio(...params);

        if (userchange) {
          document.body.style.setProperty(this.reference, input);
        } else {
          userchange = true;
        }

        return { 
          delta: `${(1/ratio).toFixed(1)}:1`,
          output: ratio < 1/4.5 ? 'Pass' : 'Fail',
          color: input
        };
      }

      const color = window.getComputedStyle(document.body).getPropertyValue(this.reference);
      control.color = parse(color);
    });
  }

  get reference() {
    return this.getAttribute('reference');
  }
}

/**
 * The hsl calculations for grayscale don't resolve well.
 * This function parses the calculations and inserts static grayvalues into an rgb function
 * 
 * @param {String} color - A css color string
 * @returns {String} - A maleable color string
 */
function parse(color) {
  if (color.trim().startsWith('hsl')) {
    // Convert to an rgb string
    const factor = color.replace(/\s+/gm, '').match(/[*\/]\d+/g);
    const calc = factor.reduce((math, str) => {
      return str.startsWith('*') ? math * Number(str.substring(1)) : math / Number(str.substring(1));
    }, 1);
    const value = parseInt(255 / (1 + calc), 10);
    return `rgb(${value}, ${value}, ${value})`;
  }
  return color;
}

function getRatio(bgLuma, fgLuma) {
  return bgLuma > fgLuma 
      ? ((fgLuma + 0.05) / (bgLuma + 0.05))
      : ((bgLuma + 0.05) / (fgLuma + 0.05));
}

window.customElements.define('delta-color-text', DeltaColorText);
