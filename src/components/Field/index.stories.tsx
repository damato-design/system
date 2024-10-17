import React, { useRef } from 'react';
import type { Meta, StoryObj } from '@storybook/react'

import { Field } from '.';

import { input } from '../Input';
import { Button } from '../Button';

/**
 * The `<Field/>` component helps compose user input fields.
 * Generally, you'll be adding a single `<input.text/>` as the child,
 * but you can include other accessories within the field.
 */
const meta = {
    title: 'Components/Field',
    component: Field,
} satisfies Meta<typeof Field>

export default meta
type Story = StoryObj<typeof meta>

/**
 * The `inputRef` prop is **required**, as it is used to connect the input
 * within the field with accessibility attributes.
 */
export const Default: Story = {
    args: {
        label: 'Search',
        inputRef: React.createRef(),
    },
    render: ({ inputRef: _, ...args }) => {
        const inputRef = useRef(null);
        return (
            <Field { ...args } inputRef={inputRef}>
                <input.text placeholder='Search for something' ref={ inputRef }/>
                <Button icon='search'/>
            </Field>
        )
    }
}

/**
 * You can provide a `helpMessage` to provide more context to the user
 * and a `errorMessage` to help the user correct invalid inputs.
 * 
 * > #### Why is the error message above the input?
 * >
 * > Having the error message before the input helps raise the error more prominently
 * > than if it was below. This also avoids some of the browser built-in flyouts that
 * > may obscure this detail.
 * 
 * > #### Why is the error message shown with same presentation as the help message?
 * >
 * > The `mode` should convey the concept of having this composition in a "critical" state.
 * > As a result, the critical mode should adjust these elements accordingly.
 * >
 * > **TODO:** Allow for `invalid` to update the interal mode to present the concept of `critical`
 * > instead of expecting the author to determine the correct mode.
 */
export const Messaging: Story = {
    args: {
        label: 'Search',
        inputRef: React.createRef(),
        helpMessage: 'You can search for anything you want!',
        errorMessage: 'This is where you will find the error message.'
    },
    render: ({ inputRef: _, ...args }) => {
        const inputRef = useRef(null);
        return (
            <Field { ...args } inputRef={inputRef}>
                <input.text placeholder='Search for something' ref={ inputRef }/>
                <Button icon='search'/>
            </Field>
        )
    }
}

/**
 * This example demonstrates how the field can include the `<input.number/>`
 * and `<Button/>` elements.
 * 
 * Note the use of `fieldSizing='content'` on the `<input.number/>` so the input
 * will adjust to the size of the value. To complete the composition, we set `stretch={ false }`
 * on the `<Field/>`.
 */
export const Mixed: Story = {
    args: {
        label: 'Quantity Selector',
        inputRef: React.createRef(),
    },
    render: (args) => {
        const [value, setValue] = React.useState(0);

        const onClick = React.useCallback((ev: any) => {
            setValue((val) => val + Number(ev.target.value));
        }, []);

        const onChange = React.useCallback((ev: any) => {
            setValue(ev.target.value);
        }, []);

        return (
            <Field { ...args } stretch={ false }>
                <Button icon='remove' value={ -1 } onClick={ onClick }/>
                <input.number value={ value } ref={ args.inputRef } onChange={ onChange } fieldSizing='content'/>
                <Button icon='add' value={ 1 } onClick={ onClick }/>
            </Field>
        )
    }
}

