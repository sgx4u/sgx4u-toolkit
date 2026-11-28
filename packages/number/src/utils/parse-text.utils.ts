import type { ByteStandardSetting } from "../types/byte-standard.types.js";
import {
    assertCurrency,
    assertLocale,
    getNumberFormatter,
    readLocaleSymbols,
} from "./intl-locale.utils.js";

const plainDecimalPattern = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/;
const formatCharacterPattern =
    /[\u061c\u200e\u200f\u202a-\u202e\u2066-\u2069]/g;

/**
 * Parses a finite number or a plain decimal string.
 *
 * Grouping separators, currency symbols, and the words `NaN` and `Infinity`
 * are rejected. `-0` is preserved.
 */
export function parsePlainNumber(value: unknown): number | undefined {
    if (typeof value === "number") {
        return Number.isFinite(value) ? value : undefined;
    }
    if (typeof value !== "string") {
        return undefined;
    }
    const text = value.trim();
    if (!plainDecimalPattern.test(text)) {
        return undefined;
    }
    const parsed = Number(text);
    return Number.isFinite(parsed) ? parsed : undefined;
}

/**
 * Parses a locale-formatted number. An invalid `locale` throws `RangeError`.
 */
export function parseLocaleNumberText(
    value: string,
    locale?: string | readonly string[],
): number | undefined {
    if (locale !== undefined) {
        assertLocale(locale);
    }
    const normalized = normalizeLocaleNumber(value, locale, false);
    if (normalized === undefined) {
        return undefined;
    }
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : undefined;
}

/**
 * Parses a percentage. A finite number is divided by 100. A string may include
 * the locale percent sign. `"25%"`, `"25 %"`, and `25` are all `0.25`.
 */
export function parsePercentText(
    value: string | number,
    locale?: string | readonly string[],
): number | undefined {
    if (typeof value === "number") {
        return Number.isFinite(value) ? value / 100 : undefined;
    }
    if (typeof value !== "string") {
        return undefined;
    }
    if (locale !== undefined) {
        assertLocale(locale);
    }
    const normalized = normalizeLocaleNumber(value, locale, true);
    if (normalized === undefined) {
        return undefined;
    }
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed / 100 : undefined;
}

/**
 * Strips a currency symbol or code, then parses a locale number.
 *
 * An invalid `locale` or `currency`, when passed, throws `RangeError`.
 */
export function parseCurrencyText(
    value: string,
    locale?: string | readonly string[],
    currency?: string,
): number | undefined {
    if (locale !== undefined) {
        assertLocale(locale);
    }
    if (currency !== undefined) {
        assertCurrency(currency, locale);
    }
    let text = value.replace(formatCharacterPattern, "");
    if (currency !== undefined) {
        for (const token of currencyTokens(currency, locale)) {
            text = text.split(token).join("");
        }
    } else {
        text = stripLooseAffixes(text);
    }
    return parseLocaleNumberText(text, locale);
}

/**
 * Parses a byte or bit size such as `"1.34 kB"` or `"1 KiB"`.
 *
 * The result is a count of bytes. Bit units are divided by 8.
 * `standard` chooses the scale for an ambiguous unit such as `KB` or `MB`.
 */
export function parseBytesText(
    value: string,
    standard: ByteStandardSetting,
): number | undefined {
    if (standard !== "SI" && standard !== "IEC" && standard !== "auto") {
        throw new RangeError(
            `standard must be "SI", "IEC", or "auto". Received ${JSON.stringify(standard)}.`,
        );
    }
    const match =
        /^\s*([+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?)\s*([A-Za-z]+)\s*$/.exec(
            value,
        );
    if (match === null) {
        return undefined;
    }
    const magnitudeText = match[1];
    const unitText = match[2];
    if (magnitudeText === undefined || unitText === undefined) {
        return undefined;
    }
    const magnitude = Number(magnitudeText);
    const factor = byteFactor(unitText, standard);
    if (!Number.isFinite(magnitude) || factor === undefined) {
        return undefined;
    }
    const bytes = magnitude * factor;
    return Number.isFinite(bytes) ? bytes : undefined;
}

function normalizeLocaleNumber(
    value: string,
    locale: string | readonly string[] | undefined,
    allowPercent: boolean,
): string | undefined {
    const symbols = readLocaleSymbols(locale);
    let text = value.replace(formatCharacterPattern, "").trim();
    if (text.length === 0) {
        return undefined;
    }
    const percentAtEnd =
        text.endsWith(symbols.percentSign) || text.endsWith("%");
    const percentAtStart =
        text.startsWith(symbols.percentSign) || text.startsWith("%");
    if ((percentAtEnd || percentAtStart) && !allowPercent) {
        return undefined;
    }
    if (percentAtEnd) {
        const marker = text.endsWith(symbols.percentSign)
            ? symbols.percentSign
            : "%";
        text = text.slice(0, -marker.length).trim();
    } else if (percentAtStart) {
        const marker = text.startsWith(symbols.percentSign)
            ? symbols.percentSign
            : "%";
        text = text.slice(marker.length).trim();
    }
    let sign = "";
    if (text.startsWith(symbols.minusSign) || text.startsWith("-")) {
        sign = "-";
        text = text
            .slice(
                text.startsWith(symbols.minusSign)
                    ? symbols.minusSign.length
                    : 1,
            )
            .trim();
    } else if (text.startsWith(symbols.plusSign) || text.startsWith("+")) {
        text = text
            .slice(
                text.startsWith(symbols.plusSign) ? symbols.plusSign.length : 1,
            )
            .trim();
    } else if (text.endsWith(symbols.minusSign) || text.endsWith("-")) {
        sign = "-";
        const marker = text.endsWith(symbols.minusSign)
            ? symbols.minusSign
            : "-";
        text = text.slice(0, -marker.length).trim();
    }
    text = replaceDigits(text, symbols.digits);
    text = stripGroup(text, symbols.group);
    if (symbols.decimal !== ".") {
        text = text.split(symbols.decimal).join(".");
    }
    if (symbols.exponentSeparator.toLowerCase() !== "e") {
        text = text.split(symbols.exponentSeparator).join("e");
    }
    text = text.replace(/[\s\u00a0\u202f]/g, "");
    if (text.startsWith("+") || text.startsWith("-")) {
        return undefined;
    }
    const candidate = `${sign}${text}`;
    if (!plainDecimalPattern.test(candidate)) {
        return undefined;
    }
    return candidate;
}

function replaceDigits(text: string, digits: readonly string[]): string {
    let replaced = text;
    const pairs = digits
        .map((digit, index) => ({ digit, index }))
        .filter((pair) => pair.digit !== String(pair.index))
        .sort((left, right) => right.digit.length - left.digit.length);
    for (const pair of pairs) {
        replaced = replaced.split(pair.digit).join(String(pair.index));
    }
    return replaced;
}

function stripGroup(text: string, group: string): string {
    if (group.length === 0) {
        return text;
    }
    let stripped = text.split(group).join("");
    if (/^\s$/u.test(group) || group === "\u202f" || group === "\u00a0") {
        stripped = stripped.replace(/[\s\u00a0\u202f]/g, "");
    }
    return stripped;
}

/**
 * Removes one leading symbol run and one trailing non-digit run.
 *
 * Used when no currency code was passed, so a mark such as `₹` can be
 * dropped before locale parsing. The scan is linear. Digits include
 * non-Latin decimal digits.
 */
function stripLooseAffixes(text: string): string {
    let start = 0;
    while (start < text.length && isLeadingSymbol(text.charAt(start))) {
        start += 1;
    }
    let end = text.length;
    while (end > start && !isDecimalDigit(text.charAt(end - 1))) {
        end -= 1;
    }
    if (start === 0 && end === text.length) {
        return text;
    }
    return text.slice(start, end);
}

/**
 * Whether `character` is a currency mark rather than part of the number.
 */
function isLeadingSymbol(character: string): boolean {
    if (isDecimalDigit(character)) {
        return false;
    }
    if (
        character === "+" ||
        character === "-" ||
        character === "." ||
        character === ","
    ) {
        return false;
    }
    return character.trim().length > 0;
}

/**
 * Whether `character` is a decimal digit in any numbering system.
 */
function isDecimalDigit(character: string): boolean {
    return /^\p{Nd}$/u.test(character);
}

function currencyTokens(
    currency: string,
    locale: string | readonly string[] | undefined,
): readonly string[] {
    const displays = ["symbol", "narrowSymbol", "code", "name"] as const;
    const tokens = new Set<string>([
        currency,
        currency.toUpperCase(),
        currency.toLowerCase(),
    ]);
    for (const currencyDisplay of displays) {
        const part = getNumberFormatter(locale, {
            style: "currency",
            currency,
            currencyDisplay,
        })
            .formatToParts(1)
            .find((entry) => entry.type === "currency");
        if (part !== undefined && part.value.length > 0) {
            tokens.add(part.value);
        }
    }
    return [...tokens].sort((left, right) => right.length - left.length);
}

function byteFactor(
    unit: string,
    standard: ByteStandardSetting,
): number | undefined {
    const structural = /^(?:([kmgtpe])(i)?)?(byte|bit|b)s?$/i.exec(unit);
    if (structural === null) {
        return undefined;
    }
    const prefix = structural[1];
    const iecMarker = structural[2];
    const kind = structural[3];
    if (kind === undefined) {
        return undefined;
    }
    const powers: Readonly<Record<string, number>> = {
        k: 1,
        m: 2,
        g: 3,
        t: 4,
        p: 5,
        e: 6,
    };
    const power =
        prefix === undefined ? 0 : (powers[prefix.toLowerCase()] ?? 0);
    const prefixCharacter =
        prefix === undefined ? undefined : unit.match(/[kmgtpe]/i)?.[0];
    let base = 1000;
    if (iecMarker !== undefined) {
        base = 1024;
    } else if (prefixCharacter === "k") {
        base = 1000;
    } else if (prefixCharacter === "K") {
        base = standard === "SI" ? 1000 : 1024;
    } else if (prefixCharacter !== undefined) {
        base = standard === "IEC" ? 1024 : 1000;
    }
    const bits = kind.toLowerCase() === "bit";
    const scaled = base ** power;
    return bits ? scaled / 8 : scaled;
}
