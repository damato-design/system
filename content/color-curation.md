---
page: Color
anchor: Curation
order: 2
---

## Curation

::: audience-designer
The selection of colors in similar to the process outlined in _[Speccing Colors in Design Systems](https://medium.com/@ethersystem/speccing-colors-in-design-systems-f06e91ed9ca0)_. 
:::

Beginning with layout colors; assuming everything is designed as grayscale. This is easy to visualize as wireframing with pencil and paper. This provides a perfect opportunity to identify the core user experience and lessen the concern about the personality of the interface. From there, accent colors were chosen to provide some charm and context.

### Grays
A simple rule set here was to have three shades toward both ends of grayscale; 3 dark grays (including black) and 3 light grays (including white). This means there isn't a traditional material scale of color. Colors toward the middle of the scale tend to be less accessible, especially when mixing with more saturated colors.

> It was all about contrast. _[Ether @Medium](https://medium.com/@ethersystem)_

The color steps of gray follow a [logistic curve](https://mathworld.wolfram.com/LogisticEquation.html "Wolfram Alpha Logistic Equation"), meaning they increment exponentially from the middle gray. The formula to determine the level of gray is the following:

- **RGB**: 255 / 1 + grayscale<sup>step</sup>, result is the number for each color channel.
- **HSL**: 100 / 1 + grayscale<sup>step</sup>, result is the percentage of lightness (0% saturation).

Step 0 results in middle gray, each step either goes toward black (_ultragray_) or white (_infragray_). The grayscale value is where curation occurs as we can tune this to have more or less contrast between the grays. The higher the grayscale value, the more contrast between infragray and ultragray (which also results in _less_ contrast between grays on the same side of the scale). You can see the effect of the value with the range control below.

<grayscale-range></grayscale-range>

::: audience-engineer
### Calculating Gray in CSS

At first glance the formula for grayscale might look impossible in CSS however, we can use a trick outlined done in CSS typography found in _[A Responsive Guide to Type Sizing](https://cloudfour.com/thinks/responsive-guide-to-type-sizing/)_ to create exponential scales.

```css
:root {
  --grayscale--factor: 5;
  --midgray: 1;
  --ultragray--1: calc(var(--midgray) * var(--grayscale--factor));
  --ultragray--2: calc(var(--ultragray--1) * var(--grayscale--factor));
  --ultragray--3: calc(var(--ultragray--2) * var(--grayscale--factor));
	
  --infragray--1: calc(var(--midgray) / var(--grayscale--factor));
  --infragray--2: calc(var(--infragray--1) / var(--grayscale--factor));
  --infragray--3: calc(var(--infragray--2) / var(--grayscale--factor));
}
```

From here, each area where we want to apply the actual gray, we use a `calc` function within `hsl()`. A simplier method of leveraging this is done within the article _[Calculating Color: Dynamic Color Theming with Pure CSS](https://una.im/css-color-theming/)_. This is where the logistic curve formula from above is applied, we use `hsl()` as only one value needs to be updated.

```css
.myComponent {
  background-color: hsl(0, 0%, calc(100% / 1 + var(--ultragray--3))); /* nearly black */
  color: hsl(0, 0%, calc(100% / 1 + var(--infragray--3))); /* nearly white */
}
```

A drawback to this is `window.getComputedStyle()` cannot resolve this color.
:::

### Accent colors
Accent colors were chosen first by general hue then by [accessibility measurements](#usability "DAMATO Design, Color Usability") and finally applied to denote a user interaction or areas of interest. Many of the components that which can take an action are indicated using the accent color.

- <span class="badge bg-everyone">Green</span> is meant to indicate the content is for all audiences.
- <span class="badge bg-designer">Pink</span> is meant to indicate the content is for designers.
- <span class="badge bg-engineer">Blue</span> is meant to indicate the content is for engineers.

This is unique to the purposes of this site and its contents. For most of the site, a single accent color is chosen to enhance the user interface, except in areas where a specific audience is expected.

::: audience-engineer
The system _could_ have leveraged [a technique to compute the high contrast colors via CSS Custom Properties](https://css-tricks.com/css-variables-calc-rgb-enforcing-high-contrast-colors/ "CSS Variables + calc() + rgb() = Enforcing High Contrast Colors"), the accent colors were curated so that each used as a background color would pair well with a white foreground color (versus a black foreground color).
:::