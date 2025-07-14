import type { Meta, StoryObj } from '@storybook/react'
import { useCallback, useState } from 'react';
import checklist from './checklist.md?raw';

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
    parameters: {
        checklist
    }
} satisfies Meta<typeof input.text>

export default meta
type Story = StoryObj<typeof meta>

/**
 * All `input` primitives require a type of input to be referenced with
 * the dot-notation. This example demonstrates how to render the `password` type.
 * 
 * This type has a special `redact` flag that can be set to explicitly `false`
 * which internally changes the type from `password` to `text`
 * to show the characters within the input without needing to change
 * the input type from the dot-notation.
 * This feature is helpful to indicate this is always meant to be a password input.
 */
export const Default: Story = {
    args: {
        id: 'default',
        value: 'whiterabbit',
        name: 'default'
    },
    render: ({ value: givenValue, ...args }) => {
        const [value, setValue] = useState(givenValue);
        const onChange = useCallback((ev: any) => setValue(ev.target.value), []);
        return <input.password { ...args } value={ value } onChange={ onChange }/>
    }
}

/**
 * While any HTML `<input/>` element could be rendered,
 * some are better prepared than others. More work will need to be done
 * to fully support less common input types.
 * 
 * For checkbox and radio button components, consider using the
 * `<Checkbox/>` component.
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
 * Default `<Button/>` styles are copied onto the `::file-selector-button`
 * when `<input.file/>` is used.
 */
export const File: Story = {
    args: {
        id: 'file',
        name: 'file'
    },
    render: ({ value: givenValue, ...args }) => {
        const [value, setValue] = useState(givenValue);
        const onChange = useCallback((ev: any) => setValue(ev.target.value), []);
        return <input.file { ...args } value={ value } onChange={ onChange }/>
    }
}

/**
 * For multiline input, the `<input.textarea/>` type will render
 * a native HTML `<textarea/>` with some additional features to
 * help with alignment and composition.
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
