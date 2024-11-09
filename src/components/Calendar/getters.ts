export function getLang() {
    return  navigator.language;
    return 'dv-MV';
}

export function getActiveDescendant(value: string | undefined) {
    const [year, month, day] = typeof value === 'string' ? value.split('-').map(Number) : [];
    const d = new Date();
    const v = {
        year: typeof year === 'number' ? year : d.getFullYear(),
        month: typeof month === 'number' ? month : d.getMonth() + 1,
        day: typeof day === 'number' ? day : 1
    }
    return getString(v.year, v.month, v.day);
}

export function getDays(year: number, month: number) {
    return getDate(year, month, 0).getDate();
}

export function getFormatter(options: any) {
    return new Intl.DateTimeFormat(getLang(), { timeZone: "UTC", ...options })
}

export function getOffset(date: Date) {
    const { firstDay } = getWeekStart();
    const offset = date.getUTCDay() - firstDay % 7;
    return offset < 0 ? 7 + offset : offset;
}

export function getDate(year: number, month: number, day: number) {
    return new Date(Date.UTC(year, month, day, 12));
}

export function getString(year: number, ...parts: number[]) {
    return [year, ...parts.map((part) => String(part).padStart(2, '0'))].join('-');
}

export function getTodayString() {
    const d = new Date();
    return getString(d.getFullYear(), d.getMonth() + 1, d.getDate());
}

function getWeekStart() {
    const locale = new Intl.Locale(getLang());
    if (!('getWeekInfo' in locale) || typeof locale.getWeekInfo !== 'function') return { firstDay: 7 };
    return locale.getWeekInfo();
}

export function getWeeks(days: number, offset: number) {
    const total = Math.ceil((days + offset) / 7) * 7;
    return Array(total).fill(0).reduce((weeks, _, idx) => {
        const day = (idx + 1) - offset;
        const value = idx >= offset && day <= days ? day : null;
        weeks.at(-1).push(value);
        if (weeks.at(-1).length === 7 && idx + 1 !== total) weeks.push([]);
        return weeks;
    }, [[]]);
}
