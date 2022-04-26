---
title: Color
order: 2
---

# Color

Beginning with layout colors; assuming everything is designed as grayscale. This is easy to visualize as wireframing with pencil and paper. This provides a perfect opportunity to identify the core user experience and lessen the concern about the personality of the interface. From there, accent colors were chosen to provide some charm and context.

## Grayscale

A simple rule set here was to have three shades toward both ends of grayscale; 3 dark grays and 3 light grays. This means there isn't a traditional material scale of color. Colors toward the middle of the scale tends to be less accessible, especially when mixing with more saturated colors.

{% quote "https://medium.com/@ethersystem" "Ether @Medium" %}
It was all about contrast.
{% endquote %}

The color steps of gray follow a [logistic curve](https://mathworld.wolfram.com/LogisticEquation.html), meaning they increment exponentially from the middle gray. The formula to determine the level of gray is the following:

- **RGB**: 255 / 1 + grayscale<sup>step</sup>, result is the number for each color channel.
- **HSL**: 100 / 1 + grayscale<sup>step</sup>, result is the percentage of lightness (0% saturation).

Step 0 results in middle gray, each step either goes toward black (ultragray) or white (infragray). The grayscale value is where curation occurs as we can tune this to have more or less contrast between the grays. The higher the grayscale value, the more contrast between infragray and ultragray (which also results in less contrast between grays on the same side of the scale). You can see the effect of the value with the range control below.

INSERT_GRAYSCALE_CONTROL

## Accent Colors

Accent colors were chosen first by general hue then by accessibility measurements and finally applied to denote a user interaction or areas of interest. Many of the components that expect the use to take action are indicated using an accent color.

In choosing colors, accessibility must be a priority. With the layout colors selected at opposite ends of the scale, this ensures that if a gray on one side appears as text on top of a gray on the other side. The text should pass accessibility standards (assuming the font size is appropriate). Accent colors are then chosen from a predetermined list and then reviewed for accessibility measurements and were considerate to not be based on cultural expectations.

While there are now [different standards between AA and AAA](https://www.w3.org/TR/WCAG21/#contrast-minimum) which also relate to font size, a general rule is to ensure a 4.5:1 contrast ratio between the background color and text. Throughout the site, this ratio is typically much higher. You can use the colorfield control below to test the ratio between a chosen text color and the current background color of the site. This should also update when changing the system color.

<delta-color-text reference="--box_standard_foreground-color"></delta-color-text>

{% audience "engineer" %}

The process in creating this functionality is outlined in the article [Building your own color contrast checker](https://dev.to/alvaromontoro/building-your-own-color-contrast-checker-4j7o) which also explains the calculations involved to determine the ratio.

{% endaudience %}

This isn't enough to simply select a high contrast between the background and text. Certain contrasts cause [Irlen Syndrome](https://irlen.com/what-is-irlen-syndrome/) which some people perceive the text to move on the page due to contrast sensitivity. The contrast between grayscale steps was adjusted to mitigate this.

{% audience "designer" %}

The research explained in [Designers should avoid pure black typography — but which dark gray should we use?](https://uxdesign.cc/designers-should-avoid-pure-black-typography-but-which-dark-gray-should-we-use-2d7faa07083a) provides insight that `hsl(0, 0, 15%)` was a contrast that reduced the effect of moving text. This value was a target when crafting the formula to step the grayscale.

{% endaudience %}

The colorfield component below provides the [Euclidean distance](https://en.wikipedia.org/wiki/Euclidean_distance) between the chosen color and a color from the list.

<delta-color-accent reference="--feedback_standard_foreground-color"></delta-color-accent>

This tool was used to select the accent colors on the site that were close to desired hues. Admittedly, the accent colors selected for the site do not meet the 4.5:1 contrast ratio for both the light and dark themes and therefore you will find the majority of text is not given an accent color unless it is actionable.

{% aside %}

The article [Which Colors Look Good on Black and White?](https://dev.to/finnhvman/which-colors-look-good-on-black-and-white-2pe6) ends with a list of colors however, it would appear that these colors are only for black and white. Additionally, a post within the UX Stack Exchange also asks for a [Background colour suitable for both black and white text](https://ux.stackexchange.com/q/73763/71086) with [an answer](https://ux.stackexchange.com/a/86226/71086) providing a link to a much larger table of colors. That link is broken however, [there is a backup](https://maswildan.wordpress.com/2016/08/28/color-contrast-on-blackwhite-background/). This is a json file with the referenced colors. Those colors are loaded into the colorfield component and the accent colors were chosen from this set.

{% endaside %}

Unlike many other systems, **no color is selected to represent something good or bad**. [Different colors mean different things to different cultures](https://uxplanet.org/understanding-color-psychology-though-culture-symbolism-and-emotion-215102347276). This could be rectified with localized color theming with a large effort for coverage or by choosing not including color as status. The system expects to use other patterns to help guide the user in understanding a meaning of state.