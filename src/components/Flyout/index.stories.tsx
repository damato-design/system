import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react'

import { flyout } from '.';
import { Button } from '../Button';
import { box } from '../Box';

/**
 * The `flyout` primitive attaches itself to an anchor element.
 * It is effectively invisible and uses new native anchor positioning.
 */
const meta = {
    title: 'Primitives/flyout',
    component: flyout.div,
    parameters: {
        docs: {
            story: {
                inline: false,
                iframeHeight: 200,
            },
        },
    },
} satisfies Meta<typeof flyout.div>

export default meta
type Story = StoryObj<typeof meta>


/**
 * > #### Why doesn't this component work for me?
 * >
 * > This uses the new [CSS Anchor Positioning specification](https://www.w3.org/TR/css-anchor-position-1/) which has not yet been launched in all browsers. Please see the [browser compatability table at MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/anchor-name#browser_compatibility) for more information.
 */
export const Default: Story = {
    args: {
        children: 'Hello World!',
        getAnchorProps: () => {},
    },
    render: (args) => {
        const [anchorProps, setAnchorProps] = useState({});
        return (
            <>
                <Button { ...anchorProps } priority='primary'>anchor element</Button>
                <flyout.div { ...args } getAnchorProps={ setAnchorProps }>
                    flyout is open!
                </flyout.div>
            </>
        )
    }
}

export const Stretch: Story = {
    args: {
        children: 'Hello World!',
        getAnchorProps: () => {},
        stretch: true
    },
    render: (args) => {
        const [anchorProps, setAnchorProps] = useState({});
        return (
            <>
                <Button { ...anchorProps } priority='primary'>anchor element</Button>
                <flyout.div { ...args } getAnchorProps={ setAnchorProps }>
                    <box.div
                        stretch={ args.stretch }
                        padding
                        purpose='surface'
                        priority='secondary'>
                        Hi! 👋
                    </box.div>
                </flyout.div>
            </>
        )
    }
}