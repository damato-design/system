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


export const Default: Story = {
    args: { name: 'default' },
}

export const RadioButton: Story = {
    args: { 
        name: 'radio',
        exclusive: true,
        label: 'Only this one'
    }
}

export const Alignment: Story = {
    args: { name: 'alignment' },
    render: (args) => {
        return (
            <box.div gap inset={{ block: 'end' }}>
                <Checkbox { ...args }/>
                <field.div>
                    <input.text name='alignment' placeholder='Ready'/>
                </field.div>
                <Button icon='star' aria-label="favorite" priority='secondary'/>
            </box.div>
        )
    }
}
