import { localeForIntl, type LocaleArgument } from "./locale.utils.js";

type SegmenterGranularity = "grapheme" | "word" | "sentence";

let segmenterCache: Map<string, Intl.Segmenter> | undefined;
let collatorCache: Map<string, Intl.Collator> | undefined;
let pluralRulesCache: Map<string, Intl.PluralRules> | undefined;
let listFormatCache: Map<string, Intl.ListFormat> | undefined;
let numberFormatCache: Map<string, Intl.NumberFormat> | undefined;

/**
 * Stable cache key for a locale argument.
 *
 * @param locale - Locale already validated, or `undefined` for the runtime default.
 * @returns A string that distinguishes the runtime default from each locale list.
 */
function localeKey(locale: LocaleArgument | undefined): string {
    if (locale === undefined) {
        return "*";
    }
    if (typeof locale === "string") {
        return locale;
    }
    return locale.join("\u0000");
}

/**
 * Returns a segmenter for `granularity` and `locale`, creating it on first use.
 *
 * The cache is the only segmenter cache in this package. It is not filled
 * while the module loads.
 *
 * @param granularity - `"grapheme"`, `"word"`, or `"sentence"`.
 * @param locale - Locale passed through to `Intl.Segmenter`.
 * @returns A cached segmenter.
 */
export function getSegmenter(
    granularity: SegmenterGranularity,
    locale?: LocaleArgument,
): Intl.Segmenter {
    const key = `${granularity}\u0000${localeKey(locale)}`;
    const cache = (segmenterCache ??= new Map());
    const cached = cache.get(key);
    if (cached !== undefined) {
        return cached;
    }
    const created = new Intl.Segmenter(localeForIntl(locale), { granularity });
    cache.set(key, created);
    return created;
}

/**
 * Returns a collator, creating it on first use.
 *
 * @param locale - Locale passed through to `Intl.Collator`.
 * @param sensitivity - Collator sensitivity.
 * @param numeric - When `true`, digit runs compare by numeric value.
 * @returns A cached collator.
 */
export function getCollator(
    locale: LocaleArgument | undefined,
    sensitivity: Intl.CollatorOptions["sensitivity"],
    numeric: boolean,
): Intl.Collator {
    const key = `${localeKey(locale)}\u0000${sensitivity ?? ""}\u0000${numeric ? "1" : "0"}`;
    const cache = (collatorCache ??= new Map());
    const cached = cache.get(key);
    if (cached !== undefined) {
        return cached;
    }
    const created = new Intl.Collator(localeForIntl(locale), {
        sensitivity,
        numeric,
    });
    cache.set(key, created);
    return created;
}

/**
 * Returns plural rules, creating them on first use.
 *
 * @param locale - Locale passed through to `Intl.PluralRules`.
 * @param type - `"cardinal"` or `"ordinal"`.
 * @returns Cached plural rules.
 */
export function getPluralRules(
    locale: LocaleArgument | undefined,
    type: "cardinal" | "ordinal",
): Intl.PluralRules {
    const key = `${localeKey(locale)}\u0000${type}`;
    const cache = (pluralRulesCache ??= new Map());
    const cached = cache.get(key);
    if (cached !== undefined) {
        return cached;
    }
    const created = new Intl.PluralRules(localeForIntl(locale), { type });
    cache.set(key, created);
    return created;
}

/**
 * Returns a list formatter, creating it on first use.
 *
 * @param locale - Locale passed through to `Intl.ListFormat`.
 * @param type - List type.
 * @param style - List style.
 * @returns A cached list formatter.
 */
export function getListFormat(
    locale: LocaleArgument | undefined,
    type: "conjunction" | "disjunction" | "unit",
    style: "long" | "short" | "narrow",
): Intl.ListFormat {
    const key = `${localeKey(locale)}\u0000${type}\u0000${style}`;
    const cache = (listFormatCache ??= new Map());
    const cached = cache.get(key);
    if (cached !== undefined) {
        return cached;
    }
    const created = new Intl.ListFormat(localeForIntl(locale), { type, style });
    cache.set(key, created);
    return created;
}

/**
 * Returns a number formatter, creating it on first use.
 *
 * @param locale - Locale passed through to `Intl.NumberFormat`.
 * @returns A cached number formatter.
 */
export function getNumberFormat(
    locale: LocaleArgument | undefined,
): Intl.NumberFormat {
    const key = localeKey(locale);
    const cache = (numberFormatCache ??= new Map());
    const cached = cache.get(key);
    if (cached !== undefined) {
        return cached;
    }
    const created = new Intl.NumberFormat(localeForIntl(locale));
    cache.set(key, created);
    return created;
}
