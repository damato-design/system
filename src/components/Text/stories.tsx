import type { Meta, StoryObj } from '@storybook/react'

import { text } from '.';

/**
 * Description here
 */
const meta = {
    title: 'Primitives/Text',
    component: text.span,
} satisfies Meta<typeof text.span>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default story
 */
export const Default: Story = {
    args: {
        children: 'Hello World!',
    }
}
