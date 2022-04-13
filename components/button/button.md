---
page: Components
anchor: Button
---

## Button

Buttons are a quintessential part of every design system as they invoke the user to take an action.

::: audience-designer
- Horizontal spacing is 1rem (16px), vertical spacing is .5rem (8px). This provides a large target area for both cursor targetting and various sizes of tapping instruments.
- Text is set as all uppercase and medium weight (500), font-size is decreased slightly (.9em) to counter this emphasis. Line-height at 1.5.
- Borders are always applied, and are set to the background color unless specified. This keeps alignment with other buttons which may have a visible border.
- Border-radius is set at 2px, matching the radius of other containers in the system.
- Margins are not applied directly to the component's style but are instead dictated by the layout and should adhere to spacing guidelines.
- Buttons come in **one size** that relates to the font. Emphasis is expected to be shown through the use of "primary" and "secondary" versions. More variations are not necessary as this does not provide a consistent experience.
- When focused, a dashed outline should appear around the button.
:::

___

### default
The default button is provided without standout colors as it expects to target anciliary actions beyond primary and secondary buttons. This also designed to all buttons uses the default styles as a base to keep them consistent. The further variations of the button will come from additional attributes.

::: audience-designer
- Background color is set as transparent, foreground color inherit's from the container.
- Hover interaction sets the background color to a low contrast of the container, foreground color is now an accent color.
:::

<blu-button selfdocument>Default button</blu-button>

---

### type:primary
The primary button is designed to draw attention to the main action we expect a user to take.

::: audience-designer
- Background color is set as an accent color, foreground color is explicitly set as a color to compliment the accent color.
- Hover interaction sets the background color to a low contrast of the container, foreground color is now an accent color.
:::

<blu-button selfdocument type="primary">Primary Button</blu-button>

---

### type:secondary
The secondary button should only be used along side a primary button when a second choice is available to the user.

::: audience-designer
- Background color is set as transparent, border color is set as the accent color, foreground color inherits from the container.
- Hover interaction sets the background color to a low contrast of the container, foreground color is now an accent color.
:::

<blu-button selfdocument type="secondary">Secondary Button</blu-button>

---

### disabled
The disabled state of the button reduces the opacity and sets the mouse cursor to show a disabled state.

::: audience-designer
- Opacity is set to .4 for all disabled buttons, cursor is changed to not-allowed.
- Hover and focus interactions no longer activate.
:::
<blu-button selfdocument disabled>Disabled Button</blu-button>

