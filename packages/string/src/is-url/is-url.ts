import { matchesIPv4 } from "../is-ipv4/is-ipv4.js";
import { matchesIPv6 } from "../is-ipv6/is-ipv6.js";
import { readBoolean } from "../utils/assertions.utils.js";
import { describeReceived } from "../utils/describe-received.utils.js";
import { readStringCall } from "../utils/read-call.utils.js";
import type { IsURLOptions } from "./is-url.types.js";

export type { IsURLOptions } from "./is-url.types.js";

/**
 * Resolved URL options after defaults are applied.
 */
interface URLCheckOptions {
    /** Protocol names without a trailing colon. */
    protocols: readonly string[];
    /** Whether the input must already contain a protocol. */
    requireProtocol: boolean;
    /** Whether a dotted top-level label is required. */
    requireTopLevelDomain: boolean;
    /** Whether `localhost` is accepted. */
    allowLocalhost: boolean;
    /** Whether a username or password is accepted. */
    allowCredentials: boolean;
    /** Whether an IP hostname is accepted. */
    allowIP: boolean;
}

/**
 * Reports whether `value` is a URL the platform parser accepts.
 *
 * Parsing uses `URL.canParse` and `new URL`. The default protocols are
 * `http` and `https`, a protocol is required, a top-level domain is
 * required, and localhost, IP hosts, and credentials are rejected. When
 * `requireProtocol` is false, a value that does not parse is tried again
 * with `https://` in front, and the protocol allow-list is applied to the
 * URL that parsed. A non-string returns `false`. The input is not changed.
 *
 * @param value - Any value. Only a string can match.
 * @returns `true` when `value` is an allowed URL.
 * @throws {@link TypeError} When an option has the wrong type, including a `protocols` value that is not an array of strings.
 * @throws {@link RangeError} When a protocol name is empty.
 * @example
 * isURL("https://example.com/path");
 */
export function isURL(value: unknown): boolean;
/**
 * @param options - `value` plus protocol and host flags.
 * @returns `true` when `value` is an allowed URL.
 */
export function isURL(options: IsURLOptions): boolean;
/**
 * @param valueOrOptions - A string, or `value` plus options.
 * @returns `true` when `value` is an allowed URL.
 */
export function isURL(valueOrOptions: unknown): boolean {
    const resolved = readStringCall(valueOrOptions, readURLOptions);
    if (resolved === undefined) {
        return false;
    }
    return matchesURL(resolved.value, resolved.options);
}

/**
 * Reads URL options and applies the defaults.
 *
 * @param record - The flat options object, or an empty object for a bare string.
 * @returns Options with every flag set.
 * @throws {@link TypeError} When an option has the wrong type.
 * @throws {@link RangeError} When a protocol name is empty.
 */
function readURLOptions(record: Record<string, unknown>): URLCheckOptions {
    return {
        protocols: readProtocols(record.protocols),
        requireProtocol: readBoolean(
            "requireProtocol",
            record.requireProtocol,
            true,
        ),
        requireTopLevelDomain: readBoolean(
            "requireTopLevelDomain",
            record.requireTopLevelDomain,
            true,
        ),
        allowLocalhost: readBoolean(
            "allowLocalhost",
            record.allowLocalhost,
            false,
        ),
        allowCredentials: readBoolean(
            "allowCredentials",
            record.allowCredentials,
            false,
        ),
        allowIP: readBoolean("allowIP", record.allowIP, false),
    };
}

/**
 * Reads the protocol allow-list.
 *
 * @param value - The option value.
 * @returns Protocol names without a trailing colon.
 * @throws {@link TypeError} When `value` is present and is not an array of strings.
 * @throws {@link RangeError} When a name is empty.
 */
function readProtocols(value: unknown): readonly string[] {
    if (value === undefined) {
        return ["http", "https"];
    }
    if (!Array.isArray(value)) {
        throw new TypeError(
            `protocols must be an array of strings. Received ${describeReceived(value)}.`,
        );
    }
    const protocols: string[] = [];
    for (const entry of value) {
        if (typeof entry !== "string") {
            throw new TypeError(
                `protocols must be an array of strings. Received ${describeReceived(entry)}.`,
            );
        }
        const name = protocolName(entry);
        if (name.length === 0) {
            throw new RangeError(
                `protocols must contain protocol names. Received ${JSON.stringify(entry)}.`,
            );
        }
        protocols.push(name);
    }
    return protocols;
}

/**
 * Lowercases a protocol and removes one trailing colon.
 *
 * @param protocol - A protocol name, with or without a colon.
 * @returns The name used for comparison.
 */
function protocolName(protocol: string): string {
    const lower = protocol.toLowerCase();
    return lower.endsWith(":") ? lower.slice(0, -1) : lower;
}

/**
 * Whether `value` parses as an allowed URL.
 *
 * @param value - Candidate text.
 * @param options - Flags with defaults applied.
 * @returns `true` when the parsed URL is allowed.
 */
function matchesURL(value: string, options: URLCheckOptions): boolean {
    const parsed = parseURL(value, options.requireProtocol);
    if (parsed === undefined) {
        return false;
    }
    if (!options.protocols.includes(protocolName(parsed.protocol))) {
        return false;
    }
    if (
        !options.allowCredentials &&
        (parsed.username.length > 0 || parsed.password.length > 0)
    ) {
        return false;
    }
    return matchesURLHost(parsed.hostname, options);
}

/**
 * Parses `value`, optionally retrying with an `https://` prefix.
 *
 * @param value - Candidate text.
 * @param requireProtocol - When `true`, the `https://` retry is skipped.
 * @returns The parsed URL, or `undefined` when neither attempt parses.
 */
function parseURL(value: string, requireProtocol: boolean): URL | undefined {
    if (URL.canParse(value)) {
        return new URL(value);
    }
    if (!requireProtocol && URL.canParse(`https://${value}`)) {
        return new URL(`https://${value}`);
    }
    return undefined;
}

/**
 * Whether the hostname is allowed.
 *
 * @param hostname - The hostname from the parsed URL. IPv6 keeps its brackets.
 * @param options - Host flags.
 * @returns `true` when the host matches the flags.
 */
function matchesURLHost(hostname: string, options: URLCheckOptions): boolean {
    if (hostname.length === 0) {
        return false;
    }
    const unbracketed =
        hostname.startsWith("[") && hostname.endsWith("]")
            ? hostname.slice(1, -1)
            : hostname;
    if (matchesIPv4(unbracketed) || matchesIPv6(unbracketed)) {
        return options.allowIP;
    }
    if (unbracketed.toLowerCase() === "localhost") {
        return options.allowLocalhost;
    }
    if (!options.requireTopLevelDomain) {
        return true;
    }
    return hasTopLevelDomain(unbracketed);
}

/**
 * Whether `hostname` has a dot and a top-level label.
 *
 * A trailing dot is ignored. The last label may be letters or a punycode
 * label, because the URL parser rewrites international names to punycode.
 *
 * @param hostname - A hostname without brackets.
 * @returns `true` when the last label can be a top-level domain.
 */
function hasTopLevelDomain(hostname: string): boolean {
    const trimmed = hostname.endsWith(".") ? hostname.slice(0, -1) : hostname;
    const labels = trimmed.split(".");
    if (labels.length < 2 || labels.some((label) => label.length === 0)) {
        return false;
    }
    const topLevel = labels[labels.length - 1] ?? "";
    if (/^\p{L}{2,63}$/u.test(topLevel)) {
        return true;
    }
    return /^xn--[a-z0-9-]{2,59}$/iu.test(topLevel);
}
