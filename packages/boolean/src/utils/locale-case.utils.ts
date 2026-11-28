/**
 * Lowercases `text` with `locale`.
 *
 * `toLocaleLowerCase` throws `RangeError` when `locale` is structurally
 * invalid, such as `""` or `fr_FR`. That tag is ordinary data, so the
 * result falls back to `toLowerCase()`.
 *
 * @param text - The string to fold.
 * @param locale - A BCP 47 tag from the caller.
 * @returns The folded string.
 */
export function localeLowerCase(text: string, locale: string): string {
    try {
        return text.toLocaleLowerCase(locale);
    } catch {
        return text.toLowerCase();
    }
}

/**
 * Uppercases `text` with `locale`.
 *
 * A structurally invalid tag uses `toUpperCase()` instead of throwing.
 *
 * @param text - The string to fold.
 * @param locale - A BCP 47 tag from the caller.
 * @returns The folded string.
 */
export function localeUpperCase(text: string, locale: string): string {
    try {
        return text.toLocaleUpperCase(locale);
    } catch {
        return text.toUpperCase();
    }
}
