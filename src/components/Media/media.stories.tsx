import type { Meta, StoryObj } from '@storybook/react'

import { media } from '.';

/**
 * Description here
 */
const meta = {
    title: 'Components/Media',
    component: media.img,
} satisfies Meta<typeof media.img>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default story
 */
export const Default: Story = {
    args: {
        src: '#',
    }
}
