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

/**
 * The component is very simple. In fact, it is a simple `box` primitive
 * with defaults set.
 * 
 * - `stretch` is set to `true` as default but configurable.
 * - `purpose` is set to `'control'`.
 * - `inset` is set to `{ block: 'center' }`
 * - `outset` is _sometimes_ set to `{ block: 'start }`, depending on `stretch`.
 * 
 * There are other internal configurations set to help with final presentation of children.
 * It is recommended to use this component instead of using `box` directly.
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
 * You can add an `icon` or a normal HTML `<hr/>` to the `field`.
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
 * This example demonstrates how the `field` can include the `<input.number/>`
 * and `<Button/>` elements. This example sets `stretch={ false }`.
 * 
 * Note the use of `fieldSizing='content'` on the `<input.number/>` so the input
 * will adjust to the size of the value.
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
            <field.div { ...args }>
                <Button icon='remove' aria-label='Decrement' value={ -1 } onClick={ onClick }/>
                <input.number name='number' value={ value } onChange={ onChange } fieldSizing='content'/>
                <Button icon='add' aria-label='Increment' value={ 1 } onClick={ onClick }/>
            </field.div>
        )
    }
}

/**
 * This demonstrates the alignment of a `<Button/>` outside of the `field`.
 * We set the `inset` to `{ block: 'end' }` on the parent to ensure
 * the elements do not stretch, but still align at the bottom.
 * 
 * > #### Why doesn't the field stretch in this example?
 * >
 * > The `field` is composed inside of a `box` where its `stretch` value is
 * > effectively `false`; the default for `box` elements. This means that the
 * > `field` is the default size; similar to if `stretc` was set as `false` without
 * > `fieldSizing='content'`.
 */
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
