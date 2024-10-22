import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react'

import { text } from '.';

/**
 * The `text` primitive helps present text content.
 * The default `priority` for this component is `'secondary'`
 * meant to represent body copy. For more information on typography styles
 * please see the [Typography docs](/docs/foundations-typography--docs).
 */
const meta = {
    title: 'Primitives/text',
    component: text.span,
} satisfies Meta<typeof text.span>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: {
        children: 'Hello World!',
    }
}

export const Priority: Story = {
    args: {
        children: 'Hello World!',
        priority: 'primary'
    },
    render: (args) => <text.h2 { ...args } />
}

export const Links: Story = {
    args: { 
        priority: 'auxiliary'
    },
    render: (args) => (
        <text.p { ...args }>
            The quick brown fox <text.a href='#'>jumps over</text.a> the lazy dog.
        </text.p>
    )
}

export const ScreenreaderOnly: Story = {
    args: {
        children: 'Hello World!',
    },
    render: (args) => {
        const [srProps, setSrProps] = useState({});
        return (
            <>
                <text.label { ...srProps }>Tel:</text.label>
                <text.span { ...args } getScreenreaderProps={ setSrProps }>Telephone Number</text.span>
            </>
        )
    }
}