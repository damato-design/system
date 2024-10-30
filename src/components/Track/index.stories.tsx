import type { Meta, StoryObj } from '@storybook/react'

import { track } from '.';

/**
 * The `track` primitive helps present progress,
 * sometimes allowing user input to control the progress.
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
    args: { value: 50 },
    render: (args) => <track.meter { ...args }/> 
}

export const Range: Story = {
    args: { value: 30 },
    render: (args) => <track.range { ...args }/> 
}