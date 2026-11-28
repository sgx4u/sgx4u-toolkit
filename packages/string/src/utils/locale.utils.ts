import { describeReceived } from "./describe-received.utils.js";

/** A locale argument accepted by `Intl`. */
export type LocaleArgument = string | readonly string[];

/**
 * Reads a locale option.
 *
 * An omitted locale stays `undefined` so `Intl` uses the runtime locale on
 * that call. A locale `Intl` does not recognize is kept: `Intl` falls back.
 * An empty string is a programming mistake.
 *
 * @param value - The option value.
 * @returns The locale, or `undefined` when it was omitted.
 * @throws {@link TypeError} When `value` is present and is not a string or a list of strings.
 * @throws {@link RangeError} When a string is empty, or the list is empty or contains an empty string.
 */
export function readLocale(value: unknown): LocaleArgument | undefined {
    if (value === undefined) {
        return undefined;
    }
    if (typeof value === "string") {
        if (value.length === 0) {
            throw new RangeError(
                'locale must be a non-empty string. Received "".',
            );
        }
        return value;
    }
    if (Array.isArray(value)) {
        if (value.length === 0) {
            throw new RangeError(
                "locale must contain at least one language tag. Received an empty array.",
            );
        }
        const locales: string[] = [];
        for (const entry of value) {
            if (typeof entry !== "string") {
                throw new TypeError(
                    `locale must be a string or a list of strings. Received ${describeReceived(entry)} in the list.`,
                );
            }
            if (entry.length === 0) {
                throw new RangeError(
                    'locale must not contain an empty string. Received "".',
                );
            }
            locales.push(entry);
        }
        return locales;
    }
    throw new TypeError(
        `locale must be a string or a list of strings. Received ${describeReceived(value)}.`,
    );
}

/**
 * Copies a locale into the mutable list `Intl` constructors accept.
 *
 * @param locale - A locale already checked by `readLocale`, or `undefined`.
 * @returns The same locale in a form `Intl` accepts.
 */
export function localeForIntl(
    locale: LocaleArgument | undefined,
): Intl.LocalesArgument | undefined {
    if (locale === undefined || typeof locale === "string") {
        return locale;
    }
    return [...locale];
}
