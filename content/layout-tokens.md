---
page: Layout
anchor: Design Tokens
order: 1
---

## Design Tokens

The layout design tokens come in a single group (**genitive**, relating to each other) which can be applied in the page or within components.

Unlike color and typography, spacing has been curated without a separate layer of component (**locative**, determined by placement) token values. This is because the spacing values will not only affect the components but also how the components are arranged on the page. There is no conceivable method to generally name and define where these spacing values would be applied outside of the component library. Additionally, if design tokens outside of this system followed these patterns, they should also include namespacing (a prefix) to differentiate from other variables that may appear in the application.

### Genitive Layout Tokens
These tokens describe the general family that possess all the layout values as human-readable names. They can be applied anywhere spacing or elevation needs to be defined.

#### Spacing tokens
These are applied by multiplying the token within a `calc()` function by `1rem` as the value of the property.
| Token | Description | Value |
| ----- | ----------- | ----- |
| `--density--xs` | Extra-small spacing factor. | `.25` |
| `--density--sm` | Small spacing factor. | `.5` |
| `--density--md` | Medium spacing factor. | `1` |
| `--density--lg` | Large spacing factor. | `2` |
| `--density--xl` | Extra-large spacing factor. | `4` |

#### Elevation tokens
While this is _technically_ a locative color token, it has a direct relationship with the perception of elevation. It is also the only translucent color token.
| Token | Description | Value |
| ----- | ----------- | ----- |
| `--boxElevated--shadowColor` |  Describes the shadow color for elevated containers. This includes some translucent alpha channel. | <span class="swatch" style="background: var(--boxElevated--shadowColor)" ></span> |

