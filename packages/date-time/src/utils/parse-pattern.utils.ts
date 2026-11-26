import type { DateParts, DatePartsInput } from "../types/time.types.js";
import { readPattern } from "./format-pattern.utils.js";
import { isRealGregorianDay, isoWeekdayNumber } from "./gregorian.utils.js";

/**
 * Fields collected while parsing a pattern.
 */
interface ParsedFields {
    year?: number;
    month?: number;
    day?: number;
    hour?: number;
    minute?: number;
    second?: number;
    millisecond?: number;
    hourOn12HourClock?: boolean;
    afternoon?: boolean;
    weekday?: number;
    beforeCommonEra?: boolean;
}

/**
 * Parses text written by `formatDate` for numeric patterns.
 *
 * Quoted literals must match. Padded numeric tokens read their width.
 * Unpadded tokens read one or more digits. Month names, weekday names,
 * eras, and day periods are matched against `Intl` for `locale`, ignoring
 * case. A field outside its range, a day that does not exist, or a weekday
 * name that disagrees with the calendar day returns `undefined`.
 *
 * @param value - The text to parse.
 * @param pattern - The same pattern used to format.
 * @param reference - Fields used when the pattern omits them.
 * @param dateFieldPresent - When true, omitted time fields become zero.
 * @param locale - The locale used for names. Omitted means the runtime locale.
 * @returns The wall-clock fields, or `undefined` when the text does not match.
 */
export function parseNumericPattern(
    value: string,
    pattern: string,
    reference: DateParts,
    dateFieldPresent: boolean,
    locale?: string | readonly string[],
): DatePartsInput | undefined {
    const pieces = readPattern(pattern);
    const found: ParsedFields = {};
    let index = 0;
    let sawDate = false;
    for (const piece of pieces) {
        if (piece.kind === "literal") {
            if (!value.startsWith(piece.text, index)) {
                return undefined;
            }
            index += piece.text.length;
            continue;
        }
        const read =
            readNumericToken(piece.token, value, index) ??
            readNameToken(piece.token, value, index, locale);
        if (read === undefined) {
            return undefined;
        }
        Object.assign(found, read.fields);
        if (
            read.fields.year !== undefined ||
            read.fields.month !== undefined ||
            read.fields.day !== undefined
        ) {
            sawDate = true;
        }
        index = read.nextIndex;
    }
    if (index !== value.length) {
        return undefined;
    }
    const useZeroTime = dateFieldPresent && sawDate;
    const year = found.year ?? reference.year;
    const month = found.month ?? reference.month;
    const day = found.day ?? reference.day;
    let hour = found.hour ?? (useZeroTime ? 0 : reference.hour);
    if (found.hourOn12HourClock && found.hour !== undefined) {
        const hour12 = found.hour % 12;
        hour = found.afternoon ? hour12 + 12 : hour12;
    }
    const minute = found.minute ?? (useZeroTime ? 0 : reference.minute);
    const second = found.second ?? (useZeroTime ? 0 : reference.second);
    const millisecond =
        found.millisecond ?? (useZeroTime ? 0 : reference.millisecond);
    if (
        month < 1 ||
        month > 12 ||
        hour > 23 ||
        minute > 59 ||
        second > 59 ||
        millisecond > 999 ||
        !isRealGregorianDay(year, month, day)
    ) {
        return undefined;
    }
    if (
        found.weekday !== undefined &&
        found.weekday !== isoWeekdayNumber(year, month, day)
    ) {
        return undefined;
    }
    const resolvedYear = found.beforeCommonEra && year > 0 ? 1 - year : year;
    return {
        year: resolvedYear,
        month,
        day,
        hour,
        minute,
        second,
        millisecond,
    };
}

/**
 * @param token - A pattern token.
 * @param value - The text.
 * @param index - Where to read.
 * @returns The fields and the next index, or `undefined` when the token is not numeric here.
 */
function readNumericToken(
    token: string,
    value: string,
    index: number,
): { fields: ParsedFields; nextIndex: number } | undefined {
    const width = paddedWidth(token);
    const digits =
        width === undefined
            ? readDigits(value, index, 1, 4)
            : readDigits(value, index, width, width);
    if (digits === undefined) {
        return undefined;
    }
    const number = Number(digits.text);
    const fields: ParsedFields = {};
    if (
        token === "yyyy" ||
        token === "y" ||
        token === "YYYY" ||
        token === "Y"
    ) {
        fields.year = number;
    } else if (token === "yy") {
        fields.year = 2000 + number;
    } else if (
        token === "M" ||
        token === "MM" ||
        token === "L" ||
        token === "LL"
    ) {
        fields.month = number;
    } else if (token === "d" || token === "dd") {
        fields.day = number;
    } else if (
        token === "h" ||
        token === "hh" ||
        token === "K" ||
        token === "KK"
    ) {
        fields.hour = number;
        fields.hourOn12HourClock = true;
    } else if (
        token === "H" ||
        token === "HH" ||
        token === "k" ||
        token === "kk"
    ) {
        fields.hour = token.startsWith("k") && number === 24 ? 0 : number;
    } else if (token === "m" || token === "mm") {
        fields.minute = number;
    } else if (token === "s" || token === "ss") {
        fields.second = number;
    } else if (token === "S") {
        fields.millisecond = number * 100;
    } else if (token === "SS") {
        fields.millisecond = number * 10;
    } else if (token === "SSS") {
        fields.millisecond = number;
    } else {
        return undefined;
    }
    return { fields, nextIndex: digits.nextIndex };
}

/**
 * @param token - A pattern token.
 * @returns The fixed digit width, or `undefined` when the token is unpadded.
 */
