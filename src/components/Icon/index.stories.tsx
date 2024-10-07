import type { Meta, StoryObj } from '@storybook/react'

import { icon } from '.';

/**
 * Refer to [the list provided by Google](https://fonts.google.com/icons?icon.set=Material+Icons).
 */
const meta = {
    title: 'Primitives/icon',
    component: icon.search,
} satisfies Meta<typeof icon.search>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Size: Story = {
    render: (args) => (
        <span style={{ fontSize: '2em' }}>
            <icon.search { ...args }/>
        </span>
    )
}

