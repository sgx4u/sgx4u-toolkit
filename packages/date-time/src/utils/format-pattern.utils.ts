import type { DateParts } from "../types/time.types.js";
import { dayOfYear, isoWeekOfDate, weekOfDate } from "./week.utils.js";
import { localeWeekInfo } from "./week.utils.js";

const supportedTokens = new Set([
    "G",
    "GGGG",
    "y",
    "yy",
    "yyyy",
    "Y",
    "YYYY",
    "Q",
    "QQ",
    "QQQ",
    "QQQQ",
    "M",
    "MM",
    "MMM",
    "MMMM",
    "MMMMM",
    "L",
    "LL",
    "LLL",
    "LLLL",
    "w",
    "ww",
    "d",
    "dd",
    "D",
    "DDD",
    "E",
    "EEE",
    "EEEE",
    "EEEEE",
    "e",
    "ee",
    "a",
    "h",
    "hh",
    "H",
    "HH",
    "K",
    "KK",
    "k",
    "kk",
    "m",
    "mm",
    "s",
    "ss",
    "S",
    "SS",
    "SSS",
    "X",
    "XX",
    "XXX",
    "x",
    "xx",
    "xxx",
    "O",
    "OOOO",
    "z",
    "zzzz",
    "VV",
]);

/**
 * One piece of a format pattern.
 */
type PatternPiece =
    { kind: "literal"; text: string } | { kind: "field"; token: string };

/**
 * Splits a pattern into literals and field tokens.
 *
 * Text inside single quotes is literal. `''` is one quote. A run of the
 * same ASCII letter must be a supported token.
 *
 * @param pattern - The CLDR-style pattern.
 * @returns The pieces in order.
 * @throws {@link RangeError} When a letter run is not a supported token.
 */
export function readPattern(pattern: string): PatternPiece[] {
    if (typeof pattern !== "string") {
        throw new TypeError(
            `\`pattern\` must be a string; received ${typeof pattern}.`,
        );
    }
    const pieces: PatternPiece[] = [];
    let index = 0;
    while (index < pattern.length) {
        const character = pattern[index] ?? "";
        if (character === "'") {
            const literal = readLiteral(pattern, index);
            pieces.push({ kind: "literal", text: literal.text });
            index = literal.nextIndex;
            continue;
        }
        if (isAsciiLetter(character)) {
            let end = index + 1;
            while (end < pattern.length && pattern[end] === character) {
                end += 1;
            }
            const token = pattern.slice(index, end);
            if (!supportedTokens.has(token)) {
                throw new RangeError(
                    `\`pattern\` must use a supported token; received ${JSON.stringify(token)}.`,
                );
            }
            pieces.push({ kind: "field", token });
            index = end;
            continue;
        }
        let end = index + 1;
        while (
            end < pattern.length &&
            pattern[end] !== "'" &&
            !isAsciiLetter(pattern[end] ?? "")
        ) {
            end += 1;
        }
        pieces.push({ kind: "literal", text: pattern.slice(index, end) });
        index = end;
    }
    return pieces;
}

/**
 * Formats wall-clock fields with a pattern.
 *
 * Numeric fields use Latin digits. Names come from `Intl` for `locale`.
 *
 * @param parts - Wall-clock fields, including the weekday and offset.
 * @param pattern - The CLDR-style pattern.
 * @param locale - A BCP 47 tag or a list of tags.
 * @param timeZone - The zone used for zone-name tokens.
 * @param instant - The instant, used when a token needs `Intl`.
 * @returns The formatted text.
 * @throws {@link RangeError} When the pattern contains an unknown token.
 */
export function formatWithPattern(
    parts: DateParts,
    pattern: string,
    locale: string | readonly string[] | undefined,
    timeZone: string,
    instant: number,
): string {
    let text = "";
    for (const piece of readPattern(pattern)) {
        text +=
            piece.kind === "literal"
                ? piece.text
                : formatToken(piece.token, parts, locale, timeZone, instant);
    }
    return text;
}

/**
 * @param pattern - The pattern being scanned.
 * @param index - The index of the opening quote.
 * @returns The literal text and the index after the closing quote.
 */
