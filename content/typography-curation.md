---
page: Typography
anchor: Curation
order: 2
---

## Curation

The design system adheres to a [modular typescale](https://type-scale.com/) using an augmented fourth (1.4) as the scaling factor. Each step is identified using T-shirt sizing where the default is set to medium 1rem (16px). Each level past "extra" is numbered in that direction. You can use the control below to view how the factor affects the type on the site.

<typescale-range></typescale-range>

<div style="font-size: calc(var(--remscale--3xl) * 1rem)">font-size: 3xl</div>
<div style="font-size: calc(var(--remscale--2xl) * 1rem)">font-size: 2xl</div>
<div style="font-size: calc(var(--remscale--xl) * 1rem)">font-size: xl</div>
<div style="font-size: calc(var(--remscale--lg) * 1rem)">font-size: lg</div>
<div style="font-size: calc(var(--remscale--md) * 1rem)">font-size: md</div>
<div style="font-size: calc(var(--remscale--sm) * 1rem)">font-size: sm</div>
<div style="font-size: calc(var(--remscale--xs) * 1rem)">font-size: xs</div>

::: audience-designer
### Responsive Typography Decisions
In the current state of the system, the typography is not responsive to the viewport or device. While the technique outlined in _[css-only fluid modular type scales](https://utopia.fyi/blog/css-modular-scales/)_ to manage font-size and line-height is aligned with the overall approach of styles within the system, the expectation of having different scale factors between viewport sizes does not.

Instead, there may exist a future where one breakpoint adjusts font size between desktop and mobile as recommended within _[Responsive Typography: The Basics](https://ia.net/topics/responsive-typography-the-basics)_ but for the moment there is only one scale with defines one set of sizes. The rest is left up to the browser and user settings of the device.

The system has also opted to not [tame line-height](https://css-tricks.com/how-to-tame-line-height-in-css/ "How to Tame Line Height in CSS") by calculating the offset between the line-height box and the font leading as it was believed the effort outweighs the benefit.
:::

::: audience-engineer
### Computing the scale in CSS
The typescale is set using the methods followed in _[A Responsive Guide to Type Sizing](https://cloudfour.com/thinks/responsive-guide-to-type-sizing/)_ with a few modifications.

The first bit sets up the variables that will affect the scale.

```css
:root {
  --typescale--factor: 1.4; /* modular scale factor, augmented fourth */
  --remscale--md: 1; /* rem ratio, without units */
}
```

Then we create larger powers of the scale by multiplying the factor by a former result.

```css
:root {
  --remscale--lg: calc(var(--remscale--md) * var(--typescale--factor)); /* 1 * 1.4 -> 1.4  */
  --remscale--xl: calc(var(--remscale--lg) * var(--typescale--factor)); /* 1.4 * 1.4 -> 1.96 */
  --remscale--2xl: calc(var(--remscale--xl) * var(--typescale--factor)); /* 1.4 * 1.96 -> 2.744 */
}
```

This might look confusing to how the scale is generated. Another way of looking at this is if we were to create this in JavaScript.

```javascript
const typescaleFactor = 1.4;
const sizeMD = Math.pow(typescaleFactor, 0); /* 1.4^0 -> 1 */

const sizeLG = Math.pow(typescaleFactor, 1); /* 1.4^1 -> 1.4 */
const sizeXL = Math.pow(typescaleFactor, 2); /* 1.4^2 -> 1.96 */
const size2XL = Math.pow(typescaleFactor, 3); /* 1.4^3 -> 2.744 */
```

The pattern here is much easier to see and produces the same result. Similarly we divide the `var(--typescale--factor)` to make the font smaller. In JavaScript, this would just begin using negative numbers in the `Math.pow()` method.

For the purposes of our system, all fonts (and spacing for that matter) is set using `(r)em` units. Each font size design-token is then set using the T-shirt size multiplied by `1rem`.

```css
:root {
  --textLabel--fontSize: calc(var(--remscale--md) * 1rem);
}
```

And finally the design-token is then applied within a declaration block of the appropriate CSS selector.

```css
label {
  font-size: var(--textLabel--fontSize);
}
```
:::