import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react'

import { flyout } from '.';
import { Button } from '../Button';
import { box } from '../Box';

/**
 * The `flyout` primitive attaches itself to an anchor element.
 * It is effectively invisible and uses new native anchor positioning.
 */
const meta = {
    title: 'Primitives/flyout',
    component: flyout.div,
} satisfies Meta<typeof flyout.div>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: {
        children: 'Hello World!',
    },
    render: (args) => {
        const [anchorProps, setAnchorProps] = useState({});
        return (
            <>
                <Button { ...anchorProps } priority='primary'>anchor element</Button>
                <flyout.div { ...args } getAnchorProps={ setAnchorProps }>
                    flyout is open!
                </flyout.div>
            </>
        )
    }
}

export const Stretch: Story = {
    args: {
        children: 'Hello World!',
        stretch: true
    },
    render: (args) => {
        const [anchorProps, setAnchorProps] = useState({});
        return (
            <>
                <Button { ...anchorProps } priority='primary'>anchor element</Button>
                <flyout.div { ...args } getAnchorProps={ setAnchorProps }>
                    <box.div
                        stretch={ args.stretch }
                        padding
                        purpose='surface'
                        priority='secondary'>
                        Hi! 👋
                    </box.div>
                </flyout.div>
            </>
        )
    }
}