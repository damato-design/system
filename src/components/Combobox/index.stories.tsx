import { useCallback, useState, useMemo } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { Combobox } from '.';

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
        value: 'option2'
    },
    render: ({ onActiveDescendantChange: _, ...args}) => {
        const [active, setActive] = useState(args.activeDescendant);
        const [value, setValue] = useState(args.value);

        const enhancedItems = useMemo(() => {

            const filtered = args.items.filter((item) => value
                && typeof value === 'string'
                && item.id.startsWith(value)
            );
            const hasActive = filtered.some((item) => item.id === active);

            if (!hasActive && filtered[0]) {
                // If the active item no longer exists, update to the first
                setActive(filtered[0].id);
            }

            return filtered;
        }, [value, active]);

        return (
            <Combobox
                { ...args }
                // items={ enhancedItems }
                value={ value }
                onChange={ (ev: any) => {
                    console.log('change');
                    setValue(ev.target.value);
                } }
                onConfirm={ setValue }
                activeDescendant={ active }
                onActiveDescendantChange={ setActive }/>
        )
    }
}