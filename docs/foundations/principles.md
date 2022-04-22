---
title: Principles
order: 1
---

# level 2 (good for general reading, paragraphs)

<liga-icon>face</liga-icon>

<button>Click this button</button>

<div data-density-shift>
  <a class="button" href="#">Click this link as a button</a>
</div>

<toggle-range type="range" max="50">Density</toggle-range>

<toggle-range type="checkbox">Dark mode</toggle-range>

<audience-control audience="engineer"></audience-control>

<delta-color-accent reference="--feedback_standard_foreground-color"></delta-color-accent>

<delta-color-text reference="--box_standard_foreground-color"></delta-color-text>

{% aside %}
## Check this out

Could you imagine this?

```js
console.log('Hello World');
```

{% endaside %}

{% audience "engineer" %}

## Check this out too

What about this?

```js
console.log('Hello World');
```

{% endaudience %}

Lumbersexual activated charcoal sustainable mixtape air plant chillwave. VHS hella butcher cold-pressed, normcore chartreuse [single-origin](https://google.com) coffee edison bulb street art pour-over hot chicken hell of brunch. Pour-over locavore williamsburg adaptogen semiotics kickstarter bitters brunch hot chicken chartreuse. Man bun umami mlkshk vexillologist gastropub skateboard PBR&B occupy.

| Name | Description | Value |
| ---- | ----------- | ----- |
| Donnie | Some guy who wrote this | It's me! |
| Jennifer | So cool! | Still cool! |

```js
const date = new Date(Date.UTC(2012, 11, 21, 4, 0, 0));
const formatted = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
}).format(date);
console.log(formatted); // "December 20, 2012" (varies by UTC timezone)
```

1. The first item in the list
1. The second item in the list
1. The third item is going to be `something really` long so we can see the text wrap to the next line and ensure everything looks fine.

{% quote "https://www.google.com" "Google" %}
The quick brown fox jumps over the lazy dog
{% endquote %}

<small>Detail</small>

<div data-density-shift>

  # level 3 (good for details, cards)

  Lumbersexual activated charcoal sustainable mixtape air plant chillwave. VHS hella butcher cold-pressed, normcore chartreuse single-origin coffee edison bulb street art pour-over hot chicken hell of brunch. Pour-over locavore williamsburg adaptogen semiotics kickstarter bitters brunch hot chicken chartreuse. Man bun umami mlkshk vexillologist gastropub skateboard PBR&B occupy.

  <small>Detail</small>

</div>