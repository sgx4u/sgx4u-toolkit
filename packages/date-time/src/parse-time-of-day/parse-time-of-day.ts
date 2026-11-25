import type { TimeOfDay } from "../types/time.types.js";
import { typeError } from "../utils/error.utils.js";

const timeExpression =
    /^(?<hour>\d{1,2}):(?<minute>\d{2})(?::(?<second>\d{2})(?:\.(?<fraction>\d{1,3}))?)?(?:\s*(?<period>a\.?m\.?|p\.?m\.?))?$/i;

/**
 * Parses a time of day.
 *
 * Accepted forms are `H:mm`, `HH:mm`, `HH:mm:ss`, `HH:mm:ss.SSS`, and
 * 12-hour forms with `am` or `pm`. The marker may have any case, an
 * optional space, and optional dots. `24:00` is not a time of day.
 *
 * @param value - The candidate text.
 * @returns The time, or `undefined` when the text does not match.
 * @throws {@link TypeError} When `value` is not a string.
 * @example
 * parseTimeOfDay("9:30 pm"); // { hour: 21, minute: 30, second: 0, millisecond: 0 }
 */
export function parseTimeOfDay(value: string): TimeOfDay | undefined {
    if (typeof value !== "string") {
        throw typeError("value", "a string", value);
    }
    const groups = timeExpression.exec(value.trim())?.groups;
    if (groups === undefined) {
        return undefined;
    }
    let hour = Number(groups.hour);
    const minute = Number(groups.minute);
    const second = groups.second === undefined ? 0 : Number(groups.second);
    const millisecond =
        groups.fraction === undefined
            ? 0
            : Number(groups.fraction.padEnd(3, "0"));
    if (minute > 59 || second > 59) {
        return undefined;
    }
    const period = groups.period?.toLowerCase().replaceAll(".", "");
    if (period === "am" || period === "pm") {
        if (hour < 1 || hour > 12) {
            return undefined;
        }
        if (period === "am") {
            hour = hour === 12 ? 0 : hour;
        } else {
            hour = hour === 12 ? 12 : hour + 12;
        }
    } else if (hour > 23) {
        return undefined;
    }
    return { hour, minute, second, millisecond };
}
