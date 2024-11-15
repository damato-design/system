import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react'

import { flyout, FlyoutProvider } from '.';
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
 * 
 * > #### Why doesn't this component work for me?
 * >
 * > This uses the new [CSS Anchor Positioning specification](https://www.w3.org/TR/css-anchor-position-1/)
 * which has not yet been launched in all browsers.
 * Please see the [browser compatability table at MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/anchor-name#browser_compatibility) for more information.
 */
export const Default: Story = {
    args: {
        children: 'Hello World!',
    },
    render: (args) => {
        const [show, setShow] = useState(false);
        const popover = (
            <flyout.div
                { ...args }
                onClose={ () => setShow(false) }>
                flyout is open!
            </flyout.div>
        )

        return (
            <FlyoutProvider>
                <Button
                priority='primary'
                onClick={ () => setShow(!show) }>
                anchor element
                </Button>
                { show ? popover : null }
            </FlyoutProvider>
        )
    }
}

/**
 * The `stretch` flag will allow the `flyout` to match the width of its anchor
 * at a minimum.
 * 
 * The contents of a `flyout` should very often include a `box`-like element
 * with a `purpose='surface'` and a `priority='secondary'`
 * 
 * > #### Why isn't the `flyout` a `box` itself?
 * >
 * > It is possible that there might be other uses for the `flyout` that
 * > aren't precisely a surface with this specific priority. Keeping these
 * > separate will allow for further composition explorations to happen.
 */
export const Stretch: Story = {
    args: {
        children: 'Hello World!',
        stretch: true
    },
    render: (args) => {
        const [show, setShow] = useState(false);

        const popover = (
            <flyout.div
                { ...args }
                onClose={ () => setShow(false) }>
                <box.div
                    stretch={ args.stretch }
                    padding
                    purpose='surface'
                    priority='secondary'>
                    Hi! 👋
                </box.div>
            </flyout.div>
        );

        return (
            <FlyoutProvider>
                <Button
                    onClick={() => setShow(!show)}
                    priority='primary'>
                    anchor element
                </Button>
                { show ? popover : null }
            </FlyoutProvider>
        )
    }
}