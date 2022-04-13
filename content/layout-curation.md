---
page: Layout
anchor: Curation
order: 2
---

## Curation

### Spacing

The overall method for managing spacing started by following a common paradigm in many design systems; [an 8 px/pt grid](https://material.io/design/layout/spacing-methods.html#baseline-grid "Material Design: Baseline grid"). However, instead of the default spacing being the 8px value, the system starts at 16px which relates to the root font-size (1rem). Each token in the spacing system [increments exponentially](https://eightshapes.com/articles/space-in-design-systems.html "Eight Shapes: Space in Design Systems"). The values are then calculated by multiplying the token by 1rem. You may sample an adjustment of the scaling factor with the slider below:

<gridscale-range></gridscale-range>

::: audience-designer
One of the first popular customizations of space was done within [the Gmail application](https://gmail.googleblog.com/2011/11/changing-information-density-in-gmails.html "Changing information density in Gmail’s new look"), where values of "comfortable", "cozy", and "compact" help provide a more personalize experience with little effort. Google Design has since [taken this concept to Material Design](https://medium.com/google-design/using-material-density-on-the-web-59d85f1918f0 "Medium: Using Material Density on the Web").
:::

#### Columnless

Unlike many other systems, **there is no concept of columns**. Content dictates the size of a component and if reusable spacing tokens are used throughout the page and components, they will align properly. This site only has one breakpoint which was determined _when the content breaks the layout_. At this point, the page shifts to a mobile-friendly layout.

> Think dynamically, how are these relationships working? _[Miriam Suzanne, Don’t Use My Grid System](https://www.clarityconf.com/session/dont-use-my-grid-system)_

::: audience-engineer
Components are engineered using the [Fab Four technique](https://www.freecodecamp.org/news/the-fab-four-technique-to-create-responsive-emails-without-media-queries-baf11fdfa848/) where appropriate. This eliminates the need for a page-level media query to manage component-level layout changes.
:::

### Elevation

The design system has simplified the concept of elevation is a very selective manner. Dropdown components do not flyout from the layout and therefore do not present themselves as elevated. The system has no modals; all content is inline with the current focus for the user. This also has an added benefit of not needing to juggle focus between elevated parts of the interface. For this site in particular, elevation only occurs in mobile, to display the list of navigational menu items over the content when the user opens the menu.