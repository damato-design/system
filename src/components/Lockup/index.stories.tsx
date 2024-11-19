import type { Meta, StoryObj } from '@storybook/react'

import { lockup, LockupProvider, useLockup } from '.';
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

/**
 * It is common to show a `subject` (either a title or label) to introduce a concept
 * and then further explain the concept with additional information.
 */
export const Default: Story = {
    args: {
        subject: <text.h2 priority='primary'>Profound Story</text.h2>,
        children: 'Once upon a time, there was a great protagonist.'
    },
}

/**
 * You can provide an icon reference to the `icon` prop to render the glyph
 * on the leading side of the composition. If a `subject` is provided,
 * the `icon` is wrapped with an identical treatment to the given `subject`
 * so it can match its presence. For more about icons, see the [Icon docs](/docs/primitives-icon--docs).
 */
export const Icon: Story = {
    args: {
        icon: 'info',
        children: 'Hello World!',
        subject: <text.h2 priority='primary'>Title</text.h2>
    },
}

/**
 * If you want to provide the ability for a user to dismiss the message
 * you can include the `<Close/>` component. The placement of the component
 * is important to ensure it does not conflict with content. For more about
 * this expectation, see the [Close docs](/docs/primitives-close--docs).
 */
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

/**
 * This component is also helpful with small amounts of content.
 * In this example, we standardize the composition of an `icon`
 * with normal body copy.
 */
export const Minimal: Story = {
    args: {
        icon: 'info',
        children: 'Hello World!'
    },
}

/**
 * The component is an extension of `box` and can be used similarly.
 * In this example, we set the `standby` flag to present the internal
 * structure in a loading state.
 */
export const Loading: Story = {
    render: (args) => (
        <lockup.div { ...args }
            standby
            subject={ <text.h2 priority='primary'/> }>
            <text.p/>
        </lockup.div>
    )
}

/**
 * The component can also be used for form field composition.
 * The `passiveMessage` can be used to include helpful context about the field.
 * The `errorMessage` will politely announce its content when it is provided.
 */
export const Form: Story = {
    args: {
        subject: <text.label>Email</text.label>,
        passiveMessage: 'Enter your email to validate',
        errorMessage: 'Sorry, not good enough',
        icon: 'email'
    },
    render: (args) => {
        const [value, setValue] = useState('hello@example');

        const onChange = useCallback((ev: any) => {
            setValue(ev.target.value);
        }, []);

        return (
            <lockup.fieldset { ...args }>
                <field.div>
                    <input.email name='email' value={ value } onChange={ onChange }/>
                </field.div>
            </lockup.fieldset>
        )
    }
}