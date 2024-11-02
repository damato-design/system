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
 * 
 * > #### Why is the `field` separate from the `input`?
 * >
 * > This allows for mixed content to appear within the field, such
 * > as icons and buttons.
 */
const meta = {
    title: 'Primitives/field',
    component: field.div,
} satisfies Meta<typeof field.div>

export default meta
type Story = StoryObj<typeof meta>

/**
 * By default, the `field` expects at least an `input` primitive
 * to complete the experience of allowing the user to fill out a form.
 */
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

/**
 * An `icon` can be placed in the field to draw attention to the input expectation.
 * You can also separate regions within the `field` by using a native HTML `<hr/>`
 * element.
 */
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

/**
 * This example demonstrates the alignment of `<Button/>` elements
 * internal to the `field` in comparison to buttons that
 * may appear adjacent to the `field`.
 */
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
            <box.form action='' gap placeChildren='top'>
                <field.div { ...args }>
                    <Button icon='remove' aria-label='Decrement' value={ -1 } onClick={ onClick }/>
                    <input.number name='number' value={ value } onChange={ onChange } fieldSizing='content'/>
                    <Button icon='add' aria-label='Increment' value={ 1 } onClick={ onClick }/>
                </field.div>
                <Button priority='primary'>
                    Submit
                </Button>
            </box.form>
        )
    }
}

/**
 * This example demonstrates the alignment of a `field` without
 * internal `<Button/>` elements. This also makes use of the `infill`
 * flag for `box` which can allow elements to stack and stretch when
 * minimal space is available.
 */
export const OuterButton: Story = {
    args: { stretch: true },
    render: (args) => {
        const [value, setValue] = React.useState('hello@example.com');

        const onClick = React.useCallback(() => {
            console.log(`Your email is entered: `, value);
        }, [value]);

        const onChange = React.useCallback((ev: any) => {
            setValue(ev.target.value);
        }, []);

        return (
            <box.form action='' infill placeChildren='top'>
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
