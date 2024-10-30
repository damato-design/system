import type { Meta, StoryObj } from '@storybook/react'

import { card } from '.';
import { text } from '../Text';
import { box } from '../Box';
import { Button } from '../Button';
import { Close } from '../Close';

/**
 * Work in progress
 */
const meta = {
    title: 'Components/card',
    component: card.div,
    parameters: {
        docs: {
            story: {
                inline: false,
                iframeHeight: 760,
            },
        },
    },
} satisfies Meta<typeof card.div>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: {
        src: 'https://loremflickr.com/1280/720',
        padding: true,
        purpose: 'surface'
    }
}

export const Full: Story = {
    args: {
        src: 'https://loremflickr.com/1280/720',
        padding: true,
        purpose: 'surface',
        subject: (
            <text.h2 priority='primary'>
                <Close float={ false }/>
                Bushwick plaid raw denim
            </text.h2>
        ),
        passiveMessage: new Date().toLocaleDateString(),
        children: [
            <text.p key='description'>
                Selvage vaporware celiac fit microdosing mukbang solarpunk
                aesthetic everyday carry offal intelligentsia lo-fi normcore.
                Kinfolk ugh meh pitchfork actually. Small batch DSA edison
                bulb iceland tilde mixtape messenger bag. Pabst tumblr
                cold-pressed artisan keytar vinyl irony asymmetrical edison bulb.
            </text.p>,
            <box.div actions key='actions'>
                <Button priority='primary'>Submit</Button>
                <Button>Cancel</Button>
            </box.div>
        ]
    },
}

