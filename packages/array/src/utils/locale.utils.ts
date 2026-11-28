import { rangeError, typeError } from "./errors.utils.js";

/** Directions a sort key accepts. */
export const sortDirections = ["ascending", "descending"] as const;

/** Collator sensitivities a sort key accepts. */
export const sortSensitivities = ["base", "accent", "case", "variant"] as const;

/** Where nullish sort keys can be placed. */
export const sortNullPlacements = ["first", "last"] as const;

/**
 * Builds a collator, converting an `Intl` rejection into a range error.
 *
 * @param locale - Tags, or `undefined` for the runtime locale.
 * @param numeric - Whether number-like strings compare as numbers.
 * @param sensitivity - Collator sensitivity.
 * @returns A collator for those options.
 * @throws {@link RangeError} When the locale is not a valid BCP 47 tag.
 */
export function createCollator(
    locale: string | readonly string[] | undefined,
    numeric: boolean,
    sensitivity: "base" | "accent" | "case" | "variant",
): Intl.Collator {
    const localeArgument = Array.isArray(locale) ? [...locale] : locale;
    try {
        return new Intl.Collator(localeArgument, { numeric, sensitivity });
    } catch {
        throw rangeError(
            "locale",
            "a BCP 47 language tag or a list of tags",
            locale,
        );
    }
}

/**
 * Checks a locale by asking `Intl.Collator` to construct it.
 *
 * @param locale - A BCP 47 tag or a list of tags.
 * @throws {@link TypeError} When `locale` is not a string or a list of strings.
 * @throws {@link RangeError} When `Intl` rejects the tag.
 */
export function assertLocale(
    locale: string | readonly string[] | undefined,
): void {
    if (locale === undefined) {
        return;
    }
    if (typeof locale === "string") {
        createCollator(locale, false, "variant");
        return;
    }
    if (
        !Array.isArray(locale) ||
        locale.some((tag) => typeof tag !== "string")
    ) {
        throw typeError(
            "locale",
            "a BCP 47 language tag or a list of tags",
            locale,
        );
    }
    createCollator(locale, false, "variant");
}
