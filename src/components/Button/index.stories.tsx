import type { Meta, StoryObj } from '@storybook/react';
import checklist from './checklist.md?raw';

import { Button } from '.';

import { box } from '../Box';

/**
 * The `<Button/>` component allows a user to take an action.
 * This is commonly used to execute some behavior on the current page
 * but may also be used to navigate to another page.
 * 
 * The presentation of buttons is mostly driven by the
 * values provided by the current mode.
 */
const meta = {
    title: 'Components/Button',
    component: Button,
    parameters: {
        checklist
    }
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

/**
 * The default button is `priority='auxiliary'` but should not be set explicitly on the component. This should be the most commonly placed button within an experience.
 */
export const Default: Story = {
    args: {
        children: 'Click here!'
    },
}

/**
 * The primary button is `priority='primary'`, indicating it is the primary action the user is expcted to take in the current experience. It should be the _least placed_ button within the experience.
 */
export const Primary: Story = {
    args: {
        children: 'Most important thing to do!',
        priority: 'primary'
    }
}

/**
 * The secondary button is for actions that are less important than primary but remain useful for completing a task. These buttons **should not be used** within the [`field` primitive](/docs/primitives-field--docs).
 * 
 * > #### Why should `<Button priority='secondary'/>` be avoided inside of `field`?
 * >
 * > The `field` component removes the border from its children to maintain the height of the field adjacent to other buttons and controls. That border is typically a defining feature for the secondary button treatment.
 */
export const Secondary: Story = {
    args: {
        children: 'Go to dashboard!',
        href: '#',
        behavior: 'external',
        priority: 'secondary'
    }
}

/**
 * Sizes for this and other components in the system are handled by flagging
 * any `box` or `box`-like scope as `denser`. This will reduce the size of spacing
 * typography for the component in the area where it was set. Notice the nesting of
 * `<box.div/>` elements in this example.
 * 
 * For more information about this technique, see the [Density docs](/docs/foundations-density--docs).
 * 
 * > #### Where is the density control for this example?
 * >
 * > Because we are demonstrating the ability to nest regions of denser objects,
 * > the control to affect this has been removed.
 */
export const Sizes: Story = {
    parameters: {
        densityLevel: false,
    },
    args: {
        children: 'Denser and…',
        priority: 'primary'
    },
    render: (args) => {
        return (
            <box.div denser gap placeChildren='center'>
                <Button {...args} />
                <box.div denser gap placeChildren='center'>
                    <Button {...args} />
                </box.div>
            </box.div>
        )
    }
}

/**
 * Providing an icon reference string to the `icon` prop will render an icon before the children. **Do not place `icon` primitives in `children`**. For information about possible values, see the [`icon` primitive](/docs/primitives-icon--docs).
 * 
 * > #### Why are `icon` primitives in `children` discouraged?
 * >
 * > The placement of icons is standardized internally to the `<Button/>` to always appear on the starting edge. There are exceptions for this placement that have been encoded into the `behavior` prop with specific functionality expected. Having a freeform positioning strategy makes icon placement inconsistent.
 * 
 * If you only provide an `icon` without `children`, the component will console warn to include either `aria-label` or `aria-labelledby`. When providing this information, consider using the [`localize` primitive](/docs/primitives-localize--docs).
 */
export const Icon: Story = {
    args: {
        children: 'Search',
        icon: 'search',
        priority: 'primary'
    }
}

/**
 * The `behavior` prop will add additional accessories to the button to manage behavior or convey more information. The example below shows a trailing icon to indicate a menu experience. Note that this example is non-interactive.
 */
export const Behavior: Story = {
    args: {
        children: 'Menu',
        behavior: 'menu',
        priority: 'secondary'
    }
}

/**
 * The `dismiss` option creates an icon-only button for dismissal. **You should not use this component directly** and instead use the [`<Close/>` primitive](/docs/primitives-close--docs) instead which includes additional configuration options for this specific need.
 */
export const Dismiss: Story = {
    args: {
        behavior: 'dismiss'
    }
}

/**
 * While the component does possess a treatment for the concept of `disabled`, it should be avoided for better user experience patterns that don't restrict the user by providing unavailable options. This example is for illustrative purpose only.
 */
export const Disabled: Story = {
    args: {
        children: 'Please do not do this',
        disabled: true
    }
}

/**
 * This example demonstrates a matching alignment between label-only,
 * icon-only, and mixed content buttons. The `placeChildren='top'` on the container aligns all buttons to the top of the parent so any size differences would be immediately noticeable.
 */
export const Alignment: Story = {
    args: {
        priority: 'primary'
    },
    render: (args) => {
        return (
            <box.div gap placeChildren='top'>
                <Button { ...args }>Content</Button>
                <Button { ...args } icon='anchor'>Icon</Button>
                <Button { ...args } icon='addchart' aria-label='Add Chart'/>
            </box.div>
        );
    }
}