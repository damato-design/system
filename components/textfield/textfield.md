---
page: Components
anchor: Textfield
---

## Textfield
The textfield is composed of a single input and label with an optional button to accompany the component. 

::: audience-designer
- To provide a differentiation between other components in the system, the textfield is displayed as a box with a low contrast background to its container and a single line beneath.
- The label follows the same pattern as other labels; all uppercase, medium weight and .9rem font size for balance. It is found within the same box as the input to show the relationship. All textfields must have a label; the placeholder is not a substitute.
- The text entered into the input should match body text styles.
- When focused, a dashed outline should appear around the input area. It should not include the label.
- Any additional elements included with the input should not be visually within the input. For example, a button attached to the input can coexist in the same horizontal space but must be visually separated from the input itself.
:::

<blu-textfield selfdocument input-placeholder="Input w/o button">
  Label
</blu-textfield>

<blu-textfield selfdocument input-placeholder="Input with primary button">
  Label
  <button class="button" slot="button" type="primary">Submit</button>
</blu-textfield>

<blu-textfield selfdocument input-placeholder="Input with secondary button">
  Label
  <button class="button" slot="button" type="secondary">Submit</button>
</blu-textfield>

<blu-textfield selfdocument input-placeholder="Input with default button">
  Label
  <button class="button" slot="button">Submit</button>
</blu-textfield>

<blu-textfield selfdocument input-placeholder="Input with disabled button">
  Label
  <button class="button" slot="button" disabled>Submit</button>
</blu-textfield>