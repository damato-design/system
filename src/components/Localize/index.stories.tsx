import type { Meta, StoryObj } from '@storybook/react'

import { localize, IDREF } from '.';

import { Button } from '../Button';

/**
 * The `localize` primitive helps localize labels
 * that are commonly shared across the experience.
 */
const meta = {
    title: 'Primitives/localize',
    component: localize.close,
} satisfies Meta<typeof localize.close>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Import the `IDREF` constant which holds a list of keys which require
 * translations. This should be place on every page in the experience
 * so that elements that reference these labels can be properly translated
 * for assistive technologies.
 * 
 * ```jsx
 * // Import the resources
 * const { localize, IDREF } from '@components/localize';
 * 
 * // Attach the appropriate `IDREF` to the element using `aria-labelledby`
 * <Button aria-labelledby={ IDREF.close } icon='close' />
 * 
 * // Add the related `localize` element at the root of the page with the translation.
 * <localize.close>{ TRANSLATED }</localize.close>
 * ```
 * 
 * It is not uncommon for the use of the `localize` fragment to not appear
 * in the same file that the `IDREF` key is attached.
 */
export const Default: Story = {
    args: {
        children: 'cerca',
    },
    render: (args) => {
        return (
            <div lang='es'>
                <Button aria-labelledby={ IDREF.close } icon='close' />
                <localize.close { ...args }/>
            </div>
        )
    }
}

