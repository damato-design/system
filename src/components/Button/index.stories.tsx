import type { Meta, StoryObj } from '@storybook/react'

import { Button } from '.';

import { box } from '../Box';
import { text } from '../Text';

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
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

/**
 * The default presentation of the button is meant to be the most commonly used.
 * 
 * Note that the interactive styles (eg., `:hover`) are modifications to
 * current colors provided by the mode, and other expressions. There are no tokens
 * that directly affect these presentations.
 * 
 * > #### Why are interactive styles not customizable?
 * >
 * > Most interactive styles are brief and aren't part of the user's decision process
 * > in choosing to interact with an element. The "resting" styles must indicate the
 * > possibility of interactivity alone. Additional treatments can help confirm the initial
 * > exploration to an element being interactive, such as a cursor change.
 * >
 * > To reduce token curation exercises, we opt to algorithmically determine an appropriate
 * > color to display for `:hover` by mixing the background color and
 * > foreground color in various ways. This helps align with the cohesive colors while avoiding
 * > the explicit curation of a color.
 */
export const Default: Story = {
    args: {
        children: 'Click here!'
    },
}

/**
 * The `<Button priority='primary'/>` is meant for the user's primary action.
 * There should be only one of these on any page to help guide the user to the next expected page.
 */
export const Primary: Story = {
    args: {
        children: 'Click here!',
        priority: 'primary'
    }
}

/**
 * This demonstrates the "secondary" treatment for a `<Button/>`.
 */
export const Secondary: Story = {
    args: {
        children: 'Click here!',
        priority: 'secondary'
    }
}

/**
 * If you provide an `href` attribute,
 * the component will switch to use an anchor HTML element (`<a/>`).
 * 
 * The component will still include the expected padding around the content.
 * If you expect the element to appear inline, set `inline=true`.
 * This will also cause the font styles to be inherited instead of set from the component.
 */
export const Link: Story = {
    args: {
        children: 'Click here!',
        inline: true,
        href: '#'
    },
    render: (args) => (
        <text.p priority='secondary'>
            The quick brown fox <Button { ...args }>jumps over</Button> the lazy dog.
        </text.p>
    )
}

/**
 * You can provide an icon to the component by passing the reference string
 * to generate the `icon` component.
 * Refer to the [icon docs](/docs/primitives-icon--docs) for possible options.
 * 
 * If the component is meant to display an icon alone,
 * be sure to include the `aria-label` on the `<Button/>`.
 */
export const Icon: Story = {
    args: {
        children: 'Search',
        icon: 'search',
        priority: 'primary'
    }
}

/**
 * In some cases, it may be expected to show an accessory on the button
 * to indicate a different behavior.
 * 
 * This example is non-interactive. For an interactive example,
 * see the [Listbox docs](/docs/primitives-listbox--docs#menu).
 */
export const Behavior: Story = {
    args: {
        children: 'Menu',
        behavior: 'menu',
        priority: 'secondary'
    }
}

/**
 * Setting the `disabled` attribute will prevent the user
 * from interacting with the button. Avoid using this in
 * favor of simply not showing a button the user cannot use.
 */
export const Disabled: Story = {
    args: {
        children: 'Please do not do this',
        disabled: true
    }
}

/**
 * This demonstrates the alignment when content is mixed between text and icons.
 * Each button should maintain the same height, regardless of content type.
 * 
 * We use `inset={{ block: 'start' }}` on the `<box.div/>`
 * to ensure the elements do not stretch within the container;
 * otherwise fooling the alignment measurements.
 */
export const Alignment: Story = {
    args: {
        priority: 'primary'
    },
    render: (args) => {
        return (
            <box.div gap inset={{ block: 'start' }}>
                <Button { ...args }>Content</Button>
                <Button { ...args } icon='anchor'>Icon</Button>
                <Button { ...args } icon='addchart' aria-label='Add Chart'/>
            </box.div>
        );
    }
}