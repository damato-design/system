---
page: Components
anchor: Toggle-Range
---

## Toggle-Range
This hybrid component was designed to share styles between toggle switches and ranges merely by changing the type of input you are using within the component.

::: audience-designer
- The knob feature of the component is invisibily larger than the design to provide a large target area for both cursor targetting and various sizes of tapping instruments.
- Text for the label is set as all uppercase and medium weight (500), font-size is decreased slightly (.9em) to counter this emphasis. Line-height at 1.5.
- Labels are aligned left to the page in which the component exists. This is unique to other interactive inputs as most have 1rem (16px) of space between the label and container edge. This is because other interactive elements contain other visual motifs that span to the edge of the page while the toggle-range does not.
- There is 1rem (16px) of space between the control and the surrounding elements.
- When focused, a dashed outline appears around the visual control. It will not include the label.
:::

### Toggle
When using the component like a checkbox, the spacebar will toggle the switch.

::: audience-designer
- When in use as a toggle, the background color of the track should change to the accent color, indicating an "on" state.
:::

<blu-togglerange selfdocument type="checkbox" input-type="checkbox">
  Checkbox toggle
</blu-togglerange>

::: audience-engineer
### Checkbox vs. range
The component was originally engineered to keep the `input[type="range"]` element for both toggles and ranges and only shortening the component (with a few other specific state attributes) since they were crafted to look similar. Using `input[type="checkbox"]` differs by requiring the label to be present, however this shouldn't be a concern as the label should _always_ be present for any interactive element.

Unfortunately, using `input[type="range"]` requires much more JavaScript to get a working toggle that would otherwise be done with the "[Checkbox Hack](https://css-tricks.com/the-checkbox-hack/)".
:::

---

### Range
The range component allows the user to choose a value between a minimum and maximum value. It is composed of a native HTML `input[type="range"]` element and is interactive as such.

::: audience-designer
- The output value for the range could include an icon to better indicate how this value is affecting the system, ie.: a speaker icon to denote volume changes. Otherwise, the text is set to the inherited paragraph style.
:::

<blu-togglerange selfdocument type="range" input-type="range" input-value="3" input-min="0" input-max="10">
  Range
  <output slot="output">3</output>
</blu-togglerange>