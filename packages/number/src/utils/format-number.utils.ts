import type { CurrencyDisplay } from "../types/format-display.types.js";
import type { UnitDisplay } from "../types/format-display.types.js";
import type { NumberFormatFields } from "../types/number-format-fields.types.js";
import { assertRoundingMode } from "./round-decimal.utils.js";
import {
    assertCurrency,
    assertLocale,
    assertNumberingSystem,
    assertUnit,
    getNumberFormatter,
    getPluralRules,
    languageOf,
} from "./intl-locale.utils.js";

/** Fields a formatter may receive in addition to the shared number fields. */
export interface FormatRequest extends NumberFormatFields {
    style?: "decimal" | "percent" | "currency" | "unit";
    currency?: string;
    currencyDisplay?: CurrencyDisplay;
    currencySign?: "standard" | "accounting";
    unit?: string;
    unitDisplay?: UnitDisplay;
}

/**
 * Formats a finite number. Non-finite values return `undefined`.
 *
 * Invalid locale, currency, unit, numbering system, or rounding mode throws
 * `RangeError`.
 */
export function formatFiniteNumber(
    value: number,
    request: FormatRequest = {},
): string | undefined {
    if (!Number.isFinite(value)) {
        return undefined;
    }
    return formatterFor(request).format(value);
}

/**
 * Returns the parts `Intl` would use to format `value`.
 */
export function formatFiniteParts(
    value: number,
    request: FormatRequest = {},
): Intl.NumberFormatPart[] | undefined {
    if (!Number.isFinite(value)) {
        return undefined;
    }
    return formatterFor(request).formatToParts(value);
}

/**
 * Formats a range. Uses `formatRange` when the runtime provides it, and an
 * en dash between two formatted endpoints otherwise.
 */
export function formatFiniteRange(
    start: number,
    end: number,
    request: FormatRequest = {},
): string | undefined {
    if (!Number.isFinite(start) || !Number.isFinite(end)) {
        return undefined;
    }
    const formatter = formatterFor(request);
    if (typeof formatter.formatRange === "function") {
        return formatter.formatRange(start, end);
    }
    return `${formatter.format(start)}\u2013${formatter.format(end)}`;
}

/**
 * Currency symbol, code, or name for `currency`.
 */
export function currencySymbolText(
    currency: string,
    locale: string | readonly string[] | undefined,
    currencyDisplay: CurrencyDisplay,
): string | undefined {
    if (locale !== undefined) {
        assertLocale(locale);
    }
    assertCurrency(currency, locale);
    const part = getNumberFormatter(locale, {
        style: "currency",
        currency,
        currencyDisplay,
    })
        .formatToParts(0)
        .find((entry) => entry.type === "currency");
    return part?.value;
}

/**
 * Ordinal text for the integer part of `value`.
 *
 * English uses `st`, `nd`, `rd`, and `th`. French uses `er` and `e`.
 * German uses a trailing period. Other languages return the formatted integer.
 */
export function formatOrdinalText(
    value: number,
    locale?: string | readonly string[],
): string | undefined {
    if (!Number.isFinite(value)) {
        return undefined;
    }
    if (locale !== undefined) {
        assertLocale(locale);
    }
    const integer = Math.trunc(value);
    const formatted = formatFiniteNumber(integer, {
        maximumFractionDigits: 0,
        useGrouping: false,
        ...(locale === undefined ? {} : { locale }),
    });
    if (formatted === undefined) {
        return undefined;
    }
    const language = languageOf(locale);
    if (language === "en") {
        const category = getPluralRules(locale, "ordinal").select(
            Math.abs(integer),
        );
        const suffix =
            category === "one"
                ? "st"
                : category === "two"
                  ? "nd"
                  : category === "few"
                    ? "rd"
                    : "th";
        return `${formatted}${suffix}`;
    }
    if (language === "fr") {
        const category = getPluralRules(locale, "ordinal").select(
            Math.abs(integer),
        );
        return category === "one" ? `${formatted}er` : `${formatted}e`;
    }
    if (language === "de") {
        return `${formatted}.`;
    }
    return formatted;
}

function formatterFor(request: FormatRequest): Intl.NumberFormat {
    if (request.locale !== undefined) {
        assertLocale(request.locale);
    }
    if (request.numberingSystem !== undefined) {
        assertNumberingSystem(request.numberingSystem);
    }
    if (request.roundingMode !== undefined) {
        assertRoundingMode(request.roundingMode, "roundingMode");
    }
    if (request.style === "currency") {
        if (request.currency === undefined) {
            throw new RangeError("currency is required. Received no currency.");
        }
        assertCurrency(request.currency, request.locale);
    }
    if (request.style === "unit") {
        if (request.unit === undefined) {
            throw new RangeError("unit is required. Received no unit.");
        }
        assertUnit(request.unit, request.locale);
    }
    return getNumberFormatter(request.locale, intlOptions(request));
}

function intlOptions(request: FormatRequest): Intl.NumberFormatOptions {
    const options: Intl.NumberFormatOptions = {};
    if (request.style !== undefined) {
        options.style = request.style;
    }
    if (request.currency !== undefined) {
        options.currency = request.currency;
    }
    if (request.currencyDisplay !== undefined) {
        options.currencyDisplay = request.currencyDisplay;
    }
    if (request.currencySign !== undefined) {
        options.currencySign = request.currencySign;
    }
    if (request.unit !== undefined) {
        options.unit = request.unit;
    }
    if (request.unitDisplay !== undefined) {
        options.unitDisplay = request.unitDisplay;
    }
    if (request.minimumFractionDigits !== undefined) {
        options.minimumFractionDigits = request.minimumFractionDigits;
    }
    if (request.maximumFractionDigits !== undefined) {
        options.maximumFractionDigits = request.maximumFractionDigits;
    }
    if (request.minimumSignificantDigits !== undefined) {
        options.minimumSignificantDigits = request.minimumSignificantDigits;
    }
    if (request.maximumSignificantDigits !== undefined) {
        options.maximumSignificantDigits = request.maximumSignificantDigits;
    }
    if (request.useGrouping !== undefined) {
        options.useGrouping = request.useGrouping;
    }
    if (request.numberingSystem !== undefined) {
        options.numberingSystem = request.numberingSystem;
    }
    if (request.roundingMode !== undefined) {
        options.roundingMode = request.roundingMode;
    }
    if (request.signDisplay !== undefined) {
        options.signDisplay = request.signDisplay;
    }
    if (request.trailingZeroDisplay !== undefined) {
        options.trailingZeroDisplay = request.trailingZeroDisplay;
    }
    if (request.notation !== undefined) {
        options.notation = request.notation;
    }
    if (request.compactDisplay !== undefined) {
        options.compactDisplay = request.compactDisplay;
    }
    return options;
}
