import { useCallback, useState, useMemo } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { Combobox } from '.';

/**
 * This component is a work-in-progress
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
    },
} satisfies Meta<typeof Combobox>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: {
        activeDescendant: 'option2',
        onActiveDescendantChange: () => {},
        items: [{ id: 'null' }],
        name: 'default',
        value: 'option2'
    },
    render: ({ onActiveDescendantChange: _, ...args}) => {
        const [active, setActive] = useState(args.activeDescendant);
        const [show, setShow] = useState(false);
        const [value, setValue] = useState(args.value);

        const onChange = useCallback((ev: any) => {
            setValue(ev.target.value);
            if (ev.target.tagName === 'BUTTON') setShow(false);
        }, []);

        const enhancedItems = useMemo(() => {
            const items = [
                { id: 'option1', value: 'option1', onClick: onChange },
                { id: 'option2', value: 'option2', onClick: onChange },
                { id: 'option3', value: 'option3', onClick: onChange }
            ];

            const filtered = items.filter((item) => item.id.startsWith(value as string));
            const hasActive = filtered.some((item) => item.id === active);

            if (!hasActive && filtered[0]) {
                // If the active item no longer exists, update to the first
                setActive(filtered[0].id);
            }

            return filtered;
        }, [value, active]);

        const onKeyUp = useCallback((ev: any) => {
            setShow(Boolean(value));
            if (ev.key !== 'Enter' || !show) return;
            const item = enhancedItems.find((item) => item.id === active);
            if (!item) return;
            setValue(item.value);
            setShow(false);
        }, [show, active, enhancedItems, value]);

        return (
            <Combobox
                { ...args }
                items={ enhancedItems }
                show={ show }
                onKeyUp={ onKeyUp }
                value={ value }
                onChange={ onChange }
                activeDescendant={ active }
                onActiveDescendantChange={ setActive }/>
        )
    }
}