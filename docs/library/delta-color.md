---
title: Delta Color
---

# Delta Color

This component is helpful for demostrating a color transformation. The input is a browser color picker and the selected color is displayed in RGB on the left. The color is transformed based on the needs of the experience and shown as an RGB value on the right. The middle value can display a value important to be conveyed during the transformation.

## Example

<delta-color></delta-color>

{% audience "engineer" %}

### Mounting

In order to work with this component, you first must make sure it is defined. If using within another web component, check for the definition first in the connected callback before completing the wiring.

```js
class MyComponent extends window.HTMLElement {
  constructor() { super() }
  connectedCallback() {
    window.customElements.whenDefined('delta-color').then(() => {
      // component is defined
    });
  }
}
```

### Wiring

Next you'll add a function to the `onColorChange` property of the element. The function will give you the color as a RGB object as the only argument when the color is changed. You can create your own RGB object using the `toObject()` method on the element for comparisons.

```js
const json = ['#ff0000']; // Assume list of hex colors
class MyComponent extends window.HTMLElement {
  constructor() { super() }
  connectedCallback() {
    window.customElements.whenDefined('delta-color').then(() => {
      const colors = json.map((color) => control.toObject(color));
      control.onColorChange = (input) => {};
    });
  }
}
```

### Labeling

There are three slots used to define the labels for the `delta-color` component. Below is the HTML used to compose the `delta-color-accent` component used in the [Color examples](foundations/color).

```html
<delta-color>
  <span slot="label-input">Chosen</span>
  <span slot="label-delta">Distance</span>
  <span slot="label-output">Closest</span>
</delta-color>
```

{% endaudience %}