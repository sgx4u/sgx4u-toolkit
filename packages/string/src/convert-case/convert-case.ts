import type { CaseName } from "../types/case-name.types.js";
import type { CaseConversionOptions } from "../types/case-conversion.types.js";
import type { TitleCaseStyle } from "../types/string-unit.types.js";
import { readBoolean, readEnum } from "../utils/assertions.utils.js";
import { describeReceived } from "../utils/describe-received.utils.js";
import { readLocale, type LocaleArgument } from "../utils/locale.utils.js";
import { readOptionsCall } from "../utils/read-call.utils.js";
import { toCamelCase } from "../to-camel-case/to-camel-case.js";
import { toCapitalCase } from "../to-capital-case/to-capital-case.js";
import { toConstantCase } from "../to-constant-case/to-constant-case.js";
import { toDotCase } from "../to-dot-case/to-dot-case.js";
import { toKebabCase } from "../to-kebab-case/to-kebab-case.js";
import { toLowerCase } from "../to-lower-case/to-lower-case.js";
import { toNoCase } from "../to-no-case/to-no-case.js";
import { toPascalCase } from "../to-pascal-case/to-pascal-case.js";
import { toPascalSnakeCase } from "../to-pascal-snake-case/to-pascal-snake-case.js";
import { toPathCase } from "../to-path-case/to-path-case.js";
import { toSentenceCase } from "../to-sentence-case/to-sentence-case.js";
import { toSnakeCase } from "../to-snake-case/to-snake-case.js";
import { toTitleCase } from "../to-title-case/to-title-case.js";
import { toTrainCase } from "../to-train-case/to-train-case.js";
import { toUpperCase } from "../to-upper-case/to-upper-case.js";
import type { ToTitleCaseOptions } from "../to-title-case/to-title-case.types.js";
import type { ConvertCaseOptions } from "./convert-case.types.js";

const caseNames = [
    "camel",
    "pascal",
    "snake",
    "kebab",
    "constant",
    "dot",
    "path",
    "train",
    "pascal-snake",
    "sentence",
    "title",
    "capital",
    "no-case",
    "lower",
    "upper",
] as const;

const titleStyles = ["capitalize-every-word", "apa", "chicago"] as const;

/**
 * Converts `value` to the named case.
 *
 * The input is not changed.
 *
 * @param options - `value`, the required `case` name, and the options that case understands.
 * @returns The converted string, or `undefined` when `value` is not a string.
 * @throws {@link RangeError} When `case` is not a known name.
 * @example
 * convertCase({ value: "foo bar", case: "camel" });
 */
export function convertCase(options: ConvertCaseOptions): string | undefined {
    const resolved = readOptionsCall(options, readConvertCaseOptions);
    if (resolved === undefined || typeof resolved.record.value !== "string") {
        return undefined;
    }
    return dispatchCase(resolved.record.value, resolved.options);
}

/**
 * Reads and checks every option `convertCase` accepts.
 *
 * A bad `style` or `smallWords` throws even when `case` does not use it.
 *
 * @param record - The options object.
 * @returns The checked options.
 * @throws {@link TypeError} When an option has the wrong type.
 * @throws {@link RangeError} When `case` or `style` is not a known value, or `locale` is empty.
 */
function readConvertCaseOptions(record: Record<string, unknown>): {
    caseName: CaseName;
    locale: LocaleArgument | undefined;
    keepConsecutiveUppercase: boolean;
    mergeAmbiguousCharacters: boolean;
    style: TitleCaseStyle;
    smallWords: readonly string[] | undefined;
} {
    return {
        caseName: readCaseName(record.case),
        locale: readLocale(record.locale),
        keepConsecutiveUppercase: readBoolean(
            "keepConsecutiveUppercase",
            record.keepConsecutiveUppercase,
            false,
        ),
        mergeAmbiguousCharacters: readBoolean(
            "mergeAmbiguousCharacters",
            record.mergeAmbiguousCharacters,
            false,
        ),
        style: readEnum(
            "style",
            record.style,
            titleStyles,
            "capitalize-every-word",
        ),
        smallWords: readSmallWords(record.smallWords),
    };
}

/**
 * Reads the required case name.
 *
 * @param value - The `case` option.
 * @returns A known case name.
 * @throws {@link TypeError} When `value` is missing or is not a string.
 * @throws {@link RangeError} When the string is not a known case.
 */
function readCaseName(value: unknown): CaseName {
    if (value === undefined) {
        throw new TypeError(
            `case must be a string. Received ${describeReceived(value)}.`,
        );
    }
    return readEnum("case", value, caseNames, "camel");
}

/**
 * Reads an optional list of small words.
 *
 * @param value - The `smallWords` option.
 * @returns The list, or `undefined` when it was omitted.
 * @throws {@link TypeError} When `value` is present and is not a list of strings.
 */
