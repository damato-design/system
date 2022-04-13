---
page: Typography
anchor: Design Tokens
order: 1
---

## Design Tokens

The typography design tokens come in a few tiers which allow for a separation of concerns. The first tier of tokens (**genitive**, relating to each other) describe all of the typography variations we expect to use throughout the site. The second tier of tokens (**locative**, determined by placement) describe all of the components and properties we expect to use these tokens. Additionally, if design tokens outside of this system followed these patterns, they should also include namespacing (a prefix) to differentiate from other variables that may appear in the application.

### Genitive Typography Tokens
These tokens describe the general family that possess all the typography values as human-readable names. They should not be applied directly to components or styles but instead referenced as the value for locative typography tokens.

#### General font property tokens
| Token | Description | Value |
| ----- | ----------- | ----- |
| `--fontFamily--sans` | The sans-serif font family. | `Jost, sans-serif` |
| `--fontWeight--normal` | Normal font weight. | `400` |
| `--fontWeight--medium` | Medium font weight, slightly more bold than normal. | `500` |
| `--fontWeight--bold` | Bold font weight, much more bold than normal. | `700` |
| `--lineHeight--paragraph` | The line-height value expected for paragraphs. | `1.5` |
| `--lineHeight--headline` | The line-height value expected for headlines. | `1.25` |

### Remscale tokens
The rem scale is created exponentially and expected to be multiplied to `1rem` in a `calc()` function.
| Token | Description | Value |
| ----- | ----------- | ----- |
| `--remscale--xs` | Extra-small font size, only used in examples relating to font-size | `.51` |
| `--remscale--sm` | Small font size, used for captions and auxiliary text | `.714` |
| `--remscale--md` | Default font size, used for body text | `1` |
| `--remscale--lg` | Large font size, used some less important headlines | `1.4` |
| `--remscale--xl` | Extra-large font size, used for important headlines | `1.96` |
| `--remscale--2xl` | Double extra-large font size, used for the most important headlines | `2.744` |
| `--remscale--3xl` | Triple extra-large font size, only used in examples relating to font-size | `3.842` |

