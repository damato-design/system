import type { Meta, StoryObj } from '@storybook/react'

import { input } from '.';

/**
 * The `input` primitive creates elements meant for user input.
 * They are all expected to be presented as nearly invisible. These elements are meant to be used
 * in conjunction with `<box.div appearance='control'/>` to create the frame around the input.
 */
const meta = {
    title: 'Primitives/Input',
    component: input.text,
} satisfies Meta<typeof input.text>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Use the `<input.text/>` to create a standard `<input type="text"/>` element.
 */
export const Default: Story = {
    args: {
        id: 'default',
        value: 'Hello World!',
        onChange: Function.prototype
    }
}

/**
 * You can create different types of input fields using the dot-notation on the `input`.
 * The example here shows the `<input type="color"/>` created as `<input.color/>`
 */
export const Color: Story = {
    args: {
        id: 'color',
        value: '#ff0000',
        onChange: Function.prototype
    },
    render: (args) => <input.color { ...args }/>
}

/**
 * A unique type is `<input.textarea/>` which will create a `<textarea/>` instead of an `<input/>`.
 */
export const Textarea: Story = {
    args: {
        id: 'textarea-example',
        value: 'Hello World!',
        onChange: Function.prototype
    },
    render: (args: any) => <input.textarea { ...args }/>
}
