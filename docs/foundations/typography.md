---
title: Typography
order: 3
---

# Typography

## Categories

There are three categories of typography:

  - **Heading**: Used for top-level headlines and titles.
  - **Standard**: Used for most content.
  - **Detail**: Used for auxiliary content.

Each category can have the following properties defined within a theme:

- `font-family` (example, `--text_standard_font-family`)
- `font-weight` (example, `--text_heading_font-weight`)
- `line-height` (example, `--text_detail_line-height`)
- `letter-spacing` (example, `--text_standard_letter-spacing`)

These values do not change between density contexts. Each value is applied to the entire category. This helps reduce the number of decisions needed to customize a theme. For example, this keeps the number of fonts loaded at a maximum of 3; one for each category.

## Font size

The font sizes steps are calculated using the [Major Third scale (1.25)](https://type-scale.com/) against the theme's standard font size (`--text_standard_font-size`, default: `1rem`). This scale allows for a noticable progression without exaggerated results. In other words, each step relates well to the next for content hierarchy.

## Relation to density

The typography scale is related directly to density where the `--text_standard_font-size` is used to calculate the font size for each category varying by the density context. In other words, as the density gets tighter, the font sizes for each category are reduced by one step of the scale.

An exception occurs for `<h1>` tags where the font size is an additional 1.25 times the size of the heading font size in the given density context. This exception is justified by providing a content hierarchy for the single most important heading without defining too many additional heading sizes.

## Avoiding vertical rhythm curation

Due to the [line-height box model](https://iamvdo.me/en/blog/css-font-metrics-line-height-and-vertical-align), there is little consideration for vertical rhythm. With more effort, [the given approach](https://iamvdo.me/en/blog/css-font-metrics-line-height-and-vertical-align#css-awesome) could be executed, however more metrics would need to be captured and set within the theme for each font used. As another option, if the [leading-trim specification](https://medium.com/microsoft-design/leading-trim-the-future-of-digital-typesetting-d082d84b202) is adopted across modern browsers this can be revisited.