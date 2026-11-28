import type { ByteStandard } from "../types/byte-standard.types.js";
import { formatByteSize } from "../utils/format-bytes.utils.js";

/**
 * Formats a byte count, or a bit count when `bits` is true. SI steps by 1000 and IEC by 1024. A unit the runtime cannot name falls back to an English symbol such as `KiB`.
 *
 * @example
 * formatBytes({ value: 1340 });
 */
export function formatBytes(parameters: {
    value: number;
    locale?: string | readonly string[];
    standard?: ByteStandard;
    bits?: boolean;
    signed?: boolean;
    maximumFractionDigits?: number;
}): string | undefined {
    return formatByteSize({
        value: parameters.value,
        standard: parameters.standard ?? "SI",
        bits: parameters.bits ?? false,
        signed: parameters.signed ?? false,
        ...(parameters.locale === undefined
            ? {}
            : { locale: parameters.locale }),
        ...(parameters.maximumFractionDigits === undefined
            ? {}
            : { maximumFractionDigits: parameters.maximumFractionDigits }),
    });
}
