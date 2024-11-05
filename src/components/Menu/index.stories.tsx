import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { Menu } from '.';

/**
 * The `<Menu/>` component is primarily composed
 * of the `listbox` and `<Button/>` elements. For a more
 * in-depth structure, please see the [Listbox docs](/docs/primitives-listbox--docs).
 */
const meta = {
    title: 'Components/Menu',
    component: Menu,
    parameters: {
        docs: {
            story: {
                inline: false,
                iframeHeight: 360,
            },
        },
    },
} satisfies Meta<typeof Menu>

export default meta
type Story = StoryObj<typeof meta>

/**
 * The user will need to wire the `activeDescendant` and
 * `onActiveDescendantChange` props to state for the component
 * to behave properly. The `items` array is required.
 */
export const Default: Story = {
    args: {
        children: 'Menu',
        activeDescendant: 'option2',
        onActiveDescendantChange: () => {},
        items: [
            { id: 'option1' },
            { id: 'option2' },
            { id: 'option3' }
        ]
    },
    render: ({ onActiveDescendantChange: _, ...args}) => {
        const [active, setActive] = useState(args.activeDescendant);

        return (
            <Menu
                { ...args }
                activeDescendant={ active }
                onActiveDescendantChange={ setActive }/>
        )
    }
}