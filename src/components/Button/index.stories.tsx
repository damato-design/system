import type { Meta, StoryObj } from '@storybook/react'

import { Button } from '.';

/**
 * The `<Button/>` component allows a user to take an action.
 * This is commonly used to execute some behavior on the current page
 * but may also be used to navigate to another page.
 * 
 * The presentation of buttons is mostly driven by the values provided by the theme.
 */
const meta = {
    title: 'Components/Button',
    component: Button,
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

/**
 * The default presentation of the button is meant to be the most commonly used.
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
 */
export const Link: Story = {
    args: {
        children: 'Click here!',
        inline: true,
        href: '#'
    }
}

/**
 * You can provide an icon to the component by passing the reference string
 * to generate the `icon` component.
 */
export const Icon: Story = {
    args: {
        children: 'Search',
        icon: 'search',
        priority: 'primary'
    }
}

/**
 * Setting the `disabled` attribute will prevent the user from interacting with the button.
 */
export const Disabled: Story = {
    args: {
        children: 'Click here!',
        disabled: true
    }
}