import { forwardRef, useCallback } from "react";
import css from './styles.module.scss';
import { Button } from "../Button";

type CalendarValue = {
    year?: number,
    month?: number,
    day?: number
}

type CalendarProps = {
    value?: CalendarValue,
    onConfirm?: (value: CalendarValue) => void  
}

function getLang() {
    return  navigator.language;
    return 'dv-MV';
}

function getDays(year: number, month: number) {
    return toDate(year, month, 0).getDate();
}

function getFormatter(options: any) {
    return new Intl.DateTimeFormat(getLang(), { timeZone: "UTC", ...options })
}

function getOffset(date: Date) {
    const { firstDay } = getWeekStart();
    const offset = date.getUTCDay() - firstDay % 7;
    return offset < 0 ? 7 + offset : offset;
}

function toDate(year: number, month: number, day: number) {
    return new Date(Date.UTC(year, month, day, 12));
}

function toString(year: number, ...parts: number[]) {
    return [year, ...parts.map((part) => String(part).padStart(2, '0'))].join('-');
}

function today() {
    const d = new Date();
    return toString(d.getFullYear(), d.getMonth() + 1, d.getDate());
}

function getWeekStart() {
    const locale = new Intl.Locale(getLang());
    if (!('getWeekInfo' in locale) || typeof locale.getWeekInfo !== 'function') return { firstDay: 7 };
    return locale.getWeekInfo();
}

function getWeeks(days: number, offset: number) {
    const total = Math.ceil((days + offset) / 7) * 7;
    return Array(total).fill(0).reduce((weeks, _, idx) => {
        const day = (idx + 1) - offset;
        const value = idx >= offset && day <= days ? day : null;
        weeks.at(-1).push(value);
        if (weeks.at(-1).length === 7 && idx + 1 !== total) weeks.push([]);
        return weeks;
    }, [[]]);
}

function Th({ narrow, long }: any) {
    const style = { transform: 'scale(0)', position: 'absolute' } as const;

    return (
        <th>
            <span aria-hidden='true'>{ narrow }</span>
            <span style={ style }>{ long }</span>
        </th>
    )
}

function Header({ year, month }: any) {

    const day1 = toDate(year, month - 1, 1);
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
                { cells.map((cell, idx) => <Th key={ idx } { ...cell } />) }
            </tr>
        </thead>
    )
}

function Td({ date, month, year, day, onConfirm }: any) {
    const id = toString(year, month, date);

    console.log(day);

    const onClick = useCallback(() => {
        typeof onConfirm === 'function' && onConfirm({ year, month, day });
    }, [year, month, day, onConfirm]);

    const button = (
        <Button onClick={ onClick }>
            { date }
        </Button>
    );

    return (
        <td
            aria-current={ today() === id ? 'date' : undefined }
            className={ css.td }
            id={ date ? id : undefined }>
            { date ? button : null }
        </td>
    )
}

function Row({ week, ...rest }: any) {
    return (
        <tr className={ css.tr }>
            { week.map((date: number, idx: number) => <Td { ...rest} key={ idx } date={ date }  />) }
        </tr>
    )
}

function Body({ year, month, ...rest }: any) {

    const days = getDays(year, month);
    const day1 = toDate(year, month - 1, 1);
    const offset = getOffset(day1);
    const matrix = getWeeks(days, offset);

    return (
        <tbody>
           { matrix.map((week: number[], idx: number) => (
                <Row
                    { ...rest }
                    {...{ week, month, year }}
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