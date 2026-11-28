import { readDateInput, resolveNow } from "../utils/date-input.utils.js";
import { rangeError } from "../utils/error.utils.js";
import { assertTimeZoneName } from "../utils/time-zone.utils.js";
import type { FormatTimeZoneNameParams } from "./format-time-zone-name.types.js";

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
 * @param params - `timeZone` is required. `style` defaults to `"long"` and `at` to the current time.
 * @returns Text such as `India Standard Time` or `GMT+5:30`, or `undefined` when `at` is not usable.
 * @throws {@link RangeError} When the zone or style is invalid.
 * @example
 * formatTimeZoneName({
 *   timeZone: "Asia/Kolkata",
 *   locale: "en-US",
 *   style: "longOffset",
 *   at: "2026-01-01T00:00:00Z",
 * }); // "GMT+05:30"
 */
export function formatTimeZoneName({
    timeZone,
    locale,
    style = "long",
    at,
}: FormatTimeZoneNameParams): string | undefined {
    const zone = assertTimeZoneName(timeZone, "timeZone");
    if (!(styles as readonly string[]).includes(style)) {
        throw rangeError("style", "a time zone name style", style);
    }
    const instant =
        at === undefined ? resolveNow(undefined) : readDateInput(at, zone);
    if (instant === undefined) {
        return undefined;
    }
    const part = new Intl.DateTimeFormat(locale, {
        timeZone: zone,
        timeZoneName: style,
    })
        .formatToParts(instant)
        .find((item) => item.type === "timeZoneName");
    return part?.value ?? zone;
}
