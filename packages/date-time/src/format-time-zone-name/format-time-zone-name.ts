import { resolveDateInput, resolveNow } from "../utils/date-input.utils.js";
import { rangeError } from "../utils/error.utils.js";
import { assertTimeZoneName } from "../utils/time-zone.utils.js";
import type { FormatTimeZoneNameOptions } from "./format-time-zone-name.types.js";

const styles = [
    "long",
    "short",
    "shortOffset",
    "longOffset",
    "shortGeneric",
    "longGeneric",
] as const;

/**
 * Returns the localized name of a time zone at an instant.
 *
 * @param timeZone - An IANA name or a fixed offset.
 * @param options - `style` defaults to `"long"` and `at` to the current time.
 * @returns Text such as `India Standard Time` or `GMT+5:30`.
 * @throws {@link RangeError} When the zone or style is invalid.
 * @example
 * formatTimeZoneName("Asia/Kolkata", { locale: "en-US", style: "longOffset", at: "2026-01-01T00:00:00Z" }); // "GMT+05:30"
 */
export function formatTimeZoneName(
    timeZone: string,
    options?: FormatTimeZoneNameOptions,
): string {
    const zone = assertTimeZoneName(timeZone, "timeZone");
    const style = options?.style ?? "long";
    if (!(styles as readonly string[]).includes(style)) {
        throw rangeError("style", "a time zone name style", style);
    }
    const instant =
        options?.at === undefined
            ? resolveNow(undefined)
            : resolveDateInput(options.at, "at");
    const part = new Intl.DateTimeFormat(options?.locale, {
        timeZone: zone,
        timeZoneName: style,
    })
        .formatToParts(instant)
        .find((item) => item.type === "timeZoneName");
    return part?.value ?? zone;
}
