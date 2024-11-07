import { useState, useMemo, useEffect } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { Combobox, ItemsProps } from '.';

/**
 * This component is a work-in-progress
 */
const meta = {
    title: 'Components/Combobox',
    component: Combobox,
    tags: ['draft'],
    parameters: {
        docs: {
            story: {
                inline: false,
                iframeHeight: 360,
            },
        },
    },
} satisfies Meta<typeof Combobox>

export default meta
type Story = StoryObj<typeof meta>

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
    render: ({ onActiveDescendantChange: _, ...args}) => {
        const [active, setActive] = useState(args.activeDescendant);
        const [value, setValue] = useState(args.items[0].value);

        const filtered = useMemo(() => {
            return args.items.filter((item) => item.value.startsWith(value)) as ItemsProps;
        }, [args.items, value]);

        return (
            <Combobox
                { ...args }
                items={ filtered }
                value={ value }
                onChange={ (ev: any) => setValue(ev.target.value) }
                onConfirm={ (item) => setValue(item.value) }
                activeDescendant={ active }
                onActiveDescendantChange={ setActive }/>
        )
    }
}