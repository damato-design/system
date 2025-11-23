import type { Meta, StoryObj } from '@storybook/react';
import checklist from './checklist.md?raw';

import { card, type CardProps } from '.';
import { text } from '../Text';
import { box } from '../Box';
import { Button } from '../Button';
import { Close } from '../Close';

/**
 * The card component represents an entity as an informative visual.
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
        checklist
    },
} satisfies Meta<CardProps>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Using the `src` prop will engage the internal `<Media/>` element to display
 * images or video as the central focus.
 * You can create a padded version by setting the `padding` flag.
 * Otherwise media will be presented as full-bleed.
 */
export const Default: Story = {
    args: {
        src: '/wireframe-still.jpg',
        padding: true,
        purpose: 'surface'
    }
}

/**
 * The rest of the component is composed similarly to `lockup`,
 * allowing for many different presentations of content.
 */
export const Full: Story = {
    args: {
        src: '/wireframe-still.jpg',
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
            <box.div infill key='actions'>
                <Button priority='primary' stretch>Submit</Button>
                <Button stretch>Cancel</Button>
            </box.div>
        ]
    },
}

