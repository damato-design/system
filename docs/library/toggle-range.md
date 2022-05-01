---
title: Toggle Range
---

# Toggle Range

This component is a hybrid which satisfies changing a binary value or a range of values.

<toggle-range type="checkbox">Checkbox</toggle-range>

<toggle-range type="range">Range</toggle-range>

{% audience "designer" %}

It was decided to make the toggle look similar to the range because it has all of the same features. This isn't a stretch since the toggle can be imagined as a range with only two values, `0` and `1`. The interaction pattern with will change based on the user expectation accordingly.

{% endaudience %}

{% audience "engineer" %}

The `type` attribute is passed down directly to the `<input/>` within the component which determines the visual treatment and behavior. A few other attributes (`min` `max` `step`, `value`) are also directly passed down for configuration purposes.

You can listen for the `change` event on the component which provides the **value as a number** in the `detail` of the event object.

```js
const control = document.querySelector('toggle-range');
control.addEventListener('change', ({ detail }) => { console.log(detail.value) });
```

To determine if the `type="checkbox"` is `:checked`, use `Boolean(detail.value)`.

{% endaudience %}
