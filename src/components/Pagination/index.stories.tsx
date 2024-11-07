import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { Pagination, ItemsProps, ItemProps } from '.';

/**
 * This component is a work-in-progress
 */
const meta = {
    title: 'Components/Pagination',
    component: Pagination,
    tags: ['draft'],
    parameters: {
        docs: {
            story: {
                inline: false,
                iframeHeight: 360,
            },
        },
    },
} satisfies Meta<typeof Pagination>

export default meta
type Story = StoryObj<typeof meta>

function makePage(_: any, i: number) {
    return { id: `page-${i + 1}`, value: i } as ItemProps
}

function makePages(length: number) {
    return Array.from({ length }, makePage) as ItemsProps;
}

export const Default: Story = {
    args: {
        index: 0,
        items: makePages(4),
    },
    render: (args) => {
        const [item, setItem] = useState(args.items[args.index]);

        return (
            <Pagination
                { ...args }
                index={ item.value }
                onConfirm={ setItem }>
                { item.value + 1 }
            </Pagination>
        )
    }
}