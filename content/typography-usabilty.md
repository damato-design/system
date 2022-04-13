---
page: Typography
anchor: Usability
order: 3
---

## Usability

In terms of accessibility, the system ensures that the user can modify the font size in their device's user settings to affect the readability as necessary. Font sizes are set in "rem" units; relative to the "root" (ie. page) font size so the font size can scale appropriately.

::: audience-designer
Many of the guidelines on accessible text are found in the article _[The controversy of accessible type](https://medium.com/queer-design-club/the-controversy-of-accessible-type-8def04eb8808)_.

There’s no official enforced minimum size by itself. It is common for accessibility measurements to include [color](/color#usability "DAMATO Design, Color Usability") and other properties to determine whether text is deemed accessible. A good baseline is recommended to [set at 16px](https://accessibleweb.com/question-answer/minimum-font-size/ "accessibleweb.com: Minimum font size?"), but more specifically [set to the browser's default](https://css-tricks.com/accessible-font-sizing-explained/ "Accessible Font Sizing, Explained").
:::

### About face

Selecting the proper font face is also important to readability. The [Jost*](https://indestructibletype.com/Jost.html) font family was selected as geometric fonts are of "Humanist construction".

> These are beautiful and legible fonts, designed to perfection. _[Eugene Sadko, Guide to 10 font characteristics and their use in design](https://medium.com/@eugenesadko/guide-to-10-font-characteristics-and-their-use-in-design-b0a07cc66f7)_

It is also a web performance benefit to only choose one font versus more than one. In order to differentiate between body text and headline text using one font, additional modifications such as size, kerning, leading and, casing can contribute to these variations.

::: audience-designer
[Many recommendations in accessibility](https://github.com/humanmade/hm-pattern-library/issues/75 "Github: Are all-caps headings bad for accessibility?") make mention to refrain from having text in all caps. This seems to be specifically when found within reading bodies of text. The areas where all caps is used throughout this system are done in order to [slow the user down](https://www.mity.com.au/blog/writing-readable-content-and-why-all-caps-is-so-hard-to-read "Writing readable content (and why All Caps is so hard to read)") to read the label or action before continuing. This delays an important message to [let the user think](https://www.smashingmagazine.com/2018/01/friction-ux-design-tool/ "Designing Friction For A Better User Experience") for a moment about how to continue.
:::
