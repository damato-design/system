import { useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react'

import { listbox } from '.';
import { box } from '../Box';
import { Button } from '../Button';
import { flyout } from '../Flyout'; 

const meta = {
    title: 'Primitives/Listbox',
    component: listbox.div,
} satisfies Meta<typeof listbox.div>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: {
        activeDescendant: 'option2',
        onActiveDescendantChange: () => {},
        items: [
            { id: 'option1' },
            { id: 'option2' },
            { id: 'option3' }
        ]
    },
    render: ({ onActiveDescendantChange: _, ...args}) => {
        const [activeDescendant, onActiveDescendantChange] = useState(args.activeDescendant);
        return (
            <>
                <box.div stretch>
                    { `Active option: ${activeDescendant}` }
                </box.div>
                <listbox.div
                    { ...args }
                    activeDescendant={ activeDescendant }
                    onActiveDescendantChange={ onActiveDescendantChange } />
            </>
        )
    }
}

export const Menu: Story = {
    args: {
        activeDescendant: 'option2',
        onActiveDescendantChange: () => {},
        behavior: 'menu',
        items: [
            { id: 'option1' },
            { id: 'option2' },
            { id: 'option3' }
        ]
    },
    render: ({ onActiveDescendantChange: _, ...args}) => {
        const [buttonProps, setButtonProps] = useState({});
        const [activeDescendant, onActiveDescendantChange] = useState(args.activeDescendant);
        const anchorRef = useRef(null)
        return (
            <>
                <Button
                    { ...buttonProps }
                    ref={ anchorRef }
                    behavior='menu'
                    priority='primary'>
                    Menu
                </Button>
                <flyout.div anchorRef={ anchorRef } stretch>
                    <box.div
                        stretch={ true }
                        purpose='surface'
                        priority='secondary'>
                        <listbox.div
                            { ...args }
                            activeDescendant={ activeDescendant }
                            onActiveDescendantChange={ onActiveDescendantChange } />
                    </box.div>
                </flyout.div>
            </>
        )
    }
}
