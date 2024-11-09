import { useCallback, useMemo, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react'

import { Calendar } from '.';
import { Pagination, ItemsProps } from '../Pagination';
import { box } from '../Box';

/**
 * WIP calendar
 */
const meta = {
    title: 'Components/Calendar',
    component: Calendar,
    tags: ['draft']
} satisfies Meta<typeof Calendar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: {
        value: '2024-11',
        onActiveDescendantChange: () => {}
    },
    render: (args) => {
        const [activeDescendant, onActiveDescendantChange] = useState(args.value);
        return <Calendar
            { ...args }
            activeDescendant={ activeDescendant }
            onActiveDescendantChange={ onActiveDescendantChange }/>
    }
};

function makePages(value: string, offset: number) {
    const [y, m] = value.split('-').map(Number);
    const d = new Date(Date.UTC(y, m - 1, 15));
    // Set to prior month before computing months
    d.setUTCMonth((d.getUTCMonth() - offset) - 1);
    return Array.from({ length: 12 }, () => {
        d.setUTCMonth(d.getUTCMonth() + 1);
        const children = d.toLocaleString(navigator.language, { month: 'long', year: 'numeric' });
        const value = [d.getUTCFullYear(), d.getUTCMonth() + 1].join('-');
        return { id: `d-${value}`, children, value };
    });
}

export const Paginate: Story = {
    parameters: {
        docs: {
            story: {
                inline: false,
                iframeHeight: 760,
            },
        },
    },
    args: {
        value: '2024-11',
        onActiveDescendantChange: () => {}
    },
    render: (args) => {
        const MID_INDEX = 5;
        
        const [activeDescendant, onActiveDescendantChange] = useState(args.value);
        const [val, setVal] = useState(args.value!);
        const pages = useMemo(() => makePages(val, MID_INDEX), [val, MID_INDEX]);
        const page = pages[MID_INDEX];

        const onActChange = useCallback((id: string) => {
            const { value } = pages.find((item) => item.id === id) || args;
            setVal(value!);
        }, [val]);

        return (
            <box.div stack gap>
                <Pagination
                    activeDescendant={page.id}
                    onActiveDescendantChange={onActChange}
                    infill={ false }
                    items={ pages as ItemsProps }
                    index={ MID_INDEX }
                    onConfirm={ (item) => setVal(item.value)}>
                    { page.children }
                </Pagination>
                <Calendar
                    { ...args }
                    value={ page.value }
                    activeDescendant={activeDescendant}
                    onActiveDescendantChange={ onActiveDescendantChange }/>
            </box.div>
        )
    }
}