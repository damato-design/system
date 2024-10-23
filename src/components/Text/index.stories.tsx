import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react'

import { text } from '.';
import { box } from '../Box';

/**
 * The `text` primitive helps present text content.
 * For more information on typography styles
 * please see the [Typography docs](/docs/foundations-typography--docs).
 * 
 * If you need a repeatable pattern for composing text lockups, please use the [Lockup primitive](/docs/primitives-lockup--docs).
 */
const meta = {
    title: 'Primitives/text',
    component: text.span,
} satisfies Meta<typeof text.span>

export default meta
type Story = StoryObj<typeof meta>

/**
 * The dot-notation allows you to render the specific HTML element expected to render in the page. `<text.span/>` will render a `<span/>` element with the additional enhancements this component offers.
 * 
 * The default `priority` for this component is `'secondary'` meant to represent body copy. You should avoid explicitly setting this priority and allow the default to be applied.
 */
export const Default: Story = {
    args: {
        children: 'Hello World!',
    }
}

/**
 * You can set the priority of the `text` component to indicate its importance in the composition. In this example, the `priority='primary'` conveys the concept of a headline.
 */
export const Priority: Story = {
    args: {
        children: 'Whereas disregard and contempt for human rights have resulted',
        priority: 'primary'
    },
    render: (args) => <text.h2 { ...args } />
}

/**
 * When a child `text` component is included inside a parent `text` component without a set `priority`, the child component will inherit the parent's `priority` value.
 */
export const Inheritance: Story = {
    args: { 
        priority: 'auxiliary'
    },
    render: (args) => (
        <text.p { ...args }>
            The quick brown fox <text.a href='#'>jumps over</text.a> the lazy dog.
        </text.p>
    )
}

/**
 * A `text` component can be configured to make its content invisible and only accessible to screen reading technology by using the `getScreenreaderProps()` callback.
 * 
 * ```jsx
 * function ScreenreaderOnly() {
 *  const [srProps, setSrProps] = useState({});
 *      return (
 *          <>
 *              <text.label { ...srProps }>Tel:</text.label>
 *              <text.span
 *                  { ...args }
 *                  getScreenreaderProps={ setSrProps }>
 *                  Telephone Number
 *              </text.span>
 *          </>
 *      )
 * }
 * ```
 */
export const ScreenreaderOnly: Story = {
    args: {
        children: 'Hello World!',
    },
    render: (args) => {
        const [srProps, setSrProps] = useState({});
        return (
            <>
                <text.label { ...srProps }>Tel:</text.label>
                <text.span { ...args } getScreenreaderProps={ setSrProps }>Telephone Number</text.span>
            </>
        )
    }
}

/**
 * When `text` components are wrapped in a `box` with `standby={true}`, the components will display a skeleton loader. The components displaying as `priority='secondary'` will render a minimum of 3 content lines, other priorities render a single line at a percentage width of the container.
 * 
 * If content is present within the `text` component, it is invisible until the `standby` is removed from the parent.
 */
export const Loading: Story = {
    args: {},
    render: (args) => (
        <box.div stack gap standby>
            <text.h2 {...args} priority='primary'/>
            <text.p {...args}/>
            <text.span {...args} priority='auxiliary'/>
        </box.div>
    )
}
