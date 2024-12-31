import type { Meta, StoryObj } from '@storybook/react'

import { box } from '.';
import { text } from '../Text';

/**
 * The `box` primitive is meant to be the basis for compositions,
 * specially meant to help with layout needs.
 * 
 * You can create different kinds of HTML elements by using the dot-notation.
 * Example: `<box.main/>` will create a `<main/>` element with additional enhancements.
 */
const meta = {
    title: 'Primitives/box',
    component: box.div,
} satisfies Meta<typeof box.div>

export default meta
type Story = StoryObj<typeof meta>

/**
 * The `box` can be thought of as a "superdiv" that defaults to displaying
 * itself using `inline-flex`.
 */
export const Default: Story = {
    args: {
        children: 'Content within the box'
    },
    render: (args) => <box.main { ...args }/>
}

/**
 * When using the `stretch` flag, this changes the display to `flex`
 * which fills the parent's width. This also demonstrates the `gap` flag
 * which adds space between the child elements.
 */
export const Stretch: Story = {
    args: {
        stretch: true,
        gap: true,
        children: [
            <box.span key={ '1' }>Item 1</box.span>,
            <box.span key={ '2' }>Item 2</box.span>,
            <box.span key={ '3' }>Item 3</box.span>
        ]
    }
}

/**
 * Similar to the default settings for `flex`, the default arrangement
 * for children is in a single row. To stack the child elements, use
 * the `stack` flag.
 */
export const Stack: Story = {
    args: {
        stack: true,
        gap: true,
        children: [
            <box.span key={ '1' }>Item 1</box.span>,
            <box.span key={ '2' }>Item 2</box.span>,
            <box.span key={ '3' }>Item 3</box.span>
        ]
    }
}

/**
 * Alignment works with a slightly different mental modal from
 * the traditional flexbox interface.
 * 
 * The `placeChildren` prop determines how the inner children
 * of the `box` are positioned. This can accept a `String`different
 * options which will apply the position to the children
 * in both the horizontal and vertical directions.
 * 
 * Unlike flexbox, changing the orientation using `stack` will not require
 * these values to also be changed.
 * 
 * If you need to justify the content in a more specific way, the `distribute` prop
 * can accept values such as `'between'`, `'around'`, and `'evenly'` which
 * describe how the elements will bee arranged with the available space. This will
 * override some alignment values if provided either directly.
 * 
 * In the case where using logical properties such as `'start'` and `'end'` is
 * inappropriate, you can opt-out of this behavior. This is helpful for layouts
 * where flipping the content is not expected, such as displaying a duration of time.
 * 
 * ```jsx
 * <box.div logical={ false } placeChildren='top-left' />
 * ```
 * 
 * The `placeSelf` prop works like `placeChildren`, except it affects the alignment
 * of the `box` itself when placed within another `box`.
 */
export const Alignment: Story = {
    args: {
        stretch: true,
        placeChildren: 'center',
        children: <box.span>Centered in the box</box.span>
    }
}

/**
 * You can use the `standby` flag to present certain components within
 * the `box` in a loading state.
 */
export const Standby: Story = {
    args: {
        standby: true,
        stack: true,
        gap: true,
        children: [
            <text.h2 priority='primary' key={ 'heading' }/>,
            <text.p key={ 'paragraph' }/>,
            <text.span priority='auxiliary' key={ 'detail' }/>
        ]
    }
}

/**
 * Since this component is the basis for many other components,
 * these more specific components usually have set configuration of their `box`
 * for presentational purposes. This example is the simple configuration that
 * creates the `field` primitive, among other settings.
 * 
 * Best practice is to use the specific component made for the purpose.
 * In this case, refer to the [Field docs](/docs/primitives-field--docs).
 */
export const Purpose: Story = {
    args: {
        purpose: 'control',
        padding: true,
        children: <text.span>email@example.com</text.span>
    }
}

/**
 * Similar to `purpose`, `priority` is also encoded within the `box`
 * to present itself with levels of importance. This example demonstrates
 * the basic configuration which results in an incomplete `<Button/>` presentation.
 * 
 * Instead of attempting to provide the correct configuration, look for
 * components which offer the expectations by default. For this example,
 * refer to the [Button docs](/docs/components-button--docs).
 * 
 * > #### Why are `padding` and `gap` flags?
 * >
 * > Traditionally, spacing has been customizable in many systems due to the
 * > nuances of design. In this system, the amount of space is determined by
 * > the depth of this small part of an experience. In this way, we only need
 * > to mark that space should exist here and allow the scope to determine how
 * > much space is appropriate. For more on this approach, see the [Density docs](/docs/foundations-density--docs).
 */
export const Priority: Story = {
    args: {
        purpose: 'action',
        priority: 'primary',
        padding: true,
        children: 'Click here!'
    }
}

/**
 * To handle locally responsive needs in the style of a configurable
 * container query, use the `reflow` option. This takes an object where
 * each key is a pixel width as a number and a set of `box` props as a value.
 * When the current box width is less than or equal to a number key provided,
 * the new props given are merged with the original props. This allows for the
 * configuration to be re-rendered with new options for smaller regions.
 * 
 * In the example below, when the region is resized to `600px` or below, the
 * `box` is updated to `stack`.
 */
export const Reflow: Story = {
    args: {
        stretch: true,
        gap: true,
        children: [
            <text.span key={ 'first' }>first</text.span>,
            <text.span key={ 'middle' }>middle</text.span>,
            <text.span key={ 'last' }>last</text.span>
        ],
        reflow: {
            600: {
                stack: true
            }
        }
    }
}