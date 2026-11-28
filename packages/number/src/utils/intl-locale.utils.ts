import type { LocaleNumberSymbols } from "../types/locale-number-symbols.types.js";

const formatterCache = new Map<string, Intl.NumberFormat>();
const pluralCache = new Map<string, Intl.PluralRules>();
const symbolCache = new Map<string, LocaleNumberSymbols>();

/**
 * Throws when `locale` is not a structurally valid locale or locale list.
 *
 * A tag `Intl.getCanonicalLocales` accepts is valid, even when formatting
 * falls back to another locale.
 */
export function assertLocale(
    locale: string | readonly string[],
    argumentName = "locale",
): void {
    try {
        Intl.getCanonicalLocales(localeArgument(locale));
    } catch {
        throw new RangeError(
            `${argumentName} must be a valid locale. Received ${JSON.stringify(locale)}.`,
        );
    }
}

/**
 * Throws when `currency` is not a currency code `Intl` accepts.
 */
export function assertCurrency(
    currency: string,
    locale?: string | readonly string[],
    argumentName = "currency",
): void {
    try {
        new Intl.NumberFormat(localeArgument(locale), {
            style: "currency",
            currency,
        });
    } catch {
        throw new RangeError(
            `${argumentName} must be a valid currency code. Received ${JSON.stringify(currency)}.`,
        );
    }
}

/**
 * Throws when `numberingSystem` is not a supported numbering system.
 */
export function assertNumberingSystem(
    numberingSystem: string,
    argumentName = "numberingSystem",
): void {
    const supported = Intl.supportedValuesOf("numberingSystem");
    if (!supported.includes(numberingSystem)) {
        throw new RangeError(
            `${argumentName} must be a valid numbering system. Received ${JSON.stringify(numberingSystem)}.`,
        );
    }
}

/**
 * Throws when `unit` is not a unit `Intl` can format.
 */
export function assertUnit(
    unit: string,
    locale?: string | readonly string[],
    argumentName = "unit",
): void {
    try {
        new Intl.NumberFormat(localeArgument(locale), { style: "unit", unit });
    } catch {
        throw new RangeError(
            `${argumentName} must be a supported unit. Received ${JSON.stringify(unit)}.`,
        );
    }
}

/**
 * Returns a cached number formatter for `locale` and `options`.
 *
 * The cache is filled on first use. It is not user-visible state.
 */
export function getNumberFormatter(
    locale: string | readonly string[] | undefined,
    options: Intl.NumberFormatOptions,
): Intl.NumberFormat {
    const key = `${localeKey(locale)}|${stableOptionKey(options)}`;
    const cached = formatterCache.get(key);
    if (cached !== undefined) {
        return cached;
    }
    const formatter = new Intl.NumberFormat(localeArgument(locale), options);
    formatterCache.set(key, formatter);
    return formatter;
}

/**
 * Returns cached ordinal or cardinal plural rules for `locale`.
 */
export function getPluralRules(
    locale: string | readonly string[] | undefined,
    type: "cardinal" | "ordinal",
): Intl.PluralRules {
    const key = `${localeKey(locale)}|${type}`;
    const cached = pluralCache.get(key);
    if (cached !== undefined) {
        return cached;
    }
    const rules = new Intl.PluralRules(localeArgument(locale), { type });
    pluralCache.set(key, rules);
    return rules;
}

/**
 * Characters and digits the locale uses for ordinary numbers.
 */
export function readLocaleSymbols(
    locale?: string | readonly string[],
): LocaleNumberSymbols & { digits: readonly string[] } {
    const key = localeKey(locale);
    const cached = symbolCache.get(key);
    const digits = readDigits(locale);
    if (cached !== undefined) {
        return { ...cached, digits };
    }
    const grouped = getNumberFormatter(locale, { useGrouping: true });
    const parts = grouped.formatToParts(1234567.5);
    const signed = getNumberFormatter(locale, {
        signDisplay: "always",
    }).formatToParts(1);
    const percent = getNumberFormatter(locale, {
        style: "percent",
    }).formatToParts(0.25);
    const scientific = getNumberFormatter(locale, {
        notation: "scientific",
    }).formatToParts(1230);
    const symbols: LocaleNumberSymbols = {
        decimal: partValue(parts, "decimal") ?? ".",
        group: partValue(parts, "group") ?? ",",
        plusSign: partValue(signed, "plusSign") ?? "+",
        minusSign:
            partValue(
                getNumberFormatter(locale, {
                    signDisplay: "always",
                }).formatToParts(-1),
                "minusSign",
            ) ?? "-",
        percentSign: partValue(percent, "percentSign") ?? "%",
        infinity:
            partValue(
                grouped.formatToParts(Number.POSITIVE_INFINITY),
                "infinity",
            ) ?? "∞",
        nan: partValue(grouped.formatToParts(Number.NaN), "nan") ?? "NaN",
        exponentSeparator: partValue(scientific, "exponentSeparator") ?? "E",
    };
    symbolCache.set(key, symbols);
    return { ...symbols, digits };
}

/**
 * Resolved language subtag, such as `"en"` or `"de"`.
 */
export function languageOf(locale?: string | readonly string[]): string {
    const resolved = getNumberFormatter(locale, {}).resolvedOptions().locale;
    return new Intl.Locale(resolved).language;
}

/**
 * Copies a readonly locale list into the array shape `Intl` accepts.
 */
export function localeArgument(
    locale: string | readonly string[] | undefined,
): string | string[] | undefined {
    if (locale === undefined) {
        return undefined;
    }
    if (typeof locale === "string") {
        return locale;
    }
    return [...locale];
}

function localeKey(locale: string | readonly string[] | undefined): string {
    if (locale === undefined) {
        return "";
    }
    return typeof locale === "string" ? locale : locale.join("\u0000");
}

function stableOptionKey(options: Intl.NumberFormatOptions): string {
    const keys = Object.keys(options).sort();
    return JSON.stringify(options, keys);
}

function partValue(
    parts: Intl.NumberFormatPart[],
    type: string,
): string | undefined {
    return parts.find((part) => part.type === type)?.value;
}

function readDigits(
    locale: string | readonly string[] | undefined,
): readonly string[] {
    const digits: string[] = [];
    const formatter = getNumberFormatter(locale, { useGrouping: false });
    for (let index = 0; index < 10; index += 1) {
        const integer = formatter
            .formatToParts(index)
            .find((part) => part.type === "integer");
        digits.push(integer?.value ?? String(index));
    }
    return digits;
}
