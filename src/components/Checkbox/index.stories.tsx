import type { Meta, StoryObj } from '@storybook/react'

import { Checkbox } from '.';

import { box } from '../Box';
import { Button } from '../Button';
import { field } from '../Field';
import { input } from '../Input';

const meta = {
    title: 'Components/Checkbox',
    component: Checkbox,
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

/**
 * The `name` prop is **required** for the component.
 */
export const Default: Story = {
    args: { name: 'default' },
}

/**
 * The component can behave as a radio button by setting `exclusive`.
 */
export const Radio: Story = {
    args: { 
        name: 'radio',
        exclusive: true
    }
}

/**
 * This example is meant to test alignment between commonly paired elements.
 */
export const Alignment: Story = {
    args: { name: 'alignment' },
    render: (args) => {
        return (
            <box.div gap inset={{ block: 'end' }}>
                <Checkbox { ...args }/>
                <field.div>
                    <input.text placeholder='Ready'/>
                </field.div>
                <Button icon='star' aria-label="favorite" priority='secondary'/>
            </box.div>
        )
    }
}
