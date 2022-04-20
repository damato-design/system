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
        return { 
          delta: distance && distance.toFixed(2),
          output: closest,
        };
      }
    });
  }
}

function getClosestColor(colors, original) {
  const distances = colors.map((color) => compare(original, color));
  const distance = Math.min(...distances);
  return {
    closest: colors[distances.indexOf(distance)],
    distance,
    original
  }
}

function compare(input, ref) {
  const total = Object.keys(input).reduce((base, key) => {
    return base + Math.pow(input[key] - ref[key], 2);
  }, 0);
  return Math.sqrt(total);
}

window.customElements.define('delta-color-accent', DeltaColorAccent);
