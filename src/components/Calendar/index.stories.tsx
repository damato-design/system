import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react'

import { Calendar } from '.';
import { Pagination, ItemProps, ItemsProps } from '../Pagination';
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

export const Default: Story = {}

function makeMonth(_: any, i: number) {
    const d = new Date();
    d.setMonth(i);
    const month = d.toLocaleString(undefined, { month: 'long' });
    return { 
        id: `date-${d.getFullYear()}-${d.getMonth()+1}`,
        children: `${month} ${d.getFullYear()}`,
        value: i
    } as ItemProps
}

export const Paginate: Story = {
    args: {},
    render: (args) => {
        const items = Array.from({ length: 12 }, makeMonth) as ItemsProps;
        const [item, setItem] = useState(items[0]);

        return (
            <box.div stack gap>
                <Pagination
                    infill={ false }
                    items={ items }
                    index={ item.value }
                    onConfirm={ setItem }>
                    { item.children }
                </Pagination>
                <Calendar {...args} />
            </box.div>
        )
    }
}