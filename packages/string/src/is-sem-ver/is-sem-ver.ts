import { readBoolean } from "../utils/assertions.utils.js";
import { readStringCall } from "../utils/read-call.utils.js";
import type { IsSemVerOptions } from "./is-sem-ver.types.js";

export type { IsSemVerOptions } from "./is-sem-ver.types.js";

const semverBody =
    "(0|[1-9]\\d*)\\.(0|[1-9]\\d*)\\.(0|[1-9]\\d*)" +
    "(?:-((?:0|[1-9]\\d*|\\d*[A-Za-z-][0-9A-Za-z-]*)" +
    "(?:\\.(?:0|[1-9]\\d*|\\d*[A-Za-z-][0-9A-Za-z-]*))*))?" +
    "(?:\\+[0-9A-Za-z-]+(?:\\.[0-9A-Za-z-]+)*)?";
const semverExpression = new RegExp(`^${semverBody}$`, "u");
const prefixedExpression = new RegExp(`^[vV]${semverBody}$`, "u");

/**
 * Reports whether `value` is a Semantic Versioning 2.0.0 version.
 *
 * Major, minor, and patch are numeric identifiers without leading zeros.
 * A pre-release and a build suffix are optional. A leading `v` is rejected
 * unless `allowPrefixV` is true. A non-string returns `false`. The input
 * is not changed.
 *
 * @param value - Any value. Only a string can match.
 * @returns `true` when `value` is a semantic version.
 * @throws {@link TypeError} When `allowPrefixV` is present and is not a boolean.
 * @example
 * isSemVer("1.2.3-alpha.1+build.5");
 */
export function isSemVer(value: unknown): boolean;
/**
 * @param options - `value` and optional `allowPrefixV`.
 * @returns `true` when `value` is a semantic version.
 */
export function isSemVer(options: IsSemVerOptions): boolean;
/**
 * @param valueOrOptions - A string, or `value` plus `allowPrefixV`.
 * @returns `true` when `value` is a semantic version.
 */
export function isSemVer(valueOrOptions: unknown): boolean {
    const resolved = readStringCall(valueOrOptions, (record) => ({
        allowPrefixV: readBoolean("allowPrefixV", record.allowPrefixV, false),
    }));
    if (resolved === undefined) {
        return false;
    }
    const expression = resolved.options.allowPrefixV
        ? prefixedExpression
        : semverExpression;
    if (!resolved.options.allowPrefixV) {
        return semverExpression.test(resolved.value);
    }
    return (
        semverExpression.test(resolved.value) || expression.test(resolved.value)
    );
}
