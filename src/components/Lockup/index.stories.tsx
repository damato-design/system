import type { Meta, StoryObj } from '@storybook/react'

import { lockup } from '.';
import { text } from '../Text';
import { field } from '../Field';
import { input } from '../Input';
import { useCallback, useState } from 'react';
import { Close } from '../Close';

/**
 * The `lockup` primitive helps create standardized layouts of content.
 */
const meta = {
    title: 'Primitives/lockup',
    component: lockup.div,
} satisfies Meta<typeof lockup.div>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: {
        children: 'Hello World!',
        subject: <text.h2 priority='primary'>Title</text.h2>
    },
}

export const Icon: Story = {
    args: {
        icon: 'info',
        children: 'Hello World!',
        subject: <text.h2 priority='primary'>Title</text.h2>
    },
}

export const Dismissable: Story = {
    args: {
        children: 'Hello World!',
        subject: (
            <text.h2 priority='primary'>
                <Close onClick={ ()=> console.log('Close!') }/>
                Maybe you would like this message to be closed?
            </text.h2>
        )
    },
}

export const Minimal: Story = {
    args: {
        icon: 'info',
        children: 'Hello World!'
    },
}

export const Form: Story = {
    args: {
        subject: <text.label priority='primary'>Email</text.label>,
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
                    <input.email { ...inputProps } name='email' value={ value } onChange={ onChange }/>
                </field.div>
            </lockup.fieldset>
        )
    }
}