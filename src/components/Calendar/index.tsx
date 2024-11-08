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

type CalendarValue = {
    year?: number,
    month?: number,
    day?: number
}

type CalendarProps = {
    value?: CalendarValue,
    onConfirm?: (value: CalendarValue) => void  
}

function Th({ narrow, long }: any) {
    return (
        <th>
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
        <thead>
            <tr>
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
        typeof onConfirm === 'function' && onConfirm({ year, month, day: date });
    }, [year, month, date, onConfirm]);

    return (
        <Button
            aria-current={ getTodayString() === id ? 'date' : undefined }
            aria-label={ formatter.format(d) }
            aria-selected={ day === date }
            id={ id }
            onClick={ onClick }>
            { date }
        </Button>
    );
}

function Row({ week, ...rest }: any) {
    return (
        <tr>
            { week.map((date: number, idx: number) => (
                <td
                    className={ css.td }
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
        <tbody>
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
    const payload = Object.assign({
        year: d.getFullYear(),
        month: d.getMonth() + 1,
        // day: d.getDate(),
    }, value) as CalendarValue;

    return (
        <table { ...rest } ref={ ref } className={ css.table }>
            <Header { ...payload }/>
            <Body { ...payload } onConfirm={ onConfirm }/>
        </table>
    );
});