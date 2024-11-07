import { useCallback, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { Pagination, ItemsProps, ItemProps } from '.';

function makeItems(length: number, fn: (_: any, i: number) => ItemProps) {
    return Array.from({ length }, fn) as ItemsProps;
}

/**
 * The `<Pagination/>` component is a control that allows a 
 * user to move through pages of data. It is a composition using
 * `<Menu/>` and `<Button/>`. Most of the configuration is passed
 * into the `<Menu/>`. The `activeDescendant` is managed internally.
 */
const meta = {
    title: 'Components/Pagination',
    component: Pagination,
    parameters: {
        docs: {
            story: {
                inline: false,
                iframeHeight: 360,
            },
        },
    },
} satisfies Meta<typeof Pagination>

export default meta
type Story = StoryObj<typeof meta>

function makePage(_: any, i: number) {
    return { id: `page-${i + 1}`, value: i } as ItemProps
}

/**
 * A common use-case for pagination would be to traverse pages
 * of data. The `index` prop is a 0-based positive integer representing
 * the current page. In this example, we display the current page by using
 * `index + 1`.
 */
export const Default: Story = {
    args: {
        index: 0,
        items: makeItems(4, makePage),
    },
    render: (args) => {
        const [item, setItem] = useState(args.items[args.index]);

        return (
            <Pagination
                { ...args }
                index={ item.value }
                onConfirm={ setItem }>
                { item.value + 1 }
            </Pagination>
        )
    }
}

function makeMonth(_: any, i: number) {
    const d = new Date();
    d.setMonth(i);
    const month = d.toLocaleString(undefined, { month: 'long' });
    return { 
        id: `date-${d.getFullYear()}-${d.getMonth()+1}`,
        children: `${month} ${d.getFullYear()}`,
        value: i
    } as ItemProps
}

/**
 * We can also use the `<Pagination/>` to navigate the pages
 * of a datepicker.
 * 
 * > #### How can we paginate all months?
 * >
 * > A datepicker experience shouldn't always be used for when
 * > a user is entering a date. For example, birthdays are easier
 * > to input as a series of fields. A datepicker is more appropriate
 * > for when the date is close to today. This means that the example
 * > below should provide a small range of months for the `<Menu/>`
 * > and as the selection is set, the available list of months should update
 * > so the selection is always in the middle. This will also avoid
 * > either stepper button from becoming disabled.
 * >
 * > This suggests that the `index` would never change. It would remain
 * > in the middle of the list of items, but the content of the `items`
 * > would change when the `onConfirm` is fired to adjust the options.
 */
export const Months: Story = {
    parameters: {
        docs: {
            story: {
                inline: false,
                iframeHeight: 860,
            },
        },
    },
    args: {
        index: 6,
        items: makeItems(12, makeMonth),
    },
    render: (args) => {
        const [item, setItem] = useState(args.items[args.index]);

        return (
            <Pagination
                { ...args }
                index={ item.value }
                onConfirm={ setItem }>
                { item.children }
            </Pagination>
        )
    }
}

/**
 * We can use the `<Pagination/>` to create the navigation
 * for wizard experiences. When the content for the next button is
 * provided using the `cta` prop, the button will present itself as
 * `primary`.
 * 
 * When the `cta` is used the `<Button/>` will not be disabled when
 * the user reaches the end. When the user hits the end, `onConfirm`
 * send a `null` response. Check the console for an example as you
 * use the next button.
 * 
 * > #### How could I restrict the available pages?
 * >
 * > It might not be appropriate to provide a list of all pages
 * > at once, requiring the user complete a section before continuing.
 * > This means the list should be provided as a subset of the total.
 * > And a new set of `items` can be provided as pages are completed.
 */
export const Wizard: Story = {
    args: {
        index: 0,
        items: makeItems(4, makePage),
        cta: 'Next'
    },
    render: (args) => {
        const [item, setItem] = useState(args.items[args.index]);

        const onConfirm = useCallback((update: any) => {
            if (!update) return console.log('Done!');
            setItem(update);
        }, []);

        return (
            <Pagination
                { ...args }
                index={ item.value }
                onConfirm={ onConfirm }>
                { item.value + 1 }
            </Pagination>
        )
    }
}