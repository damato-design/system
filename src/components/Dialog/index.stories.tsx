import type { Meta, StoryObj } from '@storybook/react'

import { Dialog } from '.';

import { text } from '../Text';

const meta = {
    title: 'Components/Dialog',
    component: Dialog,
} satisfies Meta<typeof Dialog>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: {
        children: 'Something you might want to know.'
    },
}

export const Emphasis: Story = {
    args: {
        emphasis: 'warning',
        title: <text.h2 priority='primary'>Watch out!</text.h2>,
        children: `
            If you tell someone to watch out,
            you are warning them to be careful,
            because something unpleasant might
            happen to them or they might get
            into difficulties.
        `
    },
}

