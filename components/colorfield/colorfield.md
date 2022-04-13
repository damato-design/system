---
page: Components
anchor: Colorfield
---

## Colorfield

The colorfield component is highly specific to the needs of the design system pages. It is used to allow a user to choose a color and compute an output from it.

::: audience-designer
- The input area always displays the selected color as a background, the text color will always contrast the selected color. The styles should otherwise mimic button styles except for font, which will inherit from the body and not change case.
- The final value can either be a color (which should be colored in a similar way to the input) or a single value with no color applied. The styles should balance with the input in terms of spacing and alignment.
- While only the input area may look interactive, the entire component can be tapped to change the value of the input.
- When the component is focused, a dashed line should surround the entire component.
- The delta between the input and value is never a color but instead a represented difference between the input and the final value.
- Labels should be all uppercase, medium weight, and .9rem from the root font size to counteract the change in case.
- All other text should match body font properties. 
- When the horizontal layout will not fit inside of its container, each part will stack vertically. Label first then the display below.
:::

::: audience-engineer
To achieve the layout shifting when the component is too wide for its container, the [Fab Four technique](https://www.freecodecamp.org/news/the-fab-four-technique-to-create-responsive-emails-without-media-queries-baf11fdfa848/) is used. This snaps the width at container breakpoints by forcing negative widths to refer to a minimum width. More information can be found in the article _[Responsive CSS without Media Queries](https://www.sitepoint.com/responsive-css-patterns-without-media-queries/)_.
:::

<blu-colorfield selfdocument>
  <label slot="label-input">Input</label>
  <label slot="label-delta">Delta</label>
  <label slot="label-value">Value</label>
</blu-colorfield>
