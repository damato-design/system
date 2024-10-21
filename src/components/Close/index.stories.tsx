import type { Meta, StoryObj } from '@storybook/react'

import { Close } from '.';
import { box } from '../Box';
import { text } from '../Text';
import { Media } from '../Media';

/**
 * The main objective of this component is to allow text to wrap
 * around the button, so no collisions occur making the button
 * hard to use or text difficult to read.
 */
const meta = {
    title: 'Primitives/Close',
    component: Close,
} satisfies Meta<typeof Close>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: {},
    render: (args) => {
        return (
            <box.div stack prose purpose='surface' padding>
                <text.h2 priority='primary'>
                    <Close { ...args }/>
                    Pok pok raw swag food truck next level man bun palo santo put a bird on it green juice
                </text.h2>
                <text.p>
                    Schlitz hot chicken fam keytar,
                    tote bag twee fingerstache dreamcatcher
                    organic meh man braid cold-pressed.
                    Copper mug selfies kombucha, pour-over semiotics
                    hot chicken grailed taiyaki waistcoat hashtag paleo.
                    Vinyl glossier VHS, franzen health goth PBR&B truffaut.
                    Squid scenester lo-fi DIY sartorial shaman keffiyeh
                    retro fingerstache copper mug pork belly heirloom wolf.
                    Tofu jawn poke, taiyaki try-hard tbh neutra portland.
                </text.p>
            </box.div>
        )
    }
}

export const MediaUse: Story = {
    args: { float: false },
    render: (args) => {
        return (
            <box.div stack purpose='surface' padding>
                <Close { ...args }/>
                <Media src='https://loremflickr.com/1280/720'/>
            </box.div>
        )
    }
}
