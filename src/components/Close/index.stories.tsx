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

/**
 * By itself, the `<Close/>` button is not useful
 * without additional placement and context.
 */
export const Default: Story = {
    args: {
        float: false
    }
}

/**
 * When using with a composition that primarily uses text, place the
 * `<Close/>` button within the first-most element that positions the text.
 * This will allow the content to wrap around the button so it does not
 * interfere with readability or interactivity.
 */
export const ContentUse: Story = {
    args: {},
    render: (args) => {
        return (
            <box.div stack gap purpose='surface' padding>
                <text.h2 priority='primary'>
                    <Close { ...args }/>
                    Pok pok raw swag food trucks next level man bun palo santo as a bird on it green juice drink yeah
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

/**
 * When the `<Close/>` button is expected to be placed with `<Media/>`,
 * then it should be presented visually above the element. This is done
 * by setting `float={ false }`.
 */
export const MediaUse: Story = {
    parameters: {
        docs: {
            story: {
                inline: false,
                iframeHeight: 460,
            },
        },
    },
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
