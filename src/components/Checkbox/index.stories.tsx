import { useState, useCallback, ChangeEvent } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import checklist from './checklist.md?raw';

import { Checkbox } from '.';

import { box } from '../Box';
import { text } from '../Text';
import { Button } from '../Button';
import { field } from '../Field';
import { input } from '../Input';
import { lockup } from '../Lockup';

/**
 * A confirmational boolean input
 */
const meta = {
    title: 'Components/Checkbox',
    component: Checkbox,
    parameters: {
        checklist
    }
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
 * You can create a checkbox group by using the `lockup.fieldset` and a `text.legend`.
 * The state is an object of `value: boolean` key-value pairs, where the `value`
 * is the identifier for each checkbox. Like other elements in the system, the `id` is restricted.
 * The label and input are internally connected.
 * 
 * ```ts
 * const onChange = useCallback((ev: ChangeEvent<HTMLInputElement>) => {
 *  setState((prev) => ({ ...prev, [ev.target.value]: ev.target.checked }) as typeof state);
 * }, []);
 * ```
 */
export const CheckboxGroup: Story = {
    args: { name: 'fruit' },
    render: (args) => {
        const [state, setState] = useState({
            apple: false,
            banana: false,
            grapes: false,
            watermelon: false,
        });

        const onChange = useCallback((ev: ChangeEvent<HTMLInputElement>) => {
            setState((prev) => ({ ...prev, [ev.target.value]: ev.target.checked }) as typeof state);
        }, []);

        return (
            <lockup.fieldset subject={ <text.legend>Select a fruit</text.legend> }>
                { Object.entries(state).map(([value, checked]) => (
                    <Checkbox
                        {...args}
                        key={ value }
                        value={ value }
                        label={ value }
                        checked={ checked }
                        onChange={ onChange }/>
                )) }
            </lockup.fieldset>
        )
    }
}

/**
 * Similar to the checkbox group above, you can create a radio group in a similar way
 * by including the `exclusive` flag. The state management is slightly different,
 * since only one item can be checked at a time. If `onChange` fires, it means this is a newly checked item.
 * 
 * The only setup different between the checkbox group and this example is the `exclusive` flag and the `onChange` handling.
 * 
 * ```ts
 * const onChange = useCallback((ev: ChangeEvent<HTMLInputElement>) => {
 *   setState((prev) => Object.keys(prev).reduce((acc, key) => ({...acc, ...({ [key]: key === ev.target.value })}), {}) as typeof state);
 * }, []);
 * ```
 */
export const RadioGroup: Story = {
    args: { name: 'fruit', exclusive: true },
    render: (args) => {
        const [state, setState] = useState({
            apple: false,
            banana: false,
            grapes: false,
            watermelon: false,
        });

        const onChange = useCallback((ev: ChangeEvent<HTMLInputElement>) => {
            setState((prev) => Object.keys(prev).reduce((acc, key) => ({...acc, ...({ [key]: key === ev.target.value })}), {}) as typeof state);
        }, []);

        return (
            <lockup.fieldset subject={ <text.legend>Select a fruit</text.legend> }>
                { Object.entries(state).map(([value, checked]) => (
                    <Checkbox
                        {...args}
                        key={ value }
                        value={ value }
                        label={ value }
                        checked={ checked }
                        onChange={ onChange }/>
                )) }
            </lockup.fieldset>
        )
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
