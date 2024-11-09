import { forwardRef, useCallback } from "react";
import css from './styles.module.scss';
import { 
    getDate,
    getOffset,
    getFormatter,
    getString,
    getTodayString,
    getDays,
    getWeeks,
} from './getters';
import { Button } from "../Button";
import { text } from '../Text';

type CalendarProps = {
    value?: string,
    onConfirm?: (value: string) => void,
}

function Th({ narrow, long }: any) {
    return (
        <th role='columnheader'>
            <text.span aria-hidden='true'>{ narrow }</text.span>
            <text.span screenreaderOnly>{ long }</text.span>
        </th>
    )
}

function Header({ year, month }: any) {

    const day1 = getDate(year, month - 1, 1);
    const offset = getOffset(day1);
    day1.setUTCDate(day1.getUTCDate() - offset);

    const narrowFormatter = getFormatter({ weekday: "narrow" });
    const longFormatter = getFormatter({ weekday: "long" });

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

function DateButton({ date, month, year, day, onConfirm, formatter }: any) {
    const id = getString(year, month, date);
    const d = new Date(year, month, date);

    const onClick = useCallback(() => {
        typeof onConfirm === 'function' && onConfirm(id);
    }, [id, onConfirm]);

    return (
        <Button
            aria-current={ getTodayString() === id ? 'date' : undefined }
            aria-label={ formatter.format(d) }
            aria-selected={ day === date }
            // tabIndex={ day === date ? 0 : -1 }
            id={ id }
            onClick={ onClick }
            square>
            { date }
        </Button>
    );
}

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

function Body({ year, month, ...rest }: any) {

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
                    {...{ week, month, year, formatter }}
                    key={ idx } />
           )) }
        </tbody>
    )
}

export const Calendar = forwardRef<HTMLTableElement, CalendarProps>(({
    value,
    onConfirm,
    ...rest
}: CalendarProps, ref) => {

    const d = new Date();
    const [year, month, day] = typeof value === 'string'
        ? value.split('-').map(Number)
        : [d.getFullYear(), d.getMonth() + 1];

    return (
        <table { ...rest } ref={ ref } className={ css.table } role='grid'>
            <Header { ...{ year, month, day } }/>
            <Body { ...{ year, month, day } } onConfirm={ onConfirm }/>
        </table>
    );
});