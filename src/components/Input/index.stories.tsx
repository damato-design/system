import type { Meta, StoryObj } from '@storybook/react'

import { input } from '.';
import { useCallback, useState } from 'react';

/**
 * The `input` primitive creates elements meant for user input.
 * They are all expected to be presented as nearly invisible. These elements are meant to be used
 * in conjunction with `<box.div appearance='control'/>` to create the frame around the input.
 * For an example of this, check out the [Field docs](/docs/components-field--docs).
 */
const meta = {
    title: 'Primitives/input',
    component: input.text,
} satisfies Meta<typeof input.text>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Use the `<input.text/>` to create a standard `<input type="text"/>` element.
 * 
 * > #### Why use the dot-notation for the input type?
 * >
 * > Like other fragments, the kind of element you want to use is closely paired
 * > with the component as a tag name. For inputs, they often render wildly different
 * > as if they were different elements entirely. In this system, we treat them closer
 * > to different elements as we tie their semantics to the host component in a similar
 * > manner to other fragments.
 * 
 * The `name` prop is **required** for this component.
 */
export const Default: Story = {
    args: {
        id: 'default',
        value: 'Hello World!',
        name: 'default'
    },
    render: ({ value: givenValue, ...args }) => {
        const [value, setValue] = useState(givenValue);
        const onChange = useCallback((ev: any) => setValue(ev.target.value), []);
        return <input.text { ...args } value={ value } onChange={ onChange }/>
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
        name: 'color'
    },
    render: ({ value: givenValue, ...args }) => {
        const [value, setValue] = useState(givenValue);
        const onChange = useCallback((ev: any) => setValue(ev.target.value), []);
        return <input.color { ...args } value={ value } onChange={ onChange }/>
    }
}

/**
 * A unique type is `<input.textarea/>` which will create a `<textarea/>` instead of an `<input/>`.
 */
export const Textarea: Story = {
    args: {
        id: 'textarea-example',
        value: 'Hello World!',
        name: 'textarea'
    },
    render: ({ value: givenValue, ...args }) => {
        const [value, setValue] = useState(givenValue);
        const onChange = useCallback((ev: any) => setValue(ev.target.value), []);
        return <input.textarea { ...args } value={ value } onChange={ onChange }/>
    }
}