### Locative Typography Tokens
These tokens describe the place where the typography is intented to be used. These are applied directly to CSS style properties of components. Font sizes can be sampled within the [curation](#curation "DAMATO Design, Typography Curation") section of this page.

#### Paragraph Text
| Token | Description | Value |
| ----- | ----------- | ----- |
| `--textParagraph--fontFamily` | The font family for paragraphs. | `var(--fontFamily--sans)` |
| `--textParagraph--fontSize` | The font size for paragraphs. | `calc(var(--fontSize--md) * 1rem)` |
| `--textParagraph--fontWeight` | The font weight for paragraphs. | `var(--fontWeight--normal)` |
| `--textParagraph--lineHeight` | The line height for paragraphs. | `var(--lineHeight--paragraph)` |

#### Action Text
Actions also are set to all capitals to differentiate from body text. Due to this modification, the text is set [slightly smaller than the medium size](https://learnui.design/blog/mobile-desktop-website-font-size-guidelines.html#3-secondary-text-should-be-about-2-sizes-smaller-than-your-paragaph-text "Secondary text should be about 2 sizes smaller than your paragaph text").
| Token | Description | Value |
| ----- | ----------- | ----- |
| `--textAction--fontFamily` | The font family for buttons, links | `var(--fontFamily--sans)` |
| `--textAction--fontSize` | The font size for buttons, links, this is adjusted for the text transformation at the component for buttons | `calc(var(--fontSize--md) * 1rem)` |
| `--textAction--fontWeight` | The font weight for buttons, links | `var(--fontWeight--medium)` |
| `--textAction--lineHeight` | The line height for buttons, links | `var(--lineHeight--paragraph)` |

#### Label Text
Labels also are set to all capitals to differentiate from body text. Due to this modification, the text is set [slightly smaller than the medium size](https://learnui.design/blog/mobile-desktop-website-font-size-guidelines.html#3-secondary-text-should-be-about-2-sizes-smaller-than-your-paragaph-text "Secondary text should be about 2 sizes smaller than your paragaph text").
| Token | Description | Value |
| ----- | ----------- | ----- |
| `--textLabel--fontFamily` | The font family for labels | `var(--fontFamily--sans)` |
| `--textLabel--fontSize` | The font size for labels, this is adjusted for the text transformation at the component | `calc(var(--fontSize--md) * 1rem)` |
| `--textLabel--fontWeight` | The font weight for labels | `var(--fontWeight--medium)` |
| `--textLabel--lineHeight` | The line height for labels | `var(--lineHeight--paragraph)` |

#### Primary Heading Text
| Token | Description | Value |
| ----- | ----------- | ----- |
| `--textHeading1--fontFamily` | The font family for h1 elements | `var(--fontFamily--sans)` |
| `--textHeading1--fontSize` | The font size for h1 elements | `calc(var(--fontSize--2xl) * 1rem)` |
| `--textHeading1--fontWeight` | The font weight for h1 elements | `var(--fontWeight--bold)` |
| `--textHeading1--lineHeight` | The line height for h1 elements | `var(--lineHeight--headline)` |

#### Secondary Heading Text
| Token | Description | Value |
| ----- | ----------- | ----- |
| `--textHeading2--fontFamily` | The font family for h2 elements | `var(--fontFamily--sans)` |
| `--textHeading2--fontSize` | The font size for h2 elements | `calc(var(--fontSize--xl) * 1rem)` |
| `--textHeading2--fontWeight` | The font weight for h2 elements | `var(--fontWeight--bold)` |
| `--textHeading2--lineHeight` | The line height for h2 elements | `var(--lineHeight--headline)` |

#### Teriary Heading Text
| Token | Description | Value |
| ----- | ----------- | ----- |
| `--textHeading3--fontFamily` | The font family for h3 elements | `var(--fontFamily--sans)` |
| `--textHeading3--fontSize` | The font size for h3 elements | `calc(var(--fontSize--lg) * 1rem)` |
| `--textHeading3--fontWeight` | The font weight for h3 elements | `var(--fontWeight--medium)` |
| `--textHeading3--lineHeight` | The line height for h3 elements | `var(--lineHeight--headline)` |

#### Quaternary Heading Text
| Token | Description | Value |
| ----- | ----------- | ----- |
| `--textHeading4--fontFamily` | The font family for h4 elements | `var(--fontFamily--sans)` |
| `--textHeading4--fontSize` | The font size for h4 elements | `calc(var(--fontSize--md) * 1rem)` |
| `--textHeading4--fontWeight` | The font weight for h4 elements | `var(--fontWeight--medium)` |
| `--textHeading4--lineHeight` | The line height for h4 elements | `var(--lineHeight--headline)` |

#### Caption Text
| Token | Description | Value |
| ----- | ----------- | ----- |
| `--textCaption--fontFamily` | The font family for captions | `var(--fontFamily--sans)` |
| `--textCaption--fontSize` | The font size for captions | `calc(var(--fontSize--sm) * 1rem)` |
| `--textCaption--fontWeight` | The font weight for captions | `var(--fontWeight--normal)` |
| `--textCaption--lineHeight` | The line height for captions | `var(--lineHeight--paragraph)` |

#### Quote Text
| Token | Description | Value |
| ----- | ----------- | ----- |
| `--textQuote--fontFamily` | The font family for quotations | `var(--fontFamily--sans)` |
| `--textQuote--fontSize` | The font size for quotations | `calc(var(--fontSize--lg) * 1rem)` |
| `--textQuote--fontWeight` | The font weight for quotations | `var(--fontWeight--medium)` |
| `--textQuote--lineHeight` | The line height for quotations | `var(--lineHeight--paragraph)` |