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

export const Default: Story = {
    args: {
        activeDescendant: 'option2',
        onActiveDescendantChange: () => {},
        onClick: () => {},
        items: [{ id: 'null' }],
    },
    render: ({ onActiveDescendantChange: _, ...args}) => {
        const PAGES = 4;
        const [active, setActive] = useState(args.activeDescendant);
        const [value, setValue] = useState(1);

        const onChange = useCallback((ev: any) => {
            // check for previous / next
            setValue(ev.target.value);
        }, []);

        const enhancedItems = useMemo(() => {
            return Array.from({ length: PAGES }, (_, i) => {
                const page = i + 1;
                return {
                    id: `page-${page}`,
                    children: page,
                    value: page,
                    onClick: onChange
                }
            });
        }, []);

        return (
            <Pagination
                { ...args }
                items={ enhancedItems }
                value={ value }
                onChange={ onChange }
                onClick={ onChange }
                activeDescendant={ active }
                onActiveDescendantChange={ setActive }>
                { value }
            </Pagination>
        )
    }
}