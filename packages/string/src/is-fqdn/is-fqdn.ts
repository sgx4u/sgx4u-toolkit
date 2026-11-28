import { readBoolean } from "../utils/assertions.utils.js";
import { readStringCall } from "../utils/read-call.utils.js";
import type { IsFQDNOptions } from "./is-fqdn.types.js";

export type { IsFQDNOptions } from "./is-fqdn.types.js";

/**
 * Resolved FQDN options after defaults are applied.
 */
interface FQDNCheckOptions {
    /** Whether a dotted top-level label is required. */
    requireTopLevelDomain: boolean;
    /** Whether `_` may appear in a label. */
    allowUnderscore: boolean;
    /** Whether a leading `*.` label is accepted. */
    allowWildcard: boolean;
}

const ordinaryLabelExpression = /^[\p{L}0-9](?:[\p{L}0-9-]{0,61}[\p{L}0-9])?$/u;
const underscoreLabelExpression =
    /^[\p{L}0-9_](?:[\p{L}0-9_-]{0,61}[\p{L}0-9_])?$/u;

/**
 * Reports whether `value` is a hostname, not a full URL.
 *
 * Labels are at most 63 characters and the whole name is at most 253.
 * A scheme, path, port, space, or at-sign is rejected. The default rules
 * require a top-level label and reject underscores and wildcards. A
 * non-string returns `false`. The input is not changed.
 *
 * @param value - Any value. Only a string can match.
 * @returns `true` when `value` is a hostname.
 * @throws {@link TypeError} When an option is present and is not a boolean.
 * @example
 * isFQDN("example.com");
 */
export function isFQDN(value: unknown): boolean;
/**
 * @param options - `value` plus top-level, underscore, and wildcard flags.
 * @returns `true` when `value` is a hostname.
 */
export function isFQDN(options: IsFQDNOptions): boolean;
/**
 * @param valueOrOptions - A string, or `value` plus options.
 * @returns `true` when `value` is a hostname.
 */
export function isFQDN(valueOrOptions: unknown): boolean {
    const resolved = readStringCall(valueOrOptions, readFQDNOptions);
    if (resolved === undefined) {
        return false;
    }
    return matchesFQDN(resolved.value, resolved.options);
}

/**
 * Reads FQDN options and applies the defaults.
 *
 * @param record - The flat options object, or an empty object for a bare string.
 * @returns Options with every flag set.
 * @throws {@link TypeError} When a flag is present and is not a boolean.
 */
function readFQDNOptions(record: Record<string, unknown>): FQDNCheckOptions {
    return {
        requireTopLevelDomain: readBoolean(
            "requireTopLevelDomain",
            record.requireTopLevelDomain,
            true,
        ),
        allowUnderscore: readBoolean(
            "allowUnderscore",
            record.allowUnderscore,
            false,
        ),
        allowWildcard: readBoolean(
            "allowWildcard",
            record.allowWildcard,
            false,
        ),
    };
}

/**
 * Whether `value` is a hostname for `options`.
 *
 * @param value - Candidate text.
 * @param options - Flags with defaults applied.
 * @returns `true` when every label matches.
 */
function matchesFQDN(value: string, options: FQDNCheckOptions): boolean {
    if (value.length === 0 || value.length > 253) {
        return false;
    }
    if (/[\s/\\?#@:[\]]/u.test(value)) {
        return false;
    }
    let hostname = value;
    if (hostname.startsWith("*.")) {
        if (!options.allowWildcard) {
            return false;
        }
        hostname = hostname.slice(2);
    }
    if (hostname.includes("*")) {
        return false;
    }
    if (
        hostname.length === 0 ||
        hostname.startsWith(".") ||
        hostname.endsWith(".") ||
        hostname.includes("..")
    ) {
        return false;
    }
    const labels = hostname.split(".");
    if (options.requireTopLevelDomain && labels.length < 2) {
        return false;
    }
    const labelExpression = options.allowUnderscore
        ? underscoreLabelExpression
        : ordinaryLabelExpression;
    for (let index = 0; index < labels.length; index += 1) {
        const label = labels[index] ?? "";
        if (label.length > 63) {
            return false;
        }
        const isLast = index === labels.length - 1;
        if (isLast && options.requireTopLevelDomain) {
            if (!isTopLevelLabel(label)) {
                return false;
            }
            continue;
        }
        if (!labelExpression.test(label)) {
            return false;
        }
    }
    return true;
}

/**
 * Whether `label` can be a top-level domain.
 *
 * @param label - The last hostname label.
 * @returns `true` for at least two letters, or a `xn--` punycode label.
 */
function isTopLevelLabel(label: string): boolean {
    if (/^\p{L}{2,63}$/u.test(label)) {
        return true;
    }
    return /^xn--[\p{L}0-9-]{2,59}$/iu.test(label);
}
