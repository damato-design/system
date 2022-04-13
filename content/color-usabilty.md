---
page: Color
anchor: Usability
order: 3
---

## Usability

In choosing colors, accessibility must be a priority. With the layout colors selected at opposite ends of the scale, this ensures that if a gray on one side appears as text on top of a gray on the other side. The text _should_ pass accessibility standards (assuming the font size is appropriate). Accent colors are then chosen from a predetermined list and then reviewed for accessibility measurements and were considerate to not be based on cultural expectations.

### WCAG accessible text

While there are now [different standards between AA and AAA](https://www.w3.org/TR/WCAG21/#contrast-minimum) which also relate to font size, a general rule is to ensure a 4.5:1 contrast ratio between the background color and text. Throughout the site, this ratio is typically much higher. You can use the colorfield control below to test the ratio between a chosen text color and the current background color of the site. This should also update when changing the system color.

<a11y-color></a11y-color>

::: audience-engineer
The process in creating this functionality is outlined in the article _[Building your own color contrast checker](https://dev.to/alvaromontoro/building-your-own-color-contrast-checker-4j7o)_ which also explains the calculations involved to determine the ratio.
:::

This isn't enough to simply select a high contrast between the background and text. Certain contrasts cause [Irlen Syndrome](https://irlen.com/what-is-irlen-syndrome/) which some people perceive the text to move on the page due to contrast sensitivity. The contrast between grayscale steps was adjusted to mitigate this.

::: audience-designer
The research explained in _[Designers should avoid pure black typography — but which dark gray should we use?](https://uxdesign.cc/designers-should-avoid-pure-black-typography-but-which-dark-gray-should-we-use-2d7faa07083a)_ provides insight that `hsl(0, 0, 15%)` was a contrast that reduced the effect of moving text. This value was a target when crafting the formula to step the grayscale.
:::

### Accent colors

The colorfield component above provides the [Euclidean distance](https://en.wikipedia.org/wiki/Euclidean_distance "Euclidean distance on Wikipedia") between the chosen color and a color from the list.

<closest-color></closest-color>

This tool was used to select the accent colors on the site that were close to desired hues. Admittedly, the accent colors selected for the site _do not_ meet the 4.5:1 contrast ratio for both the light and dark themes and therefore you will find the majority of text is not given an accent color _unless_ it is actionable. Actionable text styles and colors have been modified slightly to increase legibility to allow for accent colors to be used in these locations.

::: audience-engineer
The article _[Which Colors Look Good on Black and White?](https://dev.to/finnhvman/which-colors-look-good-on-black-and-white-2pe6)_ ends with a list of colors however, it would appear that these colors are _only_ for black and white. Additionally, a post within the UX Stack Exchange also asks for a _[Background colour suitable for both black and white text](https://ux.stackexchange.com/questions/73763/background-colour-suitable-for-both-black-and-white-text)_ with [an answer](https://ux.stackexchange.com/questions/73763/background-colour-suitable-for-both-black-and-white-text "Answer: Background colour suitable for both black and white text") providing a link to a much larger table of colors. That link is broken however, there is a  [backup](https://maswildan.wordpress.com/2016/08/28/color-contrast-on-blackwhite-background/ "mas wildan WordPress site"). This is a [json file](json/a11yColorsOnBlackAndWhite.json "Accessible colors on black and white .json") with the referenced colors. Those colors are loaded into the colorfield component and the accent colors were chosen from this set.
:::

Unlike many other systems, **no color is selected to represent something good or bad**. [Different colors mean different things to different cultures](https://uxplanet.org/understanding-color-psychology-though-culture-symbolism-and-emotion-215102347276 "Medium: Understanding color psychology though culture, symbolism, and emotion"). This could be rectified with localized color theming with a large effort for coverage or by choosing not including color as status. The system expects to use other patterns to help guide the user in understanding a meaning of state.