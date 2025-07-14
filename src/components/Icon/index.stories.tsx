import type { Meta, StoryObj } from '@storybook/react';
import checklist from './checklist.md?raw';

import { icon } from '.';
import { box } from '../Box';

/**
 * This component renders an icon using Material Icons.
 * Refer to [the list provided by Google](https://fonts.google.com/icons?icon.set=Material+Icons)
 * to determine what icons are available. You'll update the referenced name by
 * using underscores (`_`) as a replacement for spaces.
 * 
 * > #### Why use Material Icons?
 * >
 * > Creating an icon system is a signifigant level of effort; a system in and of itself.
 * > The drawback to using this set is the massive file size that supports the glyphs.
 * > In a more considerate system, we would only load the glyphs we need.
 */
const meta = {
    title: 'Primitives/icon',
    component: icon.question_answer,
    parameters: {
        checklist
    }
} satisfies Meta<typeof icon.question_answer>

export default meta
type Story = StoryObj<typeof meta>

/**
 * This example shows the [Question Answer icon](https://fonts.google.com/icons?icon.set=Material+Icons&selected=Material+Icons+Outlined:question_answer:&icon.size=24&icon.color=%23e8eaed).
 * 
 * Icons are all set as `role='presentation'` so they are ignored by screen readers.
 * This means that you should have some labelling to ensure a user can understand the context
 * meant by the icon. This is especially important for areas where only a single icon exists.
 * 
 * > #### Why does the `icon` use the `<i/>` HTML tag?
 * >
 * > This makes the element slightly more semantic than using a normal `<span/>`,
 * > conveying an "alternate voice or mood" ([MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/i)).
 */
export const Default: Story = {}

/**
 * The size of the icon is determined by the given `priority`
 * in a similar fashion to how you might configure the `text` primitive.
 * This ensures that when the icon is adjacent to text, they will share
 * the same metrics.
 */
export const Size: Story = {
    args: {
        priority: 'primary'
    }
}

/**
 * When the `icon` is found within a `standby={true}` element,
 * it will display a loading state.
 */
export const Loading: Story = {
    render: (args) => (
        <box.div standby>
            <icon.search { ...args }/>
        </box.div>
    )
}