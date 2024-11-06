import { useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react'

import { listbox, ListboxProvider } from '.';
import { box } from '../Box';
import { Button } from '../Button';
import { flyout, FlyoutProvider } from '../Flyout'; 

/**
 * The `listbox` primitive helps a user select from a list of
 * options that will immediately execute the given action.
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
 * This example shows a basic composition for the component.
 * There are two states to manage, the `activeDescendant` which
 * indicates the currently chosen item and the `visualFocus` which
 * indicates if the user is currently navigating within the component.
 * 
 * If you'd need additional listeners to determine when a specific item
 * is clicked, an `onClick` listener can be added to the object in the `items`
 * array as this represents the props for the `<Button/>`.
 */
export const Default: Story = {
    args: {
        activeDescendant: 'option2',
        onActiveDescendantChange: () => {},
        visualFocus: false,
        items: [
            { id: 'option1', value: 'option1' },
            { id: 'option2', value: 'option2' },
            { id: 'option3', value: 'option3' }
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
 * The following demonstrates how to wire the `listbox` to other components
 * to create a complete menu experience.
 */
export const Menu: Story = {
    parameters: {
        docs: {
            story: {
                inline: false,
                iframeHeight: 360,
            },
        },
    },
    args: {
        activeDescendant: 'option2',
        onActiveDescendantChange: () => {},
        behavior: 'menu',
        visualFocus: false,
        items: [
            { id: 'option1', value: 'option1' },
            { id: 'option2', value: 'option2' },
            { id: 'option3', value: 'option3' }
        ]
    },
    render: ({ onActiveDescendantChange: _, ...args}) => {
        const [active, setActive] = useState(args.activeDescendant);
        const [focus, setFocus] = useState(args.visualFocus);
        const [show, setShow] = useState(false);
        const anchorRef = useRef(null);

        const anchor = (
            <Button
                ref={ anchorRef }
                onFocus={ () => setFocus(true) }
                onBlur={ () => setFocus(false) }
                onClick={ () => setShow(!show) }
                behavior='menu'
                priority='primary'>
                { active }
            </Button>
        );
        
        const menu = (
            <flyout.div
                behavior='menu'
                onClose={ () => setShow(false) }
                stretch>
                <box.div
                    stretch
                    purpose='surface'
                    priority='secondary'>
                    <listbox.div
                        { ...args }
                        visualFocus={ focus }
                        activeDescendant={ active }
                        onActiveDescendantChange={ setActive } />
                </box.div>
            </flyout.div>
        )

        return (
            <FlyoutProvider>
                <ListboxProvider>
                    { anchor }
                    { show ? menu : null }
                </ListboxProvider>
            </FlyoutProvider>
        )
    }
}
