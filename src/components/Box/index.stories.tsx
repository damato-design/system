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
    title: 'Primitives/Box',
    component: box.div,
} satisfies Meta<typeof box.div>

export default meta
type Story = StoryObj<typeof meta>

/**
 * You may commonly use `<box.div/>` for most layout needs but it is important to use semantic
 * HTML elements wherever appropriate. Note, the `box` is meant as a generic, non-interactive container
 * for content. There are other primitives for more specialized needs.
 */
export const Default: Story = {
    args: {
        children: 'Hello World!'
    },
    render: (args) => <box.main { ...args }/>
}
