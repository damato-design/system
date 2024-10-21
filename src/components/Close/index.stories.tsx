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
 * In order to get the component to work properly, use `purpose='surface'`
 * to apply containment configuration to keep the button connected.
 * 
 * > #### What is the connection between a surface and the button?
 * >
 * > The `<Close/>` button ships as absolutely positioned so we need to have a
 * > standard way of assigning where it is positioned against. It is
 * > reasonable that only surfaces can be dismissed, so we have tied the
 * > concept of a surface to one that is meant to contain layout; using
 * > CSS `contain: layout;`.
 * 
 * Then the element is placed as the first element where we expect
 * text to collide. In the example below, we expect text to collide
 * with the content of the `<text.h2/>`, so the element is the first child there.
 * 
 * By default, the `float` is set to `true` which allows the text to wrap.
 * 
 * This is a minimum example for demonstration. For a more common composition,
 * review the [Lockup docs](/docs/primitives-lockup--docs).
 */
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

/**
 * If the button is meant to appear on top of content,
 * as in the case of `Media`, set `float` as `false` to pin
 * the button to the corner.
 * 
 * Consider the order of the elements. If the `<Close/>` is first,
 * assistive technology will find it first before other content.
 * This allows the user to know the area they are currently in
 * can be dismissed.
 */
export const MediaUse: Story = {
    args: { float: false },
    render: (args) => {
        return (
            <box.div contain='paint' stack purpose='surface' padding>
                <Close { ...args }/>
                <Media src='https://loremflickr.com/1280/720'/>
            </box.div>
        )
    }
}
