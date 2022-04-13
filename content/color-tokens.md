---
page: Color
anchor: Design Tokens
order: 1
---

## Design Tokens
The color design tokens come in a few tiers which allow for theming between light and dark modes. The first tier of tokens (**genitive**, relating to each other) describe all of the colors we expect to use throughout the site. The second tier of tokens (**locative**, determined by placement) describe all of the components and properties we expect to use these tokens. Additionally, if design tokens outside of this system followed these patterns, they should also include namespacing (a prefix) to differentiate from other variables that may appear in the application.

### Genitive Color Tokens
These tokens describe the general family that possess all the colors as human-readable names. They should not be applied directly to components or styles but instead referenced as the value for locative color tokens.

#### Accent color RGB values
These are applied by adding the token within an `rgb()` function.
| Token | Description | Value |
| ----- | ----------- | ----- |
| `--color--green` | The green accent color | `25, 130, 120` |
| `--color--pink` | The pink accent color | `205, 40, 175` |
| `--color--blue` | The blue accent color | `5, 106, 255` |

#### Accent color tokens
| Token | Description | Value |
| ----- | ----------- | ----- |
| `--accent--defaultColor` | The color to represent an accent. This may change at the application level to another color in this family. | <span class="swatch" style="background: rgb(var(--color--green));" ></span> |
| `--accent--everyoneColor` | The color to represent all audiences. | <span class="swatch" style="background: rgb(var(--color--green));" ></span> |
| `--accent--designerColor` | The color to represent a designer audience. | <span class="swatch" style="background: rgb(var(--color--pink));" ></span> |
| `--accent--engineerColor` | The color to represent an engineer audience. | <span class="swatch" style="background: rgb(var(--color--blue));" ></span> |
| `--onAccent--defaultColor` | The color expected to appear on the accent color when it is used as a background. This is always set to white regardless of theme. | <span class="swatch" style="background: rgb(255, 255, 255);" ></span> |

#### Grayscale tokens
These are applied by adding the token as a lightness value within [a formula](#curation "DAMATO Design, Color Curation") for the `hsl()` function.
| Token | Description | Value |
| ----- | ----------- | ----- |
| `--infragray--3` | Three exponential steps away from middle gray, toward white. | <span class="swatch" style="background: hsl(0, 0%, calc(100% / (1 + var(--infragray--3))))" ></span> |
| `--infragray--2` | Two exponential steps away from middle gray, toward white. | <span class="swatch" style="background: hsl(0, 0%, calc(100% / (1 + var(--infragray--2))))" ></span> |
| `--infragray--1` | One exponential step away from middle gray, toward white. | <span class="swatch" style="background: hsl(0, 0%, calc(100% / (1 + var(--infragray--1))))" ></span> |
| `--ultragray--1` | One exponential step away from middle gray, toward black. | <span class="swatch" style="background: hsl(0, 0%, calc(100% / (1 + var(--ultragray--1))))" ></span> |
| `--ultragray--2` | Two exponential steps away from middle gray, toward black. | <span class="swatch" style="background: hsl(0, 0%, calc(100% / (1 + var(--ultragray--2))))" ></span> |
| `--ultragray--3` | Three exponential steps away from middle gray, toward black. | <span class="swatch" style="background: hsl(0, 0%, calc(100% / (1 + var(--ultragray--3))))" ></span> |

### Locative Color Tokens
These tokens describe the place where the color is intented to be used. These are applied directly to CSS style properties of components. These colors will change value based on the current theme.

#### Boxes
This family of tokens describe containers for content.
| Token | Description | Value |
| ----- | ----------- | ----- |
| `--box--backgroundColor` | Describes the background color of the main content areas | <span class="swatch" style="background: var(--box--backgroundColor)" ></span> |
| `--box--foregroundColor` | Describes the foreground (text) color of the main content areas | <span class="swatch" style="background: var(--box--foregroundColor)" ></span> |
| `--box--borderColor` | Describes the border color of the main content areas | <span class="swatch" style="background: var(--box--borderColor)" ></span> |
| `--boxLowContrast--backgroundColor` | Describes the background color of the area which relate to the main areas with a slight contrast. | <span class="swatch" style="background: var(--boxLowContrast--backgroundColor)" ></span> |
| `--boxLowContrast--foregroundColor` |  Describes the foreground (text) color of the area which relate to the main areas with a slight contrast. | <span class="swatch" style="background: var(--boxLowContrast--foregroundColor)" ></span> |
| `--boxLowContrast--borderColor` |  Describes the border color of the area which relate to the main areas with a slight contrast. | <span class="swatch" style="background: var(--boxLowContrast--borderColor)" ></span> |
| `--boxHighContrast--backgroundColor` | Describes the background color of the area which relate to the main areas with a large contrast. | <span class="swatch" style="background: var(--boxHighContrast--backgroundColor)" ></span> |
| `--boxHighContrast--foregroundColor` |  Describes the foreground (text) color of the area which relate to the main areas with a large contrast. | <span class="swatch" style="background: var(--boxHighContrast--foregroundColor)" ></span> |
| `--boxHighContrast--borderColor` |  Describes the border color of the area which relate to the main areas with a large contrast. | <span class="swatch" style="background: var(--boxHighContrast--borderColor)" ></span> |

### Actions
This family descrbes colors for buttons and links. In some cases, the color on the component is either transparent or inherited from the parent.
| Token | Description | Value |
| ----- | ----------- | ----- |
| `--action--backgroundColor` | Describes the background color of the button or link. | <span class="swatch" style="background: var(--action--backgroundColor)" ></span> |
| `--action--foregroundColor` | Describes the foreground (text) color of the button or link. | <span class="swatch" style="background: var(--action--foregroundColor)" ></span> |
| `--action--borderColor` | Describes the border color of the button or link. | <span class="swatch" style="background: var(--action--borderColor)" ></span> |
| `--action--outlineColor` | Describes the outline color of the button or link for use in focused styles. | <span class="swatch" style="background: var(--action--borderColor)" ></span> |
| `--actionHovered--backgroundColor` | Describes the background color of the button or link when hovered. | <span class="swatch" style="background: var(--actionHovered--backgroundColor)" ></span> |
| `--actionHovered--foregroundColor` | Describes the foreground (text) color of the button or link when hovered. | <span class="swatch" style="background: var(--actionHovered--foregroundColor)" ></span> |
| `--actionHovered--borderColor` | Describes the border color of the button or link when hovered. | <span class="swatch" style="background: var(--actionHovered--borderColor)" ></span> |

#### Controls
This family describes colors for form elements. In some cases, the color on the component is either transparent or inherited from the parent.
| Token | Description | Value |
| ----- | ----------- | ----- |
| `--control--backgroundColor` | Describes the background color of the control. | <span class="swatch" style="background: var(--control--backgroundColor)" ></span> |
| `--control--foregroundColor` | Describes the foreground (text) color of the control. | <span class="swatch" style="background: var(--control--foregroundColor)" ></span> |
| `--control--borderColor` | Describes the border color of the control. | <span class="swatch" style="background: var(--control--borderColor)" ></span> |
| `--control--outlineColor` | Describes the outline color of the control for use in focused styles. | <span class="swatch" style="background: var(--control--outlineColor)" ></span> |