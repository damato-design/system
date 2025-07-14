import type { Meta, StoryObj } from '@storybook/react';
import checklist from './checklist.md?raw';

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
    parameters: {
        checklist
    }
} satisfies Meta<typeof Dialog>

export default meta
type Story = StoryObj<typeof meta>

/**
 * This is a minimal representation of content to display to a user.
 */
export const Default: Story = {
    args: {
        children: <text.p>Something you might want to know.</text.p>
    },
}

/**
 * You can present a more important version of your message by including `emphasis`.
 * This will introduce further presentational attributes to convey the importance of your message.
 */
export const Emphasis: Story = {
    args: {
        emphasis: 'warning',
        subject: <text.h2 priority='primary'>Watch out!</text.h2>,
        children: (
            <text.p>
                If you tell someone to watch out,
                you are warning them to be careful,
                because something unpleasant might
                happen to them or they might get
                into difficulties.
            </text.p>
        )
    },
}

/**
 * Modals are generally an awful pattern, akin to popup advertisements.
 * They are a legacy pattern in human-computer interaction for creating a dialog
 * between the system and the user. As an alternative, we can create these dialogs
 * inline with the rest of the content. This example is for demonstrative purposes
 * by using the `disrupt` flag on the `<Dialog/>` meant to disrupt the user.
 * 
 * > #### Where is the density control for this example?
 * >
 * > Because this example uses the top-layer,
 * > all included elements would be inaccessible behind the overlay,
 * > including this control.
 */
export const Modal: Story = {
    parameters: {
        docs: {
            story: {
                inline: false,
                iframeHeight: 760,
            },
        },
        densityLevel: false
    },
    args: {
        disrupt: true,
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
            <box.div infill key='actions'>
                <Button priority='primary' stretch>Submit</Button>
                <Button stretch>Cancel</Button>
            </box.div>
        ],
        onClose: () => console.log('Trying to close this!')
    },
}
