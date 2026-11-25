/**
 * Reports whether a locale uses a 12-hour or 24-hour clock.
 *
 * @param locale - A BCP 47 tag. Omit it to use the runtime locale.
 * @returns `"h11"`, `"h12"`, `"h23"`, or `"h24"`.
 * @example
 * getLocaleHourCycle("en-US"); // "h12"
 */
export function getLocaleHourCycle(
    locale?: string,
): "h11" | "h12" | "h23" | "h24" {
    const hourCycle = new Intl.DateTimeFormat(locale, {
        hour: "numeric",
    }).resolvedOptions().hourCycle;
    if (
        hourCycle === "h11" ||
        hourCycle === "h12" ||
        hourCycle === "h23" ||
        hourCycle === "h24"
    ) {
        return hourCycle;
    }
    return "h23";
}
