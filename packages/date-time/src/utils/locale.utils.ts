import { rangeError, typeError } from "./error.utils.js";

/**
 * Guards a locale passed by a caller or by `createDateTime`.
 *
 * An omitted locale uses the runtime default and does not throw.
 *
 * @param locale - A BCP 47 tag, a list of tags, or `undefined`.
 * @throws {@link TypeError} When `locale` is not a string or a list of strings.
 * @throws {@link RangeError} When a tag is not a BCP 47 language tag.
 */
export function assertLocale(
    locale: string | readonly string[] | undefined,
): void {
    if (locale === undefined) {
        return;
    }
    if (typeof locale === "string") {
        assertLocaleTag(locale);
        return;
    }
    if (!Array.isArray(locale) || locale.length === 0) {
        throw typeError("locale", "a BCP 47 language tag", locale);
    }
    for (const tag of locale) {
        if (typeof tag !== "string") {
            throw typeError("locale", "a BCP 47 language tag", locale);
        }
        assertLocaleTag(tag);
    }
}

/**
 * @param tag - One BCP 47 tag.
 * @throws {@link RangeError} When `Intl` rejects the tag.
 */
function assertLocaleTag(tag: string): void {
    if (tag === "") {
        throw rangeError("locale", "a BCP 47 language tag", tag);
    }
    try {
        Intl.getCanonicalLocales(tag);
    } catch {
        throw rangeError("locale", "a BCP 47 language tag", tag);
    }
}
