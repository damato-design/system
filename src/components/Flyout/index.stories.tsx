import { createRef, useRef } from 'react';
import type { Meta, StoryObj } from '@storybook/react'

import { flyout } from '.';
import { Button } from '../Button';
import { box } from '../Box';

const meta = {
    title: 'Primitives/Flyout',
    component: flyout.div,
} satisfies Meta<typeof flyout.div>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: {
        children: 'Hello World!',
        anchorRef: createRef(),
    },
    render: ({ anchorRef: _, ...args }) => {
        const anchorRef = useRef(null);
        return (
            <>
                <Button ref={ anchorRef } priority='primary'>anchor element</Button>
                <flyout.div { ...args } anchorRef={ anchorRef }>
                    flyout is open!
                </flyout.div>
            </>
        )
    }
}

export const Stretch: Story = {
    args: {
        children: 'Hello World!',
        anchorRef: createRef(),
        stretch: true
    },
    render: ({ anchorRef: _, ...args }) => {
        const anchorRef = useRef(null);
        return (
            <>
                <Button ref={ anchorRef } priority='primary'>anchor element</Button>
                <flyout.div { ...args } anchorRef={ anchorRef }>
                    <box.div
                        padding
                        purpose='surface'
                        priority='secondary'>Hi! 👋</box.div>
                </flyout.div>
            </>
        )
    }
}