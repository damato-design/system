import { useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react'

import { listbox } from '.';
import { box } from '../Box';
import { Button } from '../Button';
import { flyout } from '../Flyout'; 

/**
 * There are several required props and state that the component will need managed.
 * 
 * - `items` is an `Array<Object>` that represent `<Button/>` elements, 
 *    where the only required prop is `id`.
 * - `onActiveDescendantChange` is a function that will provide the `id`
 *    of the newly visually focused element from the `items`.
 * - `visualFocus` is a `boolean` that determines if the current item should be
 *   visually focused. Generally, you'll want to connect this to `onFocus` and `onBlur`
 *   toggling this between both events.
 * 
 * When the element is focused, you can navigate options using Arrow keys.
 * 
 */
const meta = {
    title: 'Primitives/listbox',
    component: listbox.div,
} satisfies Meta<typeof listbox.div>

export default meta
type Story = StoryObj<typeof meta>

/**
 * If there is no controlling element, the `listbox`
 * should toggle the `visualFocus` by wiring
 * `onFocus` and `onBlur` directly to the element.
 * 
 * ```
 * <listbox.div
 *  visualFocus={ focus }
 *  onFocus={ setFocus(true) }
 *  onBlur={ setFocus(false) } />
 * ```
 * This wiring is important to separate the focus of the controlling element
 * from the visual focus for user selection.
 * 
 * > #### Is this setup appropriate for multiple selections?
 * >
 * > The `activeDescendant` is meant to describe the
 * > visually focused element, not necessarily the selected ones.
 * > You could have a separate state to determine which items are selected
 * > by adding event listeners to the `items` config, such as `onPointerDown`
 * > and `onKeyDown`.
 */
export const Default: Story = {
    args: {
        activeDescendant: 'option2',
        onActiveDescendantChange: () => {},
        visualFocus: false,
        items: [
            { id: 'option1' },
            { id: 'option2' },
            { id: 'option3' }
        ]
    },
    render: ({ onActiveDescendantChange: _, ...args}) => {
        const [active, setActive] = useState(args.activeDescendant);
        const [focus, setFocus] = useState(args.visualFocus);
        return (
            <>
                <box.div stretch>
                    { `Active option: ${active}` }
                </box.div>
                <listbox.div
                    { ...args }
                    visualFocus={ focus }
                    onFocus={ () => setFocus(true) }
                    onBlur={ () => setFocus(false) }
                    activeDescendant={ active }
                    onActiveDescendantChange={ setActive } />
            </>
        )
    }
}

/**
 * If there is a separate element that controls the `listbox`,
 * wire the `getAnchorProps` function to a state setter to get the necessary
 * props to connect the two elements for accessibility. This provides the following:
 * 
 * - `tabIndex` is set to `0` for the element to accept focus behavior.
 * - `onPointerDown` is provided as a function to ensure that the element receives
 *   focus when it is clicked.
 * - `onKeyDown` is provided to control the `onActiveDescendantChange`.
 * 
 * If you have other props that conflict with these on the controlling element,
 * you'll want to ensure that these are called along with your own. Also note that
 * setting `tabIndex` should _always_ be avoided.
 * 
 * You'll also want to toggle `visualFocus` on the controlling element.
 * 
 * In this example, we set `behavior='menu'` which removes the checkmarks.
 * 
 * > #### Why is there a difference in presentation between different behaviors?
 * >
 * > The expectation is that a **menu** is meant for actions to take place; ie.,
 * > the way a right-click context menu would work. You trigger the menu,
 * > choose the option, and move on. A **listbox** allows for selection, similar
 * > to how a native HTML `<select/>` would work, except all of the options
 * > are readily visible. This means we need to display the chosen item even
 * > when not interacting with the element.
 * 
 * You can consider additional behaviors such as closing the menu on click,
 * by adding a `onClick` method each item in the `items` and unmounting the `flyout`
 * with some additional state. You could also toggle the menu on focus and blur.
 */
export const Menu: Story = {
    args: {
        activeDescendant: 'option2',
        onActiveDescendantChange: () => {},
        behavior: 'menu',
        visualFocus: false,
        items: [
            { id: 'option1' },
            { id: 'option2' },
            { id: 'option3' }
        ]
    },
    render: ({ onActiveDescendantChange: _, ...args}) => {
        const [buttonProps, setButtonProps] = useState({});
        const [anchorProps, setAnchorProps] = useState({});
        const [active, setActive] = useState(args.activeDescendant);
        const [focus, setFocus] = useState(args.visualFocus);
        const anchorRef = useRef(null);

        const menu = (
            <flyout.div getAnchorProps={ setAnchorProps } stretch>
                <box.div
                    stretch
                    purpose='surface'
                    priority='secondary'>
                    <listbox.div
                        { ...args }
                        getAnchorProps={ setButtonProps }
                        visualFocus={ focus }
                        activeDescendant={ active }
                        onActiveDescendantChange={ setActive } />
                </box.div>
            </flyout.div>
        )

        return (
            <>
                <Button
                    { ...buttonProps }
                    { ...anchorProps }
                    ref={ anchorRef }
                    onFocus={ () => setFocus(true) }
                    onBlur={ () => setFocus(false) }
                    behavior='menu'
                    priority='primary'>
                    { active }
                </Button>
                { menu }
            </>
        )
    }
}
