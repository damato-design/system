import { useCallback, useState, useMemo } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { Pagination } from '.';

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

function makePages(length: number): object[] {
    return Array.from({ length }, (_, i) => ({
        id: `page-${i + 1}`,
        children: i + 1,
        value: i,
    }))
}

export const Default: Story = {
    args: {
        items: makePages(4),
    },
    render: (args) => {
        const [item, setItem] = useState(args.items[0]);

        return (
            <Pagination
                { ...args }
                index={ item.value }
                onConfirm={ setItem }>
                { item.children }
            </Pagination>
        )
    }
}