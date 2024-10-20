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
        const [active, setActive] = useState(args.activeDescendant);
        return (
            <>
                <box.div stretch>
                    { `Active option: ${active}` }
                </box.div>
                <listbox.div
                    { ...args }
                    activeDescendant={ active }
                    onActiveDescendantChange={ setActive } />
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
        // TODO: Pull out onFocus and onBlur to connect to menu?
        // TODO: onPointerDown on items to close?
        const [buttonProps, setButtonProps] = useState({});
        const [active, setActive] = useState(args.activeDescendant);
        const anchorRef = useRef(null);

        const menu = (
            <flyout.div anchorRef={ anchorRef } stretch>
                <box.div
                    stretch
                    purpose='surface'
                    priority='secondary'>
                    <listbox.div
                        { ...args }
                        getAnchorProps={ setButtonProps }
                        activeDescendant={ active }
                        onActiveDescendantChange={ setActive } />
                </box.div>
            </flyout.div>
        )

        return (
            <>
                <Button
                    { ...buttonProps }
                    ref={ anchorRef }
                    behavior='menu'
                    priority='primary'>
                    Menu
                </Button>
                { menu }
            </>
        )
    }
}
