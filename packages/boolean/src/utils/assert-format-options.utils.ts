import {
    booleanCapitalizations,
    booleanFormatStyles,
} from "../constants/format-styles.constants.js";
import type {
    BooleanCapitalization,
    BooleanFormatStyle,
} from "../types/format-options.types.js";
import { describeReceived } from "./describe-received.utils.js";

/**
 * Style, locale, and capitalization after validation.
 */
export interface ResolvedFormatOptions {
    style: BooleanFormatStyle;
    locale: string;
    capitalization: BooleanCapitalization;
}

/**
 * Validates format options and fills the defaults.
 *
 * `value` is not inspected. An omitted style is `"true-false"`, an omitted
 * locale is `"en"`, and an omitted capitalization is `"lower"`.
 *
 * @param style - The provided style, or `undefined` when omitted.
 * @param locale - The provided locale, or `undefined` when omitted.
 * @param capitalization - The provided capitalization, or `undefined` when omitted.
 * @returns The three settings the formatter should use.
 * @throws {TypeError} When a provided option is not one of the known values, or `locale` is not a string.
 */
export function resolveFormatOptions(
    style: unknown,
    locale: unknown,
    capitalization: unknown,
): ResolvedFormatOptions {
    return {
        style: readStyle(style),
        locale: readFormatLocale(locale),
        capitalization: readCapitalization(capitalization),
    };
}

/**
 * @param style - The provided style, or `undefined` when omitted.
 * @returns `"true-false"` when omitted.
 * @throws {TypeError} When `style` is not a known style.
 */
function readStyle(style: unknown): BooleanFormatStyle {
    if (style === undefined) {
        return "true-false";
    }
    if (isBooleanFormatStyle(style)) {
        return style;
    }
    throw new TypeError(
        `style must be one of ${quotedList(booleanFormatStyles)}. Received ${describeReceived(style)}.`,
    );
}

/**
 * @param locale - The provided locale, or `undefined` when omitted.
 * @returns `"en"` when omitted.
 * @throws {TypeError} When `locale` is provided and is not a string.
 */
function readFormatLocale(locale: unknown): string {
    if (locale === undefined) {
        return "en";
    }
    if (typeof locale !== "string") {
        throw new TypeError(
            `locale must be a string. Received ${describeReceived(locale)}.`,
        );
    }
    return locale;
}

/**
 * @param capitalization - The provided capitalization, or `undefined` when omitted.
 * @returns `"lower"` when omitted.
 * @throws {TypeError} When `capitalization` is not a known setting.
 */
function readCapitalization(capitalization: unknown): BooleanCapitalization {
    if (capitalization === undefined) {
        return "lower";
    }
    if (isBooleanCapitalization(capitalization)) {
        return capitalization;
    }
    throw new TypeError(
        `capitalization must be one of ${quotedList(booleanCapitalizations)}. Received ${describeReceived(capitalization)}.`,
    );
}

/**
 * @param value - Candidate style.
 * @returns `true` when `value` is one of `booleanFormatStyles`.
 */
function isBooleanFormatStyle(value: unknown): value is BooleanFormatStyle {
    return booleanFormatStyles.some((style) => style === value);
}

/**
 * @param value - Candidate capitalization.
 * @returns `true` when `value` is one of `booleanCapitalizations`.
 */
function isBooleanCapitalization(
    value: unknown,
): value is BooleanCapitalization {
    return booleanCapitalizations.some(
        (capitalization) => capitalization === value,
    );
}

/**
 * @param values - Known option values.
 * @returns A comma-separated list of JSON strings, with "or" before the last item.
 */
function quotedList(values: readonly string[]): string {
    const quoted = values.map((value) => JSON.stringify(value));
    if (quoted.length < 2) {
        return quoted.join("");
    }
    const leading = quoted.slice(0, -1);
    const last = quoted[quoted.length - 1];
    return `${leading.join(", ")}, or ${last ?? ""}`;
}