function paddedWidth(token: string): number | undefined {
    if (token === "yyyy" || token === "YYYY") {
        return 4;
    }
    if (token === "SSS" || token === "DDD") {
        return 3;
    }
    if (token.length >= 2 && token !== "Y" && token !== "y") {
        return token.length === 2 ? 2 : undefined;
    }
    return undefined;
}

/**
 * @param value - The text.
 * @param index - Where to start.
 * @param minimum - The least number of digits.
 * @param maximum - The most number of digits.
 * @returns The digits and the next index.
 */
function readDigits(
    value: string,
    index: number,
    minimum: number,
    maximum: number,
): { text: string; nextIndex: number } | undefined {
    let end = index;
    while (
        end < value.length &&
        end - index < maximum &&
        isDigit(value[end] ?? "")
    ) {
        end += 1;
    }
    if (end - index < minimum) {
        return undefined;
    }
    return { text: value.slice(index, end), nextIndex: end };
}

/**
 * @param character - One character.
 * @returns `true` when it is `0` through `9`.
 */
function isDigit(character: string): boolean {
    return character >= "0" && character <= "9";
}

/**
 * @param token - A name token such as `MMMM`, `EEEE`, `G`, or `a`.
 * @param value - The text.
 * @param index - Where to read.
 * @param locale - The locale whose names are matched.
 * @returns The fields and the next index, or `undefined` when the token is not a name here.
 */
function readNameToken(
    token: string,
    value: string,
    index: number,
    locale: string | readonly string[] | undefined,
): { fields: ParsedFields; nextIndex: number } | undefined {
    const labels = nameLabels(token, locale);
    const rest = value.slice(index);
    const match = labels
        .filter((label) =>
            rest.toLowerCase().startsWith(label.text.toLowerCase()),
        )
        .sort((first, second) => second.text.length - first.text.length)[0];
    if (match === undefined) {
        return undefined;
    }
    return { fields: match.fields, nextIndex: index + match.text.length };
}

/**
 * A name and the fields it sets.
 */
interface NameLabel {
    text: string;
    fields: ParsedFields;
}

/**
 * @param token - A pattern token.
 * @param locale - The locale whose names are read.
 * @returns The names that token can match, longest first when the caller sorts them.
 */
function nameLabels(
    token: string,
    locale: string | readonly string[] | undefined,
): NameLabel[] {
    if (
        token === "MMM" ||
        token === "MMMM" ||
        token === "MMMMM" ||
        token === "LLL" ||
        token === "LLLL" ||
        token === "LLLLL"
    ) {
        const width =
            token.endsWith("MMMMM") || token.endsWith("LLLLL")
                ? "narrow"
                : token.length >= 4
                  ? "long"
                  : "short";
        return numberedLabels(
            12,
            (month) =>
                formatPart(
                    Date.UTC(2000, month - 1, 15),
                    locale,
                    { month: width },
                    "month",
                ),
            (month) => ({ month }),
        );
    }
    if (
        token === "E" ||
        token === "EEE" ||
        token === "EEEE" ||
        token === "EEEEE"
    ) {
        const width =
            token === "EEEE" ? "long" : token === "EEEEE" ? "narrow" : "short";
        return numberedLabels(
            7,
            (weekday) =>
                formatPart(
                    Date.UTC(2000, 0, 2 + weekday),
                    locale,
                    { weekday: width },
                    "weekday",
                ),
            (weekday) => ({ weekday }),
        );
    }
    if (token === "G" || token === "GGGG") {
        const style = token === "G" ? "short" : "long";
        const common = formatPart(
            Date.UTC(2000, 0, 1),
            locale,
            { era: style },
            "era",
        );
        const before = formatPart(
            Date.UTC(0, 0, 1),
            locale,
            { era: style },
            "era",
        );
        return [
            { text: common, fields: {} },
            { text: before, fields: { beforeCommonEra: true } },
        ].filter((label) => label.text.length > 0);
    }
    if (token === "a") {
        const morning = formatPart(
            Date.UTC(2000, 0, 1, 9),
            locale,
            { hour: "numeric", hourCycle: "h12" },
            "dayPeriod",
        );
        const evening = formatPart(
            Date.UTC(2000, 0, 1, 15),
            locale,
            { hour: "numeric", hourCycle: "h12" },
            "dayPeriod",
        );
        return [
            { text: morning, fields: { afternoon: false } },
            { text: evening, fields: { afternoon: true } },
        ];
    }
    return [];
}

/**
 * @param count - How many labels to build, starting at 1.
 * @param textAt - The localized text for that number.
 * @param fieldsAt - The fields that number sets.
 * @returns One label per number.
 */
function numberedLabels(
    count: number,
    textAt: (number: number) => string,
    fieldsAt: (number: number) => ParsedFields,
): NameLabel[] {
    const labels: NameLabel[] = [];
    for (let number = 1; number <= count; number += 1) {
        labels.push({ text: textAt(number), fields: fieldsAt(number) });
    }
    return labels;
}

/**
 * @param epochMilliseconds - A reference instant in UTC.
 * @param locale - The locale.
 * @param options - The `Intl` fields to request.
 * @param type - The part to keep.
 * @returns That part's text.
 */
function formatPart(
    epochMilliseconds: number,
    locale: string | readonly string[] | undefined,
    options: Intl.DateTimeFormatOptions,
    type: Intl.DateTimeFormatPartTypes,
): string {
    return (
        new Intl.DateTimeFormat(locale, { ...options, timeZone: "UTC" })
            .formatToParts(new Date(epochMilliseconds))
            .find((part) => part.type === type)?.value ?? ""
    );
}
