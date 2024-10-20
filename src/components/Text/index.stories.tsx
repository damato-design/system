import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react'

import { text } from '.';

/**
 * The `text` primitive helps present text content.
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
 * 
 * > #### Why is the text so small?
 * >
 * > The default size is the smallest size meant to be accessible.
 * > This is so all other sizes are larger and therefore also accessible.
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
export const Priority: Story = {
    args: {
        children: 'Hello World!',
        priority: 'primary'
    },
    render: (args) => <text.h2 { ...args } />
}

/**
 * The `getScreenreaderProps` callback returns accessibility props
 * that should be attached to another element which requires more
 * descriptive text. When this function is used, the element is invisible
 * but within the document.
 */
export const ScreenreaderOnly: Story = {
    args: {
        children: 'Hello World!',
    },
    render: (args) => {
        const [srProps, setSrProps] = useState({});
        return (
            <>
                <text.label { ...srProps } priority='secondary'>Tel:</text.label>
                <text.span { ...args } getScreenreaderProps={ setSrProps }>Telephone Number</text.span>
            </>
        )
    }
}