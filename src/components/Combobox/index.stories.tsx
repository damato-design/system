import { useState, useMemo } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import checklist from './checklist.md?raw';

import { Combobox, ItemsProps, type ComboBoxProps } from '.';

/**
 * The `<Combobox/>` component connects several parts of the system together
 * into a single component for the purpose of entering a value.
 */
const meta = {
    title: 'Components/Combobox',
    component: Combobox,
    parameters: {
        docs: {
            story: {
                inline: false,
                iframeHeight: 360,
            },
        },
        checklist
    },
} satisfies Meta<ComboBoxProps>

export default meta
type Story = StoryObj<typeof meta>

/**
 * The `items` is expecting an array of `<Button/>`-like props to describe
 * each item. This configuration is supporting the presentation for the
 * internal `<listbox.div/>`.
 * 
 * In this example, we filter the `items` based on the `value` found within
 * the `<input.text/>`. All non-specific props are spread onto this element
 * such that fine-grain settings can be applied to this control.
 */
export const Default: Story = {
    args: {
        activeDescendant: 'option2',
        onActiveDescendantChange: () => {},
        items: [
            { id: 'option1', value: 'option1' },
            { id: 'option2', value: 'option2' },
            { id: 'option3', value: 'option3' }
        ],
        name: 'default',
    },
    render: (args) => {
        const [active, setActive] = useState(args.activeDescendant);
        const [value, setValue] = useState(args.items[0].value);

        const filtered = useMemo(() => {
            return args.items.filter((item) => item.value.startsWith(value));
        }, [args.items, value]);

        return (
            <Combobox
                { ...args }
                items={ filtered as ItemsProps }
                value={ value }
                onChange={ (ev: any) => setValue(ev.target.value) }
                onConfirm={ (item) => setValue(item.value) }
                activeDescendant={ active }
                onActiveDescendantChange={ setActive }/>
        )
    }
}