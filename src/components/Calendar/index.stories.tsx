import { memo, useCallback, useMemo, useState } from 'react';
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

export const Default: Story = {};

function makePages(value: string, offset: number) {
    const [y, m] = value.split('-').map(Number);
    const d = new Date(Date.UTC(y, m - 1));
    // Set to prior month before computing months
    d.setUTCMonth((d.getUTCMonth() - offset) - 1);
    return Array.from({ length: 12 }, (_) => {
        d.setUTCMonth(d.getUTCMonth() + 1);
        const monthName = d.toLocaleString(undefined, { month: 'long' });
        const month = d.getUTCMonth() + 1;
        const year = d.getUTCFullYear();
        const value = [year, month].join('-');
        return {
            value,
            id: `d-${value}`,
            children: `${monthName} ${year}`,
        }
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
        value: '2024-11'
    },
    render: (args) => {
        const MID_INDEX = 5;
        
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
                <Calendar { ...args } value={ page.value } />
            </box.div>
        )
    }
}