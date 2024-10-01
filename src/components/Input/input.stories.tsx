import type { Meta, StoryObj } from '@storybook/react'

import { input } from '.';

/**
 * Description here
 */
const meta = {
    title: 'Components/Input',
    component: input.input,
} satisfies Meta<typeof input.input>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default story
 */
export const Default: Story = {
    args: {
        value: 'Hello World!',
        onChange: Function.prototype,
    }
}
