import type { ByteStandardSetting } from "../types/byte-standard.types.js";
import { parseBytesText } from "../utils/parse-text.utils.js";

/**
 * Parses a byte or bit size into a count of bytes. `"1.34 kB"` is `1340` and `"1 KiB"` is `1024`. Bit units are divided by 8.
 *
 * @throws {@link RangeError} When `standard` is not `"SI"`, `"IEC"`, or `"auto"`.
 *
 * @example
 * parseBytes({ value: "1.34 kB" });
 */
export function parseBytes(parameters: {
    value: string;
    standard?: "SI" | "IEC" | "auto";
}): number | undefined {
    const standard: ByteStandardSetting = parameters.standard ?? "auto";
    return parseBytesText(parameters.value, standard);
}
