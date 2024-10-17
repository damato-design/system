import type { Meta, StoryObj } from '@storybook/react'

import { text } from '.';
import { useRef } from 'react';

/**
 * Description here
 */
const meta = {
    title: 'Primitives/text',
    component: text.span,
} satisfies Meta<typeof text.span>

export default meta
type Story = StoryObj<typeof meta>

/**
 * By default the component will display the text provided.
 * The children should only be of type `String` or type `Number`.
 * If you expect a more complex composition of elements,
 * consider using the `<box/>` primitive.
 */
export const Default: Story = {
    args: {
        children: 'Hello World!',
    }
}

/**
 * The `priority='primary'` option indicates the most important text within the region.
 * This should be most commonly used with higher HTML headings.
 * 
 * The `priority` only affects the presentation of the text, to help inform the document outline
 * be sure to use the most appropriate semantic HTML element.
 */
export const Primary: Story = {
    args: {
        children: 'Hello World!',
        priority: 'primary'
    },
    render: (args) => <text.h2 { ...args } />
}

/**
 * The `screenreaderOnly` option expects the `id` of the element it is meant to provide detail about.
 * This could be helpful when space is limited and assistive technologies would benefit from more information.
 */
export const ScreenreaderOnly: Story = {
    args: {
        children: 'Hello World!',
    },
    render: (args) => {
        const ref = useRef(null);
        return (
            <>
                <text.label ref={ ref }>Tel:</text.label>
                <text.span { ...args } screenreaderOnly={ ref }>Telephone Number</text.span>
            </>
        )
    }
}