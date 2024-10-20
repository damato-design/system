import type { Meta, StoryObj } from '@storybook/react'

import { track } from '.';

/**
 * Work in progress
 */
const meta = {
    title: 'Primitives/track',
    component: track.progress,
} satisfies Meta<typeof track.progress>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: {}
}

export const Meter: Story = {
    args: {},
    render: (args) => <track.meter { ...args }/> 
}

export const Range: Story = {
    args: {},
    render: (args) => <track.range { ...args }/> 
}