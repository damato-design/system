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

        return (
            <Combobox
                { ...args }
                value={ value }
                onChange={ (ev: any) => setValue(ev.target.value) }
                onConfirm={ setValue }
                activeDescendant={ active }
                onActiveDescendantChange={ setActive }/>
        )
    }
}