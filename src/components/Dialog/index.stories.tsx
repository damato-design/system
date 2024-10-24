import type { Meta, StoryObj } from '@storybook/react'

import { Dialog } from '.';

import { text } from '../Text';
import { box } from '../Box';
import { Button } from '../Button';
import { Close } from '../Close';

/**
 * A standardized lockup meant to start a dialog between
 * the system and the user.
 */
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
        subject: <text.h2 priority='primary'>Watch out!</text.h2>,
        children: `
            If you tell someone to watch out,
            you are warning them to be careful,
            because something unpleasant might
            happen to them or they might get
            into difficulties.
        `
    },
}

export const Modal: Story = {
    parameters: {
        docs: {
            story: {
                inline: false,
                iframeHeight: 760,
            },
        },
    },
    args: {
        modal: true,
        emphasis: 'critical',
        priority: 'primary',
        subject: (
            <text.h2 priority='primary'>
                <Close onClick={() => console.log('close!')}/>
                Do not do this
            </text.h2>
        ),
        children: [
            <text.p key='description'>
                Modals are the crutch of the inarticulate designer and developer.
                Remember to always ask, "Why does this have to be a modal?"
                <text.a href="https://modalzmodalzmodalz.com/">
                    modalzmodalzmodalz.com
                </text.a>
            </text.p>,
            <box.div actions key='actions'>
                <Button priority='primary'>Submit</Button>
                <Button>Cancel</Button>
            </box.div>
        ],
        onClose: () => console.log('Trying to close this!')
    },
}
