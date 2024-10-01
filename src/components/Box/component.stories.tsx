import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'

import { box, BoxComponentProps } from './';

/**
 * Description here
 */
const meta = {
    title: 'Components/Box',
    component: box.div,
} satisfies Meta<BoxComponentProps>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default story
 */
export const Default: Story = {
    args: {
        children: 'Hello World!',
    } as BoxComponentProps
}
