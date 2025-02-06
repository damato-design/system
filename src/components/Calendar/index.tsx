import { forwardRef, useCallback, useState } from 'react';
import css from './styles.module.scss';
import {
    getDate,
    getOffset,
    getFormatter,
    getString,
    getTodayString,
    getDays,
    getWeeks,
    getActiveDescendant
} from './getters';
import { Button } from '../Button';
import { text } from '../Text';

type CalendarProps = {
    value?: string,
    onConfirm?: (value: string) => void,
    activeDescendant?: string,
    onActiveDescendantChange: (value: string) => void
}

/**
 * Determines the writing mode based on matching :dir selector
 * 
 * @param {Event} ev - Event object
 * @returns {Boolean} - Determines if the context is LTR
 */
function isLTR(ev: any) {
    return (ev.target as HTMLElement).matches(':dir(ltr)');
}

type KeyNavigation = {
    [key: string]: (ev: any, y: number, m: number, d: number) => string,
}

const KEY_NAVIGATION = {
    ArrowUp: (_, y, m, d) => getString(y, m, d - 7),
    ArrowDown: (_, y, m, d) => getString(y, m, d + 7),
    ArrowLeft: (ev, y, m, d) => isLTR(ev) ? getString(y, m, d - 1) : getString(y, m, d + 1),
    ArrowRight: (ev, y, m, d) => isLTR(ev) ? getString(y, m, d + 1) : getString(y, m, d - 1),
    PageUp: (ev, y, m, d) => ev.shiftKey ? getString(y - 1, m, d) : getString(y, m - 1, d),
    PageDown: (ev, y, m, d) => ev.shiftKey ? getString(y + 1, m, d) : getString(y, m + 1, d),
} as KeyNavigation

/**
 * Creates a `<Th/>` child component for calendar
 * 
 * @param {Object} props - Component configuration object
 * @returns {ReactElement} - A child component
 */
function Th({ narrow, long }: any) {
    return (
        <th role='columnheader' className={ css.th }>
            <text.span aria-hidden='true'>{ narrow }</text.span>
            <text.span screenreaderOnly>{ long }</text.span>
        </th>
    )
}

/**
 * Creates a `<Header/>` child component for calendar
 * 
 * @param {Object} props - Component configuration object
 * @returns {ReactElement} - A child component
 */
function Header({ year, month }: any) {

    // Determine the first day of the week based on locale
    const day1 = getDate(year, month - 1, 1);
    const offset = getOffset(day1);
    day1.setUTCDate(day1.getUTCDate() - offset);

    // Create formatters
    const narrowFormatter = getFormatter({ weekday: 'narrow' });
    const longFormatter = getFormatter({ weekday: 'long' });

    // Generate header row values
    const cells = Array.from({ length: 7 }, () => {
        const values = {
            narrow: narrowFormatter.format(day1),
            long: longFormatter.format(day1)
        };
        day1.setUTCDate(day1.getUTCDate() + 1);
        return values;
    });

    return (
        <thead role='rowgroup'>
            <tr role='row'>
                { cells.map((cell, idx) => (
                    <Th { ...cell } key={ idx } />
                )) }
            </tr>
        </thead>
    )
}

/**
 * Creates a `<DateButton/>` child component for calendar
 * 
 * @param {Object} props - Component configuration object
 * @returns {ReactElement} - A child component
 */
function DateButton({ 
    date,
    month,
    year,
    day,
    onConfirm,
    formatter,
    activeDescendant,
    onActiveDescendantChange,
    shouldFocus,
    setShouldFocus
    }: any) {
    const value = getString(year, month, date);
    const d = getDate(year, month, date);
    const isSelected = day === date;

    // On date click, change selection and active descendent
    const onClick = useCallback(() => {
        typeof onActiveDescendantChange === 'function' && onActiveDescendantChange(value);
        typeof onConfirm === 'function' && onConfirm(value);
    }, [value, onConfirm, onActiveDescendantChange]);

    // On date keydown, change active descendent
    const onKeyDown = useCallback((ev: any) => {
        if (!(ev.key in KEY_NAVIGATION)) return;
        ev.preventDefault();
        const update = KEY_NAVIGATION[ev.key](ev, year, month, date);
        typeof onActiveDescendantChange === 'function' && onActiveDescendantChange(update);
    }, [activeDescendant, onActiveDescendantChange, value]);

    // If this is meant to be the active descendent, focus the button
    const onRef = useCallback(($btn: any) => {
        shouldFocus && activeDescendant === value && $btn?.focus();
    }, [activeDescendant, value]);

    return (
        <Button
            aria-current={ getTodayString() === value ? 'date' : undefined }
            aria-label={ formatter.format(d) }
            aria-selected={ isSelected }
            tabIndex={ activeDescendant === value ? 0 : -1 }
            onClick={ onClick }
            onKeyDown={ onKeyDown }
            ref={ onRef }
            onFocus={() => setShouldFocus(true)}
            onBlur={() => setShouldFocus(false)}
            square>
            { date }
        </Button>
    );
}

/**
 * Creates a `<Row/>` child component for calendar
 * 
 * @param {Object} props - Component configuration object
 * @returns {ReactElement} - A child component
 */
function Row({ week, ...rest }: any) {
    return (
        <tr role='row'>
            { week.map((date: number, idx: number) => (
                <td
                    className={ css.td }
                    role={ date ? 'gridcell' : undefined }
                    key={ idx }>
                    { date ? <DateButton { ...rest } date={ date }/> : null }
                </td>
            )) }
        </tr>
    )
}

/**
 * Creates a `<Body/>` child component for calendar
 * 
 * @param {Object} props - Component configuration object
 * @returns {ReactElement} - A child component
 */
function Body({ year, month, ...rest }: any) {

    const [shouldFocus, setShouldFocus] = useState(false);

    const days = getDays(year, month);
    const day1 = getDate(year, month - 1, 1);
    const offset = getOffset(day1);
    const matrix = getWeeks(days, offset);
    const formatter = getFormatter({ dateStyle: 'long' });

    return (
        <tbody role='rowgroup'>
           { matrix.map((week: number[], idx: number) => (
                <Row
                    { ...rest }
                    {...{ week, month, year, formatter, shouldFocus, setShouldFocus }}
                    key={ idx } />
           )) }
        </tbody>
    )
}

/**
 * Creates a `<Calendar/>` component
 * 
 * @param {CalendarProps} props - Component configuration object
 * @returns {ReactElement} - A calendar component
 */
export const Calendar = forwardRef<HTMLTableElement, CalendarProps>(({
    value,
    onConfirm,
    activeDescendant: active,
    onActiveDescendantChange,
    ...rest
}: CalendarProps, ref) => {

    // Create a date if a complete one was not provided
    const d = new Date();
    const [year, month, day] = typeof value === 'string'
        ? value.split('-').map(Number)
        : [d.getFullYear(), d.getMonth() + 1];

    const activeDescendant = getActiveDescendant(getString(year, month, day), active);

    return (
        <table { ...rest } ref={ ref } className={ css.table } role='grid'>
            <Header { ...{ year, month, day } }/>
            <Body { ...{ year, month, day, onConfirm, activeDescendant, onActiveDescendantChange } }/>
        </table>
    );
});