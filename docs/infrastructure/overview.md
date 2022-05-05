---
title: Overview
order: 1
---

# Infrastructure overview

Each page in the system should have a few resources. The

## Theme

Each theme is prepared using a `.yml` file to outline each configurable theme value. There are a few dozen values and can support light / dark themes (as this site provides). The theme name should match the subdomain of the site (`system.damato.design` -> `system.theme.yml`). This file gets transformed into a `system.theme.css` file as the library is built. From here the resource can be added to the pages.

```html
<link rel="stylesheet" href="https://system.damato.design/themes/system.theme.css">
```

## Decorations

Decorations is a collection of CSS meant to help layout and style common elements or patterns easily.

```html
<link rel="stylesheet" href="https://system.damato.design/decorations.css">
```

## Registrar

The registrar is a IIFE that executes on the page to help register custom elements. Each custom element definition is found at `https://system.damato.design/components/[COMPONENT_NAME].iife.js and will be registered as they are discovered on each page. A definition will be fetched only once.

```html
<script src="https://system.damato.design/registrar.iife.js" defer></script>
```