import { describeReceived } from "../utils/describe-received.utils.js";
import { readOptionsCall } from "../utils/read-call.utils.js";
import type { HashAlgorithm, IsHashOptions } from "./is-hash.types.js";

export type { HashAlgorithm, IsHashOptions } from "./is-hash.types.js";

const hashLengthByAlgorithm: Readonly<Record<HashAlgorithm, number>> = {
    md5: 32,
    sha1: 40,
    sha224: 56,
    sha256: 64,
    sha384: 96,
    sha512: 128,
    "sha3-256": 64,
    "sha3-512": 128,
};

const algorithmNames = Object.keys(hashLengthByAlgorithm);

/**
 * Reports whether `value` is a hexadecimal digest of `algorithm`.
 *
 * The check is the length and the hexadecimal alphabet only. It does not
 * hash an input. `algorithm` is required. A call that is not an options
 * object returns `false`. A non-string `value` returns `false`. The input
 * is not changed.
 *
 * @param options - `value` and the required `algorithm`.
 * @returns `true` when `value` has that digest's length and is hexadecimal.
 * @throws {@link TypeError} When `algorithm` is present and is not a string.
 * @throws {@link RangeError} When `algorithm` is missing or is not a known name.
 * @example
 * isHash({ value: "ab".repeat(16), algorithm: "md5" });
 */
export function isHash(options: IsHashOptions): boolean;
/**
 * @param value - A bare string. A digest needs `algorithm`, so this returns `false`.
 * @returns `false`.
 */
export function isHash(value: string): boolean;
/**
 * @param value - Any value. An options object is required for a match.
 * @returns `true` when `value` is a digest of the given algorithm.
 */
export function isHash(value: unknown): boolean {
    const resolved = readOptionsCall(value, (record) => ({
        algorithm: readHashAlgorithm(record.algorithm),
    }));
    if (resolved === undefined || typeof resolved.record.value !== "string") {
        return false;
    }
    const length = hashLengthByAlgorithm[resolved.options.algorithm];
    return new RegExp(`^[0-9A-Fa-f]{${length}}$`, "u").test(
        resolved.record.value,
    );
}

/**
 * Reads the required digest name.
 *
 * @param value - The option value.
 * @returns A known algorithm name, in lowercase.
 * @throws {@link TypeError} When `value` is present and is not a string.
 * @throws {@link RangeError} When `value` is missing or is not a known name.
 */
function readHashAlgorithm(value: unknown): HashAlgorithm {
    if (value === undefined) {
        throw new RangeError(
            `algorithm is required. Expected one of ${algorithmNames.join(", ")}.`,
        );
    }
    if (typeof value !== "string") {
        throw new TypeError(
            `algorithm must be a string. Received ${describeReceived(value)}.`,
        );
    }
    const normalized = value.toLowerCase();
    if (!Object.hasOwn(hashLengthByAlgorithm, normalized)) {
        throw new RangeError(
            `algorithm must be one of ${algorithmNames.join(", ")}. Received ${JSON.stringify(value)}.`,
        );
    }
    return normalized as HashAlgorithm;
}
