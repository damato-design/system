import type { Meta, StoryObj } from '@storybook/react';
import checklist from './checklist.md?raw';

import { flyout, FlyoutProvider, type FlyoutProps } from '.';
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
        checklist
    },
} satisfies Meta<FlyoutProps>

export default meta
type Story = StoryObj<typeof meta>


/**
 * 
 * > #### Why doesn't this component work for me?
 * >
 * > This uses the new [CSS Anchor Positioning specification](https://www.w3.org/TR/css-anchor-position-1/)
 * which has not yet been launched in all browsers.
 * Please see the [browser compatability table at MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/anchor-name#browser_compatibility) for more information.
 * 
 * Here's the full code for the component below:
 * 
 * ```jsx
 * function FlyoutExample(args) {
 *      return (
 *          <FlyoutProvider>
 *              <Button priority='primary'>
 *              anchor element
 *              </Button>
 *              <flyout.div { ...args }>
 *              flyout is open!
 *              </flyout.div>
 *          </FlyoutProvider>
 *      )
 * }
 * ```
 *
 * The `<FlyoutProvider/>` provides context to the expected anchoring element and the contents of the flyout. If a button is a direct child of the `<FlyoutProvider/>` it becomes the anchor and toggles the flyout through the [Invoker Commands API](https://developer.mozilla.org/en-US/docs/Web/API/Invoker_Commands_API) — no state or click handler required. In this way the connection between the anchor and flyout is inferred by the composition.
 */
export const Default: Story = {
    args: {
        children: 'Hello World!',
    },
    render: (args) => {
        return (
            <FlyoutProvider>
                <Button priority='primary'>
                anchor element
                </Button>
                <flyout.div { ...args }>
                flyout is open!
                </flyout.div>
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
        return (
            <FlyoutProvider>
                <Button priority='primary'>
                    anchor element
                </Button>
                <flyout.div { ...args }>
                    <box.div
                        stretch={ args.stretch }
                        padding
                        purpose='surface'
                        priority='secondary'>
                        Hi! 👋
                    </box.div>
                </flyout.div>
            </FlyoutProvider>
        )
    }
}