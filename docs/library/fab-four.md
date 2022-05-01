---
title: Fab Four
---

# Fab Four

This component helps with layout construction allowing the children to be rearranged at a given threshold.

<div style="resize: both;">
  <fab-four column-max="2" column-min="1" threshold="60ch" gap="0">
    <div>Child one</div>
    <div>Child two</div>
    <div>Child three</div>
    <div>Child four</div>
  </fab-four>
</div>

The component is named after the technique [described by Rémi Parmentier](https://www.freecodecamp.org/news/the-fab-four-technique-to-create-responsive-emails-without-media-queries-baf11fdfa848/) which achieves the same results with a few options.

{% audience "engineer" %}

In order to prepare the component, you'll want to specify a few attributes:

- `threshold`: the width where the layout shift should occur.
- `column-max`: defines the maximum number of columns that should appear with the given children.
- `column-min`: defines the number of columns which should appear after the threshold is crossed.
- `gap`: allows for a gap between the children.

The example below provides the defaults.

```html
<fab-four column-max="2" column-min="1" threshold="60ch" gap="0">
  <div>Child one</div>
  <div>Child two</div>
  <div>Child three</div>
  <div>Child four</div>
</fab-four>
```

In the above configuration, the component would be displayed as a 2×2 grid until the component is confined into a container which is less than `60ch`, where the children would then stack into one column.

{% endaudience %}