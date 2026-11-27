import { matchesLenientYesOrNo } from "./lenient-yes-no.utils.js";
import type { ResolvedParseSettings } from "./resolve-parse-settings.utils.js";

/**
 * Recognizes `value` with settings that have already been validated.
 *
 * A primitive boolean is returned unchanged. The numbers `0` and `1` are
 * booleans here, and `-0` is `0`, so it is `false`. Strings use the word
 * sets. Anything else, including boxed booleans, is unrecognized.
 * `fallback` is not applied here.
 *
 * @param value - The candidate from the caller.
 * @param settings - Word sets from `resolveParseSettings`.
 * @returns `true`, `false`, or `undefined` when `value` is not a token.
 */
export function readBooleanToken(
    value: unknown,
    settings: ResolvedParseSettings,
): boolean | undefined {
    if (typeof value === "boolean") {
        return value;
    }
    if (typeof value === "number" && (value === 0 || value === 1)) {
        return value === 1;
    }
    if (typeof value === "string") {
        return readStringToken(value, settings);
    }
    return undefined;
}

/**
 * Matches a string against the English, locale, and custom sets.
 *
 * @param value - The candidate string, before trim.
 * @param settings - Word sets and fold flags.
 * @returns The matched boolean, or `undefined`.
 */
function readStringToken(
    value: string,
    settings: ResolvedParseSettings,
): boolean | undefined {
    const comparable = settings.trim ? value.trim() : value;
    if (comparable.length === 0) {
        return undefined;
    }

    const englishForm = settings.caseSensitive
        ? comparable
        : comparable.toLowerCase();
    if (settings.truthy.has(englishForm)) {
        return true;
    }
    if (settings.falsy.has(englishForm)) {
        return false;
    }

    const localizedForm = localizedFold(comparable, settings);
    if (settings.localeTruthy.has(localizedForm)) {
        return true;
    }
    if (settings.localeFalsy.has(localizedForm)) {
        return false;
    }
    if (settings.customTruthy.has(localizedForm)) {
        return true;
    }
    if (settings.customFalsy.has(localizedForm)) {
        return false;
    }

    if (settings.lenient) {
        return matchesLenientYesOrNo(englishForm);
    }
    return undefined;
}

/**
 * Folds `comparable` the way locale and custom words were stored.
 *
 * @param comparable - The candidate, already trimmed when trim is on.
 * @param settings - Case and locale flags.
 * @returns The lookup key for the locale and custom sets.
 */
function localizedFold(
    comparable: string,
    settings: ResolvedParseSettings,
): string {
    if (settings.caseSensitive) {
        return comparable;
    }
    if (settings.locale !== undefined) {
        return comparable.toLocaleLowerCase(settings.locale);
    }
    return comparable.toLowerCase();
}
