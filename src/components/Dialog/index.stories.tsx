import type { Meta, StoryObj } from '@storybook/react'

import { Dialog } from '.';

import { text } from '../Text';
import { box } from '../Box';
import { Button } from '../Button';
import { Close } from '../Close';

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

/**
 * Emphasis can inform the message more purpose.
 * 
 * This is also an example of the icon sizing with the title if provided.
 */
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

/**
 * This is an example of the modal configuration for the `<Dialog/>`.
 * Don't use it, modals are awful for user experience.
 * It is only here to serve as an exploration on how it could be done.
 * 
 * Check the console to see the close events fire (click outside or Escape key).
 * 
 * Note that the `<Close/>` button event is not connected to the component's
 * native close listeners. In a more complete example, you would most likely
 * assign the same listener to both.
 */
export const Modal: Story = {
    parameters: {
        docs: {
            story: {
                inline: false,
                iframeHeight: 700,
            },
        },
    },
    args: {
        modal: true,
        emphasis: 'critical',
        subject: (
            <text.h2 priority='primary'>
                <Close onClick={() => console.log('close!')}/>
                Don't do this
            </text.h2>
        ),
        children: [
            <text.p key='description' priority='secondary'>
                Modals are the crutch of the inarticulate designer and developer.
                Remember to always ask, "Why does this have to be a modal?"
                <Button href="https://modalzmodalzmodalz.com/" inline>
                    modalzmodalzmodalz.com
                </Button>
            </text.p>,
            <box.div gap key='actions'>
                <Button priority='primary'>Submit</Button>
                <Button>Cancel</Button>
            </box.div>
        ],
        onClose: () => console.log('Trying to close this!')
    },
}