function readLiteral(
    pattern: string,
    index: number,
): { text: string; nextIndex: number } {
    let text = "";
    let cursor = index + 1;
    while (cursor < pattern.length) {
        if (pattern[cursor] === "'") {
            if (pattern[cursor + 1] === "'") {
                text += "'";
                cursor += 2;
                continue;
            }
            return { text, nextIndex: cursor + 1 };
        }
        text += pattern[cursor] ?? "";
        cursor += 1;
    }
    return { text, nextIndex: cursor };
}

/**
 * @param character - One pattern character.
 * @returns `true` when it is an ASCII letter.
 */
function isAsciiLetter(character: string): boolean {
    return (
        (character >= "A" && character <= "Z") ||
        (character >= "a" && character <= "z")
    );
}

/**
 * @param token - A supported field token.
 * @param parts - Wall-clock fields.
 * @param locale - The locale for names.
 * @param timeZone - The zone for zone-name tokens.
 * @param instant - The instant passed to `Intl`.
 * @returns The field text.
 */
function formatToken(
    token: string,
    parts: DateParts,
    locale: string | readonly string[] | undefined,
    timeZone: string,
    instant: number,
): string {
    const quarter = (Math.floor((parts.month - 1) / 3) + 1) as 1 | 2 | 3 | 4;
    switch (token) {
        case "G":
            return intlPart(instant, locale, timeZone, { era: "short" }, "era");
        case "GGGG":
            return intlPart(instant, locale, timeZone, { era: "long" }, "era");
        case "y":
            return String(parts.year);
        case "yy":
            return pad(Math.abs(parts.year) % 100, 2);
        case "yyyy":
            return pad(parts.year, 4);
        case "Y":
        case "YYYY": {
            const weekYear = isoWeekOfDate(
                parts.year,
                parts.month,
                parts.day,
            ).weekYear;
            return token === "Y" ? String(weekYear) : pad(weekYear, 4);
        }
        case "Q":
            return String(quarter);
        case "QQ":
            return pad(quarter, 2);
        case "QQQ":
            return `Q${String(quarter)}`;
        case "QQQQ":
            return `${String(quarter)} quarter`;
        case "M":
            return String(parts.month);
        case "MM":
        case "LL":
            return pad(parts.month, 2);
        case "L":
            return String(parts.month);
        case "MMM":
        case "LLL":
            return intlPart(
                instant,
                locale,
                timeZone,
                { month: "short" },
                "month",
            );
        case "MMMM":
        case "LLLL":
            return intlPart(
                instant,
                locale,
                timeZone,
                { month: "long" },
                "month",
            );
        case "MMMMM":
            return intlPart(
                instant,
                locale,
                timeZone,
                { month: "narrow" },
                "month",
            );
        case "w":
            return String(
                weekOfDate(parts.year, parts.month, parts.day, 1, 4).week,
            );
        case "ww":
            return pad(
                weekOfDate(parts.year, parts.month, parts.day, 1, 4).week,
                2,
            );
        case "d":
            return String(parts.day);
        case "dd":
            return pad(parts.day, 2);
        case "D":
            return String(dayOfYear(parts.year, parts.month, parts.day));
        case "DDD":
            return pad(dayOfYear(parts.year, parts.month, parts.day), 3);
        case "E":
        case "EEE":
            return intlPart(
                instant,
                locale,
                timeZone,
                { weekday: "short" },
                "weekday",
            );
        case "EEEE":
            return intlPart(
                instant,
                locale,
                timeZone,
                { weekday: "long" },
                "weekday",
            );
        case "EEEEE":
            return intlPart(
                instant,
                locale,
                timeZone,
                { weekday: "narrow" },
                "weekday",
            );
        case "e":
            return String(localWeekday(parts, locale));
        case "ee":
            return pad(localWeekday(parts, locale), 2);
        case "a":
            return intlPart(
                instant,
                locale,
                timeZone,
                { hour: "numeric", hourCycle: "h12" },
                "dayPeriod",
            );
        case "h":
        case "hh":
            return clock(hour12(parts.hour), token.length);
        case "H":
        case "HH":
            return clock(parts.hour, token.length);
        case "K":
        case "KK":
            return clock(parts.hour % 12, token.length);
        case "k":
        case "kk":
            return clock(parts.hour === 0 ? 24 : parts.hour, token.length);
        case "m":
        case "mm":
            return clock(parts.minute, token.length);
        case "s":
        case "ss":
            return clock(parts.second, token.length);
        case "S":
            return String(Math.floor(parts.millisecond / 100));
        case "SS":
            return pad(Math.floor(parts.millisecond / 10), 2);
        case "SSS":
            return pad(parts.millisecond, 3);
        case "X":
        case "XX":
        case "XXX":
            return offsetToken(parts.offsetMinutes, token.length, true);
        case "x":
        case "xx":
        case "xxx":
            return offsetToken(parts.offsetMinutes, token.length, false);
        case "O":
            return intlPart(
                instant,
                locale,
                timeZone,
                { timeZoneName: "shortOffset" },
                "timeZoneName",
            );
        case "OOOO":
            return intlPart(
                instant,
                locale,
                timeZone,
                { timeZoneName: "longOffset" },
                "timeZoneName",
            );
        case "z":
            return intlPart(
                instant,
                locale,
                timeZone,
                { timeZoneName: "short" },
                "timeZoneName",
            );
        case "zzzz":
            return intlPart(
                instant,
                locale,
                timeZone,
                { timeZoneName: "long" },
                "timeZoneName",
            );
        case "VV":
            return timeZone;
        default:
            throw new RangeError(
                `\`pattern\` must use a supported token; received ${JSON.stringify(token)}.`,
            );
    }
}

