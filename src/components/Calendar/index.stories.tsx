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

function makePages(target: number, offset: number) {
    const d = new Date();
    // Set to prior month before computing months
    d.setMonth((target - offset) - 1);
    return Array.from({ length: 12 }, (_) => {
        const m = d.getMonth();
        d.setMonth(m + 1);
        const monthName = d.toLocaleString(undefined, { month: 'long' });
        const month = d.getMonth() + 1;
        const year = d.getFullYear();
        const id = ['d', year, month].join('-');
        return {
            item: {
                children: `${monthName} ${year}`,
                value: m + 1, // month index, December = 11
                id
            },
            month,
            year,
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
        value: { month: new Date().getMonth() + 1 }
    },
    render: (args) => {
        const MID_INDEX = 5;
        
        const [monthIndex, setMonthIndex] = useState(args?.value?.month! - 1);
        const pages = useMemo(() => makePages(monthIndex, MID_INDEX), [monthIndex, MID_INDEX]);
        const { month, year, item } = pages[MID_INDEX];

        const onActChange = useCallback((id: string) => {
            const target = pages.find((page) => page.item.id === id);
            setMonthIndex(target!.item.value);
        }, [monthIndex]);

        return (
            <box.div stack gap>
                <Pagination
                    activeDescendant={item.id}
                    onActiveDescendantChange={onActChange}
                    infill={ false }
                    items={ pages.map((page) => page.item) as ItemsProps }
                    index={ MID_INDEX }
                    onConfirm={ (item) => setMonthIndex(item.value)}>
                    { item.children }
                </Pagination>
                <Calendar { ...args } value={{
                    year,
                    month
                }} />
            </box.div>
        )
    }
}