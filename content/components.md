---
page: Components
order: 6
---

# Bits & **Pieces**

 These components are crafted as blueprints; using only HTML/CSS. Any functionality provided in the examples is available solely with these technologies unless otherwise mentioned. Components can be enhanced with JavaScript but the core functionality is based on web standards which allows them to be wired into any framework with ease.

::: audience-designer
The term "Blueprint" comes from the [Salesforce Lightning Design System](https://www.lightningdesignsystem.com/components/overview/ "Salesforce Lightning Design System").
:::

::: audience-engineer
### Markup decisions
One of the key factors in ensuring that we can include interactivity without JavaScript is by setting HTML elements in a deliberate structure to allow for CSS selectors to act with conditional logic.

For example, in the interactive components below, the `<input>` element found within is typically the first child of the element's container. This allows the CSS sibling selectors (`+`, `~`) to help determine what elements exist in the container and make visual changes based on those elements.

In a simple case, the "[Checkbox Hack](https://css-tricks.com/the-checkbox-hack/)" is used to open/close the [select-summary](#select-summary "DAMATO Design, Components Select-Summary") component by targeting the `input[type="checkbox"]:checked` selector and affecting the visibility of the sibling content container. You should also be aware that in some browsers, you can affect the input using the keyboard and tabbing to this element will normally put the element into the viewport within a scrollable container. 
:::