/**
 * @param hour - An hour from 0 through 23.
 * @returns The 1 through 12 hour used by `h`.
 */
function hour12(hour: number): number {
    const remainder = hour % 12;
    return remainder === 0 ? 12 : remainder;
}

/**
 * @param value - A numeric field.
 * @param width - `1` leaves it unpadded and `2` pads it.
 * @returns Latin digits.
 */
function clock(value: number, width: number): string {
    return width === 1 ? String(value) : pad(value, 2);
}

/**
 * @param value - A non-negative integer.
 * @param width - The minimum number of digits.
 * @returns Latin digits padded with zeros.
 */
function pad(value: number, width: number): string {
    const text = String(Math.abs(Math.trunc(value))).padStart(width, "0");
    return value < 0 ? `-${text}` : text;
}

/**
 * @param offsetMinutes - Minutes east of UTC.
 * @param width - 1, 2, or 3, selecting the ISO offset width.
 * @param useZulu - Whether zero is `Z`.
 * @returns The offset text.
 */
function offsetToken(
    offsetMinutes: number,
    width: number,
    useZulu: boolean,
): string {
    if (offsetMinutes === 0 && useZulu) {
        return "Z";
    }
    const sign = offsetMinutes < 0 ? "-" : "+";
    const absolute = Math.abs(Math.round(offsetMinutes));
    const hours = Math.floor(absolute / 60);
    const minutes = absolute % 60;
    if (width === 1) {
        return `${sign}${String(hours).padStart(2, "0")}`;
    }
    if (width === 2) {
        return `${sign}${String(hours).padStart(2, "0")}${String(minutes).padStart(2, "0")}`;
    }
    return `${sign}${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

/**
 * @param parts - Wall-clock fields.
 * @param locale - The locale whose week starts the numbering.
 * @returns The weekday number with the locale's first day as 1.
 */
function localWeekday(
    parts: DateParts,
    locale: string | readonly string[] | undefined,
): number {
    const tag = typeof locale === "string" ? locale : locale?.[0];
    const firstDay = localeWeekInfo(tag).firstDay;
    return ((parts.weekday - firstDay + 7) % 7) + 1;
}

/**
 * @param instant - The instant to format.
 * @param locale - The locale, or the runtime default.
 * @param timeZone - The zone.
 * @param fields - `Intl` field options.
 * @param partType - The `formatToParts` type to keep.
 * @returns The localized text, or an empty string when the part is absent.
 */
function intlPart(
    instant: number,
    locale: string | readonly string[] | undefined,
    timeZone: string,
    fields: Intl.DateTimeFormatOptions,
    partType: Intl.DateTimeFormatPartTypes,
): string {
    const formatter = new Intl.DateTimeFormat(locale, { ...fields, timeZone });
    const part = formatter
        .formatToParts(instant)
        .find((item) => item.type === partType);
    return part?.value ?? "";
}
