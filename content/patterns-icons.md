---
page: Patterns
anchor: Icons
order: 3
---

## Icons

Icons can often help in small areas or where translation is difficult. We should always [attempt to include text along with an icon](https://givegoodux.com/the-right-way-to-use-icons-in-your-ui/) for the best approach at clarity in meaning, as [some icons could be considered non-standard](https://stuffandnonsense.co.uk/blog/we_need_a_standard_show_navigation_icon_for_responsive_web_design) and [universal icons are rare](https://www.nngroup.com/articles/icon-usability/).

They can be effective in enhancing visual interest, focusing users' attention, and help in wayfinding. Everything in moderation; use too many and the interface may become distracting.

Instead of designing all of the icons from scratch, this system leverages the outlined icon set provided by [Material Design](https://material.io/resources/icons).

::: audience-designer
For techniques on curating custom icons, please refer to _[A complete guide to iconography](https://www.designsystems.com/iconography-guide/)_.
:::

::: audience-engineer
### Using web-components
Throughout the site, icons are usually handled with a custom web-component which was a decision based on the exploration outlined in _[The Road to SVG and Custom Elements in Clarity Icons](https://medium.com/claritydesignsystem/the-road-to-svg-and-custom-elements-in-clarity-icons-1d691c6cc91)_. The implementation here is just a light wrapper for a project called [`Savager`](https://www.npmjs.com/package/savager) which handles all of the messy SVG failsafes. Icons are rendered using a reference sheet on the page. This keeps the external requests low but would bloat a page with a system that has many icons.

[You could host SVGs externally](https://css-tricks.com/svg-use-with-external-reference-take-2/ "SVG `use` with External Reference, Take 2") but the drawback is SVGs are susceptible to CORS. If you were to host the SVG group file on a CDN, it would need to be under the same domain. `Savager` does a similar injection for web components because the reference does not cross the ShadowDOM. This system also does its icons available externally ([example, view source](icons/bang-triangle.svg)) when that approach is appropriate.
:::