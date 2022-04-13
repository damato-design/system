---
page: Components
anchor: Select-Summary
---

## Select-Summary
The select-summary component is a hybrid of a few components found in design systems which show and hide content.

::: audience-designer
- The content area does not flyout and appear on top of other content; it will push outside content down.
- There is no default maximum height, a maximum height can be applied based on the content provided if it is believed to help the user experience. It should noted that this may include an additional scrollbar which could be challenging to navigate for some users. One scrollbar (for the page) is much easier to manage typically.
- Each version allows for control via the spacebar to open and close the content drawer.
- Using native HTML elements within the dropdown will also make the component accessible by using the tab key on focusable elements. JavaScript is required to provide additional functionality such as arrow key navigation for options.
- The summary will typically display as a label unless it is meant to display one of the values within the content area (ie, type:select). Label styles are all uppercase, medium weight, a font-size of .9rem to balance the previous styles.
- The content drawer can be styled however is appropriate to match the rest of the system in color, typography, spacing, et cetera.
- The menu type does not have a visible container itself but is expected to exist along side siblings in a larger group.
- The select type is designed to provide affordance to other dropdowns found across the web. It can be enhanced to provide a typeahead experience using a textfield.
- The summary type is designed to be unique from the other types to suggest the content inside is prepared differently. This also allows for icon variations to help with clarifying content and visibility. The icon should reflect what will happen once interaction occurs. For example when a summary is collapsed, the icon should display an visual indicating that it can be shown. Similarly, when expanded it should show a visual indicating it can be hidden.
- The icon in the label that displays state or helps clarify content should be focusable; indicated by a dashed outline.
:::

### type:select
When in the "select" configuration, the component acts like a stylized `<select>` component. Additional JavaScript is required for the value to appear in the value slot on selection. 

<blu-selectsummary selfdocument type="select">
  <span slot="value">Option 1</span>
  <svg-icon value="caret-down" slot="indicator-open" class="selectSummary--indicatorOpen">keyboard_arrow_down</svg-icon>
  <svg-icon value="caret-down" slot="indicator-close" class="selectSummary--indicatorClose">keyboard_arrow_down</svg-icon>
  <button class="selectSummary--option" value="1" aria-role="option">Option 1</button>
  <button class="selectSummary--option" value="2" aria-role="option">Option 2</button>
  <button class="selectSummary--option" value="3" aria-role="option">Option 3</button>
</blu-selectsummary>

Example of a JavaScript enhanced version; value changes on selection:

<js-selectsummary type="select">
  <span slot="value">Pick a fruit</span>
  <svg-icon value="caret-down" slot="indicator-open" class="selectSummary--indicatorOpen">keyboard_arrow_down</svg-icon>
  <svg-icon value="caret-down" slot="indicator-close" class="selectSummary--indicatorClose">keyboard_arrow_down</svg-icon>
  <button class="selectSummary--option" value="apple">Apple</button>
  <button class="selectSummary--option" value="banana">Banana</button>
  <button class="selectSummary--option" value="pear">Pear</button>
  <button class="selectSummary--option" value="orange">Orange</button>
</js-selectsummary>

---

### type:menu
When in the "menu" configuration, the component is prepared to hold navigational items. No additional JavaScript is required for this component to work.

<blu-selectsummary selfdocument type="menu">
  <span slot="value">Group</span>
  <svg-icon value="plus" slot="indicator-open" class="selectSummary--indicatorOpen">add</svg-icon>
  <svg-icon value="plus" slot="indicator-close" class="selectSummary--indicatorClose">add</svg-icon>
  <a class="selectSummary--option" href="javascript:void(0);">Child link 1</a>
  <a class="selectSummary--option" href="javascript:void(0);">Child link 2</a>
  <a class="selectSummary--option" href="javascript:void(0);">Child link 3</a>
</blu-selectsummary>

---

### type:summary
When in the "summary" configuration, the component acts similarly to native HTML5 `<details>` and `<summary>` components. No additional JavaScript is required for this component.

<blu-selectsummary selfdocument type="summary">
  <span slot="value">Want to hear a joke about construction?</span>
  <svg-icon value="eye-open" slot="indicator-open" class="selectSummary--indicatorOpen">visibility</svg-icon>
  <svg-icon value="eye-close" slot="indicator-close" class="selectSummary--indicatorClose">visibility_off</svg-icon>
  <p>I’m still working on it.</p>
</blu-selectsummary>


