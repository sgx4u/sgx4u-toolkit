import type { DateParts, DatePartsInput } from "../types/time.types.js";
import { readPattern } from "./format-pattern.utils.js";
import { isRealGregorianDay } from "./gregorian.utils.js";

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
}

/**
 * Parses text written by `formatDate` for numeric patterns.
 *
 * Quoted literals must match. Padded numeric tokens read their width.
 * Unpadded tokens read one or more digits. A field outside its range, or
 * a day that does not exist, returns `undefined`.
 *
 * @param value - The text to parse.
 * @param pattern - The same pattern used to format.
 * @param reference - Fields used when the pattern omits them.
 * @param dateFieldPresent - When true, omitted time fields become zero.
 * @returns The wall-clock fields, or `undefined` when the text does not match.
 */
export function parseNumericPattern(
    value: string,
    pattern: string,
    reference: DateParts,
    dateFieldPresent: boolean,
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
        const read = readNumericToken(piece.token, value, index);
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
    const hour = found.hour ?? (useZeroTime ? 0 : reference.hour);
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
    return { year, month, day, hour, minute, second, millisecond };
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
        token === "H" ||
        token === "HH" ||
        token === "h" ||
        token === "hh" ||
        token === "k" ||
        token === "kk" ||
        token === "K" ||
        token === "KK"
    ) {
        fields.hour = number;
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
