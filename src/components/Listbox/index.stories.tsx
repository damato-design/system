import { useRef } from 'react';
import type { Meta, StoryObj } from '@storybook/react'

import { listbox } from '.';

import { Button } from '../Button';

const meta = {
    title: 'Primitives/Listbox',
    component: listbox.div,
} satisfies Meta<typeof listbox.div>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: {
        
    },
    render: (args) => {
        const ref = useRef(null);
        return (
            <listbox.div { ...args } anchorRef={ ref }>
                <Button>Option 1</Button>
                <Button>Option 2</Button>
                <Button>Option 3</Button>
            </listbox.div>
        )
    }
}

