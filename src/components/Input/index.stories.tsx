import type { Meta, StoryObj } from '@storybook/react'
import { useCallback, useState } from 'react';

import { input } from '.';


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

export const Default: Story = {
    args: {
        id: 'default',
        value: 'email@example.com',
        name: 'default'
    },
    render: ({ value: givenValue, ...args }) => {
        const [value, setValue] = useState(givenValue);
        const onChange = useCallback((ev: any) => setValue(ev.target.value), []);
        return <input.text { ...args } value={ value } onChange={ onChange }/>
    }
}

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
