import type { Meta, StoryObj } from '@storybook/react'

import { Checkbox } from '.';

import { box } from '../Box';
import { Button } from '../Button';
import { field } from '../Field';
import { input } from '../Input';

/**
 * A confirmational boolean input
 */
const meta = {
    title: 'Components/Checkbox',
    component: Checkbox,
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>


/**
 * The default configuration is a box that can be checked or unchecked.
 */
export const Default: Story = {
    args: { name: 'default' },
}

/**
 * When setting the `exclusive` flag, the component is presented as a radio button.
 * Then the component can only be unchecked by selecting another option with the same `name`.
 */
export const RadioButton: Story = {
    args: { 
        name: 'radio',
        exclusive: true,
        label: 'Only this one'
    }
}

/**
 * This demonstrates the alignment between form elements.
 * In this case we explicitly set `placeChildren='center'` to center
 * the control vertically. The height of the control should match the
 * line-height of sibling content.
 */
export const Alignment: Story = {
    args: { name: 'alignment' },
    render: (args) => {
        return (
            <box.div gap placeChildren='center'>
                <Checkbox { ...args }/>
                <field.div>
                    <input.text name='alignment'/>
                </field.div>
                <Button icon='star' aria-label="favorite" priority='secondary'/>
            </box.div>
        )
    }
}
