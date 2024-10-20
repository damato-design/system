import type { Meta, StoryObj } from '@storybook/react'

import { lockup } from '.';
import { text } from '../Text';
// import { Button } from '../Button';

const meta = {
    title: 'Primitives/lockup',
    component: lockup.div,
} satisfies Meta<typeof lockup.div>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: {
        children: 'Hello World!',
        title: <text.h2 priority='primary'>Title</text.h2>
    },
}

export const Icon: Story = {
    args: {
        icon: 'info',
        children: 'Hello World!',
        title: <text.h2 priority='primary'>Title</text.h2>
    },
}

export const Minimal: Story = {
    args: {
        icon: 'info',
        children: 'Hello World!'
    },
}