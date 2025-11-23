import { useCallback, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import checklist from './checklist.md?raw';

import { Calendar, type CalendarProps } from '.';
import { Pagination, ItemsProps } from '../Pagination';
import { box } from '../Box';

function getThisMonth() {
    const d = new Date();
    return [d.getFullYear(), d.getMonth() + 1].join('-');
}

/**
 * The `<Calendar/>` component creates a calendar page based on the `value`
 * provided.
 */
const meta = {
    title: 'Components/Calendar',
    component: Calendar,
    parameters: {
        checklist
    }
} satisfies Meta<CalendarProps>

export default meta
type Story = StoryObj<typeof meta>

/**
 * The `value` is expected to be a string in the format `YYYY-MM-DD`, though
 * the month and day values can also accept a single digit. The month is 1-indexed.
 * (ie., January = `1`)
 * 
 * You can provide several different kinds of `value`:
 * - `YYYY-MM-DD` will set the calendar page as `YYYY-MM` and the selected date as `DD`.
 * - `YYYY-MM` will set the calendar page with no date selected.
 * - `YYYY` will set the calendar page of the provided year, but the user's current month.
 * - No value will set the calendar page to the user's current year and month.
 * 
 * The `onActiveDescendantChange` callback is required and will return a
 * `value`-like result. Internal logic will ensure that anything provided as an
 * `activeDescendant` will result in a valid result within the current page `value`.
 * 
 * Today's date is indicated with an underline.
 */
export const Default: Story = {
    args: {
        value: getThisMonth(),
        onActiveDescendantChange: () => {}
    },
    render: (args) => {
        const [activeDescendant, onActiveDescendantChange] = useState(args.value);
        const [val, setVal] = useState(args.value);
        return <Calendar
            { ...args }
            value={ val }
            onConfirm={ setVal }
            activeDescendant={ activeDescendant }
            onActiveDescendantChange={ onActiveDescendantChange }/>
    }
};

function makePages(value: string, offset: number) {
    const [y, m] = value.split('-').map(Number);
    const d = new Date(Date.UTC(y, m - 1, 15));
    // Set to prior month before computing months
    d.setUTCMonth((d.getUTCMonth() - offset) - 1);
    return Array.from({ length: 12 }, () => {
        d.setUTCMonth(d.getUTCMonth() + 1);
        const children = d.toLocaleString(navigator.language, { month: 'long', year: 'numeric' });
        const value = [d.getUTCFullYear(), d.getUTCMonth() + 1].join('-');
        return { id: `page-${value}`, children, value };
    });
}

/**
 * The `<Pagination/>` component can be composed with the `<Calendar/>`.
 * The logic to connect these is non-trivial. The `items` expected for
 * the `<Pagination/>` is especially challenging to compose. Please see
 * the source for this story (link at the bottom of this page)
 * to review the internal wiring for this story.
 * 
 * > #### Why is this example so complex?
 * >
 * > The list of months should be practically infinite but we restrict the amount
 * > in the list for usability. So the current page exists in the _middle_ of the list,
 * > instead of at the top. This allows a user to go back or forward several months
 * > using a single click in the menu. To do this, the list needs to update with
 * > every page change and the start of the list needs to be offset.
 * >
 * > Here's the function that creates the `items` for the `<Pagination/>` where `offset`
 * > is the 0-indexed position of the selected month in the list.
 * >
 * > ```ts
 * > function makePages(value: string, offset: number) {
 * >    const [y, m] = value.split('-').map(Number);
 * >    const d = new Date(Date.UTC(y, m - 1, 15));
 * >    // Set to prior month before computing months
 * >    d.setUTCMonth((d.getUTCMonth() - offset) - 1);
 * >    return Array.from({ length: 12 }, () => {
 * >        d.setUTCMonth(d.getUTCMonth() + 1);
 * >        const children = d.toLocaleString(navigator.language, { month: 'long', year: 'numeric' });
 * >        const value = [d.getUTCFullYear(), d.getUTCMonth() + 1].join('-');
 * >        return { id: `page-${value}`, children, value };
 * >    });
 * > }
 * > ```
 */
export const Paginate: Story = {
    parameters: {
        docs: {
            story: {
                inline: false,
                iframeHeight: 760,
            },
        },
    },
    args: {
        value: getThisMonth(),
        onActiveDescendantChange: () => {}
    },
    render: (args) => {
        const MID_INDEX = 5;
        
        const [activeDescendant, onActiveDescendantChange] = useState(args.value);
        const [pageDate, setPageDate] = useState(args.value!);
        const [val, setVal] = useState(args.value!);
        const pages = makePages(pageDate, MID_INDEX);
        const page = pages[MID_INDEX];

        const onPageChange = useCallback((id: string) => {
            const { value } = pages.find((item) => item.id === id) || args;
            setPageDate(value!);
        }, [pageDate]);

        return (
            <box.div stack gap>
                <Pagination
                    activeDescendant={page.id}
                    onActiveDescendantChange={onPageChange}
                    infill={ false }
                    items={ pages as ItemsProps }
                    index={ MID_INDEX }
                    onConfirm={ (item) => setPageDate(item.value)}>
                    { page.children }
                </Pagination>
                <Calendar
                    { ...args }
                    value={ val.includes(page.value) ? val : page.value }
                    onConfirm={ setVal }
                    activeDescendant={activeDescendant}
                    onActiveDescendantChange={ onActiveDescendantChange }/>
            </box.div>
        )
    }
}