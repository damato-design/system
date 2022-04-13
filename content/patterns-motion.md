---
page: Patterns
anchor: Motion
order: 4
---

## Motion

If we consider layout as designing in two-dimensions, and elevation as the third, we could include motion as the fourth. Motion can help introduce elements of the interface smoothly. It can focus a user's attention and also add character to elements when used subtly.

Motion is added to this design system so that it largely unnoticed. Small transitions are added in elements that appear or disappear, which includes the page itself after loading. Interactive elements may also include subtle changes between states instead of instance ones. It is important to add these moments thoughtfully to not detract from the overall experience and the user's goals.

The system uses the default easing curves provided by CSS as the duration is often too short (0.218 milliseconds) to notice a difference with a custom easing function. Additionally, there are no guidelines in choreography between multiple elements as most are built with very few parts, and only one with animation, if any.

::: audience-engineer
A [reduced motion media query](https://css-tricks.com/revisiting-prefers-reduced-motion-the-reduced-motion-media-query/) is applied to help with accessibility as some types of motion can cause users discomfort or uneasiness. We allow users to select a reduced motion option from within the browser's settings and make changes on this site accordingly.

```css
@media screen and (prefers-reduced-motion: reduce), (update: slow) {
  * {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
  }
}
```
:::