import type { Meta, StoryObj } from '@storybook/react'

import { input } from '.';

/**
 * Description here
 */
const meta = {
    title: 'Primitives/Input',
    component: input.text,
} satisfies Meta<typeof input.text>

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

/**
 * Using a textarea 
 */
export const Textarea: Story = {
    args: {
        id: 'textarea-example',
        value: 'Hello World!',
        onChange: Function.prototype
    },
    render: (args: any) => <input.textarea { ...args }/>
}
