import { slugifyTransliterated } from "../slugify-transliterated/slugify-transliterated.js";
import type { SlugifyTransliteratedOptions } from "../slugify-transliterated/slugify-transliterated.types.js";
import { transliterate } from "../transliterate-text/transliterate.js";
import type { TransliterateOptions } from "../transliterate-text/transliterate.types.js";
import type { StringConfig } from "../types/string-config.types.js";
import {
    isOptionsRecord,
    readBoolean,
    readOptionalString,
} from "../utils/assertions.utils.js";
import { describeReceived } from "../utils/describe-received.utils.js";
import type { LocaleArgument } from "../utils/locale.utils.js";
import { readLocale } from "../utils/locale.utils.js";
import type { TransliterateToolkit } from "./create-transliterate.types.js";

export type {
    StringConfig,
    TransliterateToolkit,
} from "./create-transliterate.types.js";

const stringConfigKeys = new Set<string>([
    "locale",
    "unit",
    "keepConsecutiveUppercase",
    "mergeAmbiguousCharacters",
    "titleCaseStyle",
    "smallWords",
    "slugifySeparator",
    "slugifyLowerCase",
    "truncationOmission",
    "truncationLocation",
    "maskCharacter",
    "unmaskedStartLength",
    "unmaskedEndLength",
    "collatorSensitivity",
    "numericCollation",
    "normalizeForm",
    "wordsPerMinute",
    "templatePattern",
]);

/**
 * Bound slug settings.
 */
interface BoundSlug {
    /** Locale from the config, or `undefined` for the plain map. */
    locale: LocaleArgument | undefined;
    /** Separator from `slugifySeparator`. */
    separator: string;
    /** Lowercase flag from `slugifyLowerCase`. */
    lowerCase: boolean;
}

/**
 * Returns transliterate and slug functions bound to `config`.
 *
 * `locale`, `slugifySeparator`, and `slugifyLowerCase` become the defaults.
 * A later call can override them. Other known {@link StringConfig} keys are
 * accepted and ignored so one config object can be shared. Any key that is
 * not on {@link StringConfig} throws `RangeError`. Two instances do not
 * share mutable state.
 *
 * @param config - Defaults for locale and slugify. Omitted means `-` and lowercase.
 * @returns Bound `transliterate` and `slugifyTransliterated` functions.
 * @throws {@link TypeError} When `config` is not an object or a used option has the wrong type.
 * @throws {@link RangeError} When a key is unknown or `locale` is empty.
 * @example
 * createTransliterate({ locale: "de", slugifySeparator: "_" });
 */
export function createTransliterate(
    config: StringConfig = {},
): TransliterateToolkit {
    if (!isOptionsRecord(config)) {
        throw new TypeError(
            `config must be an object. Received ${describeReceived(config)}.`,
        );
    }
    for (const key of Object.keys(config)) {
        if (!stringConfigKeys.has(key)) {
            throw new RangeError(
                `Unknown string config key ${JSON.stringify(key)}.`,
            );
        }
    }
    const bound: BoundSlug = {
        locale: readLocale(config.locale),
        separator:
            readOptionalString("slugifySeparator", config.slugifySeparator) ??
            "-",
        lowerCase: readBoolean(
            "slugifyLowerCase",
            config.slugifyLowerCase,
            true,
        ),
    };
    const toolkit: TransliterateToolkit = {
        transliterate(valueOrOptions: unknown): string | undefined {
            return transliterateBound(valueOrOptions, bound.locale);
        },
        slugifyTransliterated(valueOrOptions: unknown): string | undefined {
            return slugifyBound(valueOrOptions, bound);
        },
    };
    return toolkit;
}

/**
 * Applies the bound locale unless the call passes its own.
 *
 * @param valueOrOptions - A string, or `value` plus `locale`.
 * @param boundLocale - Locale from the config.
 * @returns The mapped text, or `undefined` when the text is not a string.
 */
function transliterateBound(
    valueOrOptions: unknown,
    boundLocale: LocaleArgument | undefined,
): string | undefined {
    if (typeof valueOrOptions === "string") {
        return transliterate(withLocale(valueOrOptions, boundLocale));
    }
    if (!isOptionsRecord(valueOrOptions)) {
        return transliterate(valueOrOptions as string);
    }
    const locale = Object.hasOwn(valueOrOptions, "locale")
        ? readLocale(valueOrOptions.locale)
        : boundLocale;
    if (typeof valueOrOptions.value !== "string") {
        return undefined;
    }
    return transliterate(withLocale(valueOrOptions.value, locale));
}

/**
 * Applies the bound slug settings unless the call overrides them.
 *
 * @param valueOrOptions - A string, or `value` plus slug options.
 * @param bound - Separator, lowercase, and locale from the config.
 * @returns The slug, or `undefined` when the text is not a string.
 */
function slugifyBound(
    valueOrOptions: unknown,
    bound: BoundSlug,
): string | undefined {
    if (typeof valueOrOptions === "string") {
        return slugifyTransliterated(slugOptions(valueOrOptions, bound));
    }
    if (!isOptionsRecord(valueOrOptions)) {
        return slugifyTransliterated(valueOrOptions as string);
    }
    const locale = Object.hasOwn(valueOrOptions, "locale")
        ? readLocale(valueOrOptions.locale)
        : bound.locale;
    const separator = Object.hasOwn(valueOrOptions, "separator")
        ? (readOptionalString("separator", valueOrOptions.separator) ?? "")
        : bound.separator;
    const lowerCase = Object.hasOwn(valueOrOptions, "lowerCase")
        ? readBoolean("lowerCase", valueOrOptions.lowerCase, bound.lowerCase)
        : bound.lowerCase;
    if (typeof valueOrOptions.value !== "string") {
        return undefined;
    }
    return slugifyTransliterated(
        slugOptions(valueOrOptions.value, { locale, separator, lowerCase }),
    );
}

/**
 * Builds transliterate options, omitting an undefined locale.
 *
 * @param value - The text.
 * @param locale - The locale to apply, or `undefined`.
 * @returns Options whose `locale` is present only when it was set.
 */
function withLocale(
    value: string,
    locale: LocaleArgument | undefined,
): TransliterateOptions {
    if (locale === undefined) {
        return { value };
    }
    return { value, locale };
}

/**
 * Builds slug options, omitting an undefined locale.
 *
 * @param value - The text.
 * @param bound - Separator, lowercase, and locale.
 * @returns Options for `slugifyTransliterated`.
 */
function slugOptions(
    value: string,
    bound: BoundSlug,
): SlugifyTransliteratedOptions {
    const options: SlugifyTransliteratedOptions = {
        value,
        separator: bound.separator,
        lowerCase: bound.lowerCase,
    };
    if (bound.locale !== undefined) {
        options.locale = bound.locale;
    }
    return options;
}
