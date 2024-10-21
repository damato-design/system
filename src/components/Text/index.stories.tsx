import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react'

import { text } from '.';

/**
 * The `text` primitive helps present text content.
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

export const ScreenreaderOnly: Story = {
    args: {
        children: 'Hello World!',
    },
    render: (args) => {
        const [srProps, setSrProps] = useState({});
        return (
            <>
                <text.label { ...srProps } priority='secondary'>Tel:</text.label>
                <text.span { ...args } getScreenreaderProps={ setSrProps }>Telephone Number</text.span>
            </>
        )
    }
}