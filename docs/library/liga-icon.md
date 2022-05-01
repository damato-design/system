---
title: Liga Icon
---

# Liga Icon

This component leverages the Material Design icon set as a reusable web component.

In order to use the component, first find the icon you'd like to use within [the reference provided by Material Design](https://fonts.google.com/icons?icon.set=Material+Icons). Then use the name of the icon as the content for the component, all lowercase and replacing the spaces with underscores.

```html
<liga-icon>view_in_ar</liga-icon>
```

<liga-icon>view_in_ar</liga-icon>

{% aside %}

The component is called `liga-icon` because the icons are rendered using [ligatures](https://en.wikipedia.org/wiki/Ligature_(writing)) defined within the Material Design icon font. They are not SVG.

{% endaside %}

{% audience "engineer" %}

It is known that loading an entire font into the page for a few icons is not optimal for performance. This was done purely for the authoring experience at the expense of the end-user. In a more sophisticated system, it would be recommended to use an SVG-based approach which renders in-place (or better with a spritesheet to reduce DOM nodes further). It would also be important for the authoring experience to be maintained, so a replacement process would be necessary to transform a given reference into a full SVG node.

{% endaudience %}