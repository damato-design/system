import json from './colors.json';
class DeltaColorAccent extends window.HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).innerHTML = `
      <delta-color>
        <span slot="label-input">Chosen</span>
        <span slot="label-delta">Distance</span>
        <span slot="label-output">Closest</span>
      </delta-color>
    `;
  }

  connectedCallback() {
    window.customElements.whenDefined('delta-color').then(() => {
      const control = this.shadowRoot.querySelector('delta-color');
      const colors = json.map((color) => control.toObject(color));
      control.onColorChange = (input) => {
        const { closest, distance } = getClosestColor(colors, input);
        document.body.style.setProperty(this.reference, closest);
        return { 
          delta: distance && distance.toFixed(2),
          output: closest,
        };
      }

      control.color = window.getComputedStyle(document.body).getPropertyValue(this.reference);
    });
  }

  get reference() {
    return this.getAttribute('reference');
  }
}

function getClosestColor(colors, input) {
  const distances = colors.map((color) => compare(input, color));
  const distance = Math.min(...distances);
  return {
    closest: colors[distances.indexOf(distance)],
    distance
  }
}

function compare(input, color) {
  const total = ['r', 'g', 'b'].reduce((base, key) => base + Math.pow(input[key] - color[key], 2), 0);
  return Math.sqrt(total);
}

window.customElements.define('delta-color-accent', DeltaColorAccent);
