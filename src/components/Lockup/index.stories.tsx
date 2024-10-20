import type { Meta, StoryObj } from '@storybook/react'

import { lockup } from '.';
import { text } from '../Text';
import { field } from '../Field';
import { input } from '../Input';
import { useCallback, useState } from 'react';
// import { Button } from '../Button';

/**
 * The `lockup` primitive helps create standardized layouts of content.
 */
const meta = {
    title: 'Primitives/lockup',
    component: lockup.div,
} satisfies Meta<typeof lockup.div>

export default meta
type Story = StoryObj<typeof meta>

/**
 * The `subject` field expects a `text` primitive.
 * Make sure to set the priority of the text.
 * 
 * > #### Why is this prop called "subject"?
 * >
 * > Because this is meant to support general lockups of content,
 * > along with form fields with labels, the word "subject" was chosen
 * > to encompass both concepts into a single prop name.
 */
export const Default: Story = {
    args: {
        children: 'Hello World!',
        subject: <text.h2 priority='primary'>Title</text.h2>
    },
}

/**
 * The given `icon` is placed with alignment to the `subject` as sized appropriately.
 */
export const Icon: Story = {
    args: {
        icon: 'info',
        children: 'Hello World!',
        subject: <text.h2 priority='primary'>Title</text.h2>
    },
}

/**
 * If you do not provide a `subject`, the `icon` will size with normal text.
 */
export const Minimal: Story = {
    args: {
        icon: 'info',
        children: 'Hello World!'
    },
}

/**
 * When creating a form field, the `lockup` introduces many other features.
 * 
 * - `passiveMessage` can be used to present helpful context to the user.
 * - `errorMessage` can be used to instruct the user regarding field errors.
 * - `getInputProps` is used to wire the `input` to the accessibility attributes.
 * 
 * > #### Why are the messages above the input?
 * >
 * > Having the message before the input helps raise the content more prominently
 * > than if it was below. This also avoids some of the browser built-in flyouts that
 * > may obscure this detail. It may also help with aligning submit buttons.
 * 
 * > #### Why is the error message shown with same presentation as the help message?
 * >
 * > The `mode` should convey the concept of having this composition in a "critical" state.
 * > As a result, the critical mode should present these elements accordingly.
 * >
 * > **TODO:** Allow for `invalid` to update the interal mode to present the concept of `critical`
 * > instead of expecting the author to determine the correct mode.
 */
export const Form: Story = {
    args: {
        subject: <text.label priority='secondary'>Email</text.label>,
        passiveMessage: 'Enter your email validate',
        errorMessage: 'Sorry, not good enough',
        icon: 'email'
    },
    render: (args) => {
        const [value, setValue] = useState('hello@example');
        const [inputProps, setInputProps] = useState({});

        const onChange = useCallback((ev: any) => {
            setValue(ev.target.value);
        }, []);

        return (
            <lockup.fieldset { ...args } getInputProps={ setInputProps }>
                <field.div>
                    <input.email { ...inputProps } value={ value } onChange={ onChange }/>
                </field.div>
            </lockup.fieldset>
        )
    }
}