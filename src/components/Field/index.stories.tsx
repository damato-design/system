import React from 'react';
import type { Meta, StoryObj } from '@storybook/react'

import { field } from '.';

import { box } from '../Box';
import { input } from '../Input';
import { icon } from '../Icon';
import { Button } from '../Button';

/**
 * The `field` primitive helps compose user input fields.
 * Generally, you'll be adding a single `<input.text/>` as the child,
 * but you can include other accessories within the field.
 */
const meta = {
    title: 'Primitives/field',
    component: field.div,
} satisfies Meta<typeof field.div>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: {},
    render: (args) => {
        return (
            <field.div { ...args }>
                <input.text name='search' placeholder='Search for something'/>
            </field.div>
        )
    }
}

export const Icon: Story = {
    args: {},
    render: (args) => {
        return (
            <field.div { ...args }>
                <icon.phone/>
                <hr/>
                <input.tel name='telephone' placeholder='(212) 867-5309'/>
            </field.div>
        )
    }
}

export const InnerButton: Story = {
    args: { stretch: false },
    render: (args) => {
        const [value, setValue] = React.useState(0);

        const onClick = React.useCallback((ev: any) => {
            setValue((val) => val + Number(ev.target.value));
        }, []);

        const onChange = React.useCallback((ev: any) => {
            setValue(ev.target.value);
        }, []);

        return (
            <field.div { ...args }>
                <Button icon='remove' aria-label='Decrement' value={ -1 } onClick={ onClick }/>
                <input.number name='number' value={ value } onChange={ onChange } fieldSizing='content'/>
                <Button icon='add' aria-label='Increment' value={ 1 } onClick={ onClick }/>
            </field.div>
        )
    }
}

export const OuterButton: Story = {
    args: {},
    render: (args) => {
        const [value, setValue] = React.useState('hello@example.com');

        const onClick = React.useCallback(() => {
            console.log(`Your email is entered: `, value);
        }, [value]);

        const onChange = React.useCallback((ev: any) => {
            setValue(ev.target.value);
        }, []);

        return (
            <box.form action='' gap inset={{ block: 'end' }}>
                <field.div { ...args }>
                    <input.email name='email' value={ value } onChange={ onChange }/>
                </field.div>
                <Button priority='primary' icon='email' onClick={ onClick }>
                    Subscribe
                </Button>
            </box.form>
        )
    }
}