function readSmallWords(value: unknown): readonly string[] | undefined {
    if (value === undefined) {
        return undefined;
    }
    if (!Array.isArray(value)) {
        throw new TypeError(
            `smallWords must be an array of strings. Received ${describeReceived(value)}.`,
        );
    }
    const words: string[] = [];
    for (const entry of value) {
        if (typeof entry !== "string") {
            throw new TypeError(
                `smallWords must be an array of strings. Received ${describeReceived(entry)}.`,
            );
        }
        words.push(entry);
    }
    return words;
}

/**
 * Builds programming-case options without setting an omitted locale to `undefined`.
 *
 * @param value - The text to convert.
 * @param locale - Locale already checked, or `undefined` when omitted.
 * @param keepConsecutiveUppercase - Whether acronyms stay uppercase.
 * @param mergeAmbiguousCharacters - Whether letters and digits merge.
 * @returns Options that satisfy `exactOptionalPropertyTypes`.
 */
function programmingCaseOptions(
    value: string,
    locale: LocaleArgument | undefined,
    keepConsecutiveUppercase: boolean,
    mergeAmbiguousCharacters: boolean,
): CaseConversionOptions {
    const options: CaseConversionOptions = { value };
    if (locale !== undefined) {
        options.locale = locale;
    }
    if (keepConsecutiveUppercase) {
        options.keepConsecutiveUppercase = true;
    }
    if (mergeAmbiguousCharacters) {
        options.mergeAmbiguousCharacters = true;
    }
    return options;
}

/**
 * Builds locale options without setting an omitted locale to `undefined`.
 *
 * @param value - The text to convert.
 * @param locale - Locale already checked, or `undefined` when omitted.
 * @returns Options with `value` and, when present, `locale`.
 */
function localeOptions(
    value: string,
    locale: LocaleArgument | undefined,
): { value: string; locale?: LocaleArgument } {
    if (locale === undefined) {
        return { value };
    }
    return { value, locale };
}

/**
 * Builds title-case options.
 *
 * @param value - The text to convert.
 * @param locale - Locale already checked, or `undefined` when omitted.
 * @param style - The title-case style.
 * @param smallWords - Caller list, or `undefined` for the style default.
 * @returns Options for `toTitleCase`.
 */
function titleOptions(
    value: string,
    locale: LocaleArgument | undefined,
    style: TitleCaseStyle,
    smallWords: readonly string[] | undefined,
): ToTitleCaseOptions {
    const options: ToTitleCaseOptions = { value, style };
    if (locale !== undefined) {
        options.locale = locale;
    }
    if (smallWords !== undefined) {
        options.smallWords = smallWords;
    }
    return options;
}

/**
 * Sends `value` to the converter named by `caseName`.
 *
 * @param value - The text to convert.
 * @param options - Checked options.
 * @returns The converted string.
 */
function dispatchCase(
    value: string,
    options: {
        caseName: CaseName;
        locale: LocaleArgument | undefined;
        keepConsecutiveUppercase: boolean;
        mergeAmbiguousCharacters: boolean;
        style: TitleCaseStyle;
        smallWords: readonly string[] | undefined;
    },
): string | undefined {
    const programming = programmingCaseOptions(
        value,
        options.locale,
        options.keepConsecutiveUppercase,
        options.mergeAmbiguousCharacters,
    );
    const withLocale = localeOptions(value, options.locale);
    if (options.caseName === "camel") {
        return toCamelCase(programming);
    }
    if (options.caseName === "pascal") {
        return toPascalCase(programming);
    }
    if (options.caseName === "snake") {
        return toSnakeCase(programming);
    }
    if (options.caseName === "kebab") {
        return toKebabCase(programming);
    }
    if (options.caseName === "constant") {
        return toConstantCase(programming);
    }
    if (options.caseName === "dot") {
        return toDotCase(programming);
    }
    if (options.caseName === "path") {
        return toPathCase(programming);
    }
    if (options.caseName === "train") {
        return toTrainCase(programming);
    }
    if (options.caseName === "pascal-snake") {
        return toPascalSnakeCase(programming);
    }
    if (options.caseName === "sentence") {
        return toSentenceCase(withLocale);
    }
    if (options.caseName === "title") {
        return toTitleCase(
            titleOptions(
                value,
                options.locale,
                options.style,
                options.smallWords,
            ),
        );
    }
    if (options.caseName === "capital") {
        return toCapitalCase(withLocale);
    }
    if (options.caseName === "no-case") {
        return toNoCase(withLocale);
    }
    if (options.caseName === "lower") {
        return toLowerCase(withLocale);
    }
    return toUpperCase(withLocale);
}
