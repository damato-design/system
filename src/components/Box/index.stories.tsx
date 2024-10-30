import type { Meta, StoryObj } from '@storybook/react'

import { box } from '.';

/**
 * The `box` primitive is meant to be the basis for compositions,
 * specially meant to help with layout needs.
 * 
 * You can create different kinds of HTML elements by using the dot-notation.
 * Example: `<box.main/>` will create a `<main/>` element with additional enhancements.
 */
const meta = {
    title: 'Primitives/box',
    component: box.div,
} satisfies Meta<typeof box.div>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: {
        children: 'Content within the box'
    },
    render: (args) => <box.main { ...args }/>
}

export const Stretch: Story = {
    args: {
        stretch: true,
        children: 'Stretched box with styles'
    }
}