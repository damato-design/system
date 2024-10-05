import type { Meta, StoryObj } from '@storybook/react'

import { box } from '.';

/**
 * Description here
 */
const meta = {
    title: 'Primitives/Box',
    component: box.div,
} satisfies Meta<typeof box.div>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default story
 */
export const Default: Story = {
    args: {
        children: 'Hello World!',
        standby: true
    }
}
