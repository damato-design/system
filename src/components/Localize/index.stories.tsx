import type { Meta, StoryObj } from '@storybook/react'

import { localize, IDREF, IdRefKeys } from '.';

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
 * 
 * You may also set the `aria-label` as a fallback. The `aria-labelledby`
 * will override the `aria-label` if an `IDREF` reference was rendered.
 * 
 * Important to know that the `<Close/>` button already provides the correct
 * configuration shown below. One only needs to add the localized text for the
 * `<localize.close/>` element. For more information on this component, see the
 * [Close docs](/docs/primitives-close--docs).
 */
export const Default: Story = {
    args: {
        children: 'cerca',
    },
    render: (args) => {
        return (
            <div lang='es'>
                <Button
                    aria-labelledby={ IDREF.close }
                    aria-label='close'
                    icon='close' />
                <localize.close { ...args }/>
            </div>
        )
    }
}

/**
 * If you have a dictionary of translation that can match the lookup
 * provided by the `IDREF`, you can do the following to render all of
 * the translated content.
 * 
 * ```jsx
 * function Translate(lang, DICTIONARY) {
 *  <div lang={ lang }>
 *      { Object.keys(IDREF).map((key) => {
 *          const Localize = localize[key as IdRefKeys];
 *          return <Localize>{ DICTIONARY[key] }</Localize>
 *      }) }
 *  </div>
 * }
 * ```
 * 
 * `idRefKeys` is an exported type from `localize` that represents the
 * available keys found in `IDREF` for typing.
 */
export const Batch: Story = {
    parameters: {
        docs: {
            story: {
                height: 0
            }
        }
    },
    args: {
        children: ''
    },
    render: (args: _) => {
        const DICTIONARY: { [key: string]: string } = {
            close: 'cerca',
            previous: 'previa',
            next: 'próxima'
        };

        return (
            <div lang='es'>
                { Object.keys(IDREF).map((key) => {
                    const Localize = localize[key as IdRefKeys];
                    return <Localize key={ key }>{ DICTIONARY[key] }</Localize>
                }) }
            </div>
        )
    }
}

