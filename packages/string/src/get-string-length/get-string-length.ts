import { readStringCall } from "../utils/read-call.utils.js";
import {
    readLocaleOption,
    readUnit,
    splitIntoUnits,
} from "../utils/units.utils.js";
import type { GetStringLengthOptions } from "./get-string-length.types.js";

/**
 * Counts `value` in the chosen unit.
 *
 * The default unit is a grapheme, so a family emoji counts as one. The
 * input is not changed.
 *
 * @param options - `value` and an optional `unit`.
 * @returns The count, or `undefined` when `value` is not a string.
 * @throws {@link RangeError} When `unit` is not a known unit.
 * @throws {@link TypeError} When `unit` is present and is not a string.
 * @example
 * getStringLength({ value: "a😀" });
 */
export function getStringLength(
    options: GetStringLengthOptions,
): number | undefined {
    const resolved = readStringCall(options, (record) => ({
        unit: readUnit(record.unit),
        locale: readLocaleOption(record),
    }));
    if (resolved === undefined) {
        return undefined;
    }
    return splitIntoUnits(
        resolved.value,
        resolved.options.unit,
        resolved.options.locale,
    ).length;
}
