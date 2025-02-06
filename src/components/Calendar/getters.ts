type ParsedDate = {
    year?: number,
    month?: number,
    day?: number
}

/**
 * Parses date string as collection of date values.
 * 
 * @param {String} value - ISO8601 Date string YYYY-MM-DD
 * @returns {Object} - Keys of year, month, day
 */
function parseValue(value: string) {
    const [ year, month, day ] = value.split('-').map(Number);
    return { year, month, day };
}

/**
 * Get the user's language setting.
 * 
 * @returns {String} - A language enum
 */
export function getLang() {
    return  navigator.language;
    return 'dv-MV';
}

/**
 * Determine the active descendent (focused) date.
 * 
 * @param {String} value - ISO8601 Date string YYYY-MM-DD
 * @param {String} active - The ISODate string that should be active
 * @returns {String} - The active ISODate string
 */
export function getActiveDescendant(value: string, active: string | undefined) {
    const { year, month }: ParsedDate = parseValue(value);
    const parsedActive: ParsedDate = typeof active === 'string' ? parseValue(active) : {};

    // If no active year exists, use the current value's year
    if (parsedActive.year !== year) {
        parsedActive.year = year;
    }

    // If no active month exists, use the current value's month
    if (parsedActive.month !== month) {
        parsedActive.month = month;
    }

    // If no active day exists, use the first (1)
    parsedActive.day = typeof parsedActive.day === 'number' ? parsedActive.day : 1;

    // Ensure the found day is within the current month/year
    const days = getDays(parsedActive.year, parsedActive.month);
    parsedActive.day = Math.min(Math.max(parsedActive.day, 1), days);

    // Create the new active date string
    return getString(parsedActive.year, parsedActive.month, parsedActive.day);
}

/**
 * Get the number of days for a given year and month.
 * 
 * @param {Number} year - 4-digit year
 * @param {Number} month - month as 1-index
 * @returns {Number} - The number of days
 */
export function getDays(year: number, month: number) {
    return getDate(year, month, 0).getDate();
}

/**
 * Creates a date formatter instance.
 * 
 * @param {Object} options - Configuration object for Intl.DateTimeFormat
 * @returns {Intl.DateTimeFormat} - A date fortmatter instance
 */
export function getFormatter(options: any) {
    return new Intl.DateTimeFormat(getLang(), { timeZone: "UTC", ...options })
}

/**
 * Determine where the week starting day is.
 * 
 * @param {Date} date - A native JS Date object
 * @returns {Number} - The amount of days offset from week start
 */
export function getOffset(date: Date) {
    const { firstDay } = getWeekStart();
    const offset = date.getUTCDay() - firstDay % 7;
    return offset < 0 ? 7 + offset : offset;
}

/**
 * Create a native JS Date object from date numbers.
 * This sets the time to noon so it doesn't conflict with DST.
 * 
 * @param {Number} year - 4-digit year
 * @param {Number} month - 1-indexed month
 * @param {Number} day - date
 * @returns {Date} - new native JS Date object
 */
export function getDate(year: number, month: number, day: number) {
    return new Date(Date.UTC(year, month, day, 12));
}

/**
 * Create a standardized date string
 * 
 * @param {Number} year - 4-digit year
 * @param {Array<Number>} parts - Additional parts for the string
 * @returns {String} - ISO8601 formatted date string
 */
export function getString(year: number, ...parts: number[]) {
    return [year, ...parts.map((part) => String(part).padStart(2, '0'))].join('-');
}

/**
 * Get today's date as a string.
 * 
 * @returns {String} - ISO8601 string for today's date
 */
export function getTodayString() {
    const d = new Date();
    return getString(d.getFullYear(), d.getMonth() + 1, d.getDate());
}

/**
 * Get the first day of the week based on locale.
 * 
 * @returns {Number} - A 0-index representation of the first day of the week.
 */
function getWeekStart() {
    const locale = new Intl.Locale(getLang());
    if (!('getWeekInfo' in locale) || typeof locale.getWeekInfo !== 'function') return { firstDay: 7 };
    return locale.getWeekInfo();
}

/**
 * Generate the week dates as a matrix.
 * 
 * @param {Number} days - The number of days
 * @param {Number} offset - How much to offset
 * @returns {Array<Array<Number>>} - A matrix of dates to be represented as a calendar
 */
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
