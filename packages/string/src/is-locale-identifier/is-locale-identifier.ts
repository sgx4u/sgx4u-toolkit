/**
 * Reports whether `value` is a locale identifier `Intl` accepts.
 *
 * The check is `Intl.getCanonicalLocales`. An empty string, `en_US` with
 * an underscore, and text that is not a language tag return `false`.
 * `en-US` returns `true`. A non-string returns `false`. The function does
 * not throw for those inputs. The input is not changed.
 *
 * @param value - Any value. Only a string can match.
 * @returns `true` when `Intl.getCanonicalLocales` accepts `value`.
 * @example
 * isLocaleIdentifier("en-US");
 */
export function isLocaleIdentifier(value: unknown): boolean {
    if (typeof value !== "string" || value.length === 0) {
        return false;
    }
    try {
        const canonical = Intl.getCanonicalLocales(value);
        return canonical.length > 0;
    } catch {
        return false;
    }
}
