import { matchesIPv4 } from "../is-ipv4/is-ipv4.js";
import { matchesIPv6 } from "../is-ipv6/is-ipv6.js";
import { readBoolean } from "../utils/assertions.utils.js";
import { readStringCall } from "../utils/read-call.utils.js";
import type { IsEmailOptions } from "./is-email.types.js";

export type { IsEmailOptions } from "./is-email.types.js";

const maximumAddressLength = 254;
const maximumLocalLength = 64;

/**
 * Resolved email options after defaults are applied.
 */
interface EmailCheckOptions {
    /** Whether `Name <user@domain>` is accepted. */
    allowDisplayName: boolean;
    /** Whether the domain needs a dotted top-level label. */
    requireTopLevelDomain: boolean;
    /** Whether `[IPv4]` and `[IPv6]` domains are accepted. */
    allowIPDomain: boolean;
    /** Whether the local part may contain Unicode letters and numbers. */
    allowUTF8LocalPart: boolean;
}

const asciiAtom = "[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]";
const unicodeAtom = "[\\p{L}\\p{N}!#$%&'*+/=?^_`{|}~-]";
const asciiLocalExpression = new RegExp(
    `^${asciiAtom}+(?:\\.${asciiAtom}+)*$`,
    "u",
);
const unicodeLocalExpression = new RegExp(
    `^${unicodeAtom}+(?:\\.${unicodeAtom}+)*$`,
    "u",
);
const domainLabelExpression =
    /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?$/u;
const topLevelExpression = /^\p{L}{2,63}$/u;

/**
 * Reports whether `value` is one practical email address.
 *
 * This is not an RFC 5322 parser. Comments, quoted local parts, and
 * unquoted spaces are rejected even when the RFC would allow them. The
 * default shape is one address with no display name. The domain has a dot
 * and a top-level label of at least two letters. The address is at most
 * 254 characters and the local part is at most 64. A non-string returns
 * `false`. The input is not changed.
 *
 * @param value - Any value. Only a string can match.
 * @returns `true` when `value` matches the selected address shape.
 * @throws {@link TypeError} When an option is present and has the wrong type.
 * @example
 * isEmail("user@example.com");
 */
export function isEmail(value: unknown): boolean;
/**
 * @param options - `value` plus display-name, domain, and local-part flags.
 * @returns `true` when `value` matches the selected address shape.
 */
export function isEmail(options: IsEmailOptions): boolean;
/**
 * @param valueOrOptions - A string, or `value` plus options.
 * @returns `true` when the address matches.
 */
export function isEmail(valueOrOptions: unknown): boolean {
    const resolved = readStringCall(valueOrOptions, readEmailOptions);
    if (resolved === undefined) {
        return false;
    }
    return matchesEmail(resolved.value, resolved.options);
}

/**
 * Reads email options and applies the defaults.
 *
 * @param record - The flat options object, or an empty object for a bare string.
 * @returns Options with every flag set.
 * @throws {@link TypeError} When a flag is present and is not a boolean.
 */
function readEmailOptions(record: Record<string, unknown>): EmailCheckOptions {
    return {
        allowDisplayName: readBoolean(
            "allowDisplayName",
            record.allowDisplayName,
            false,
        ),
        requireTopLevelDomain: readBoolean(
            "requireTopLevelDomain",
            record.requireTopLevelDomain,
            true,
        ),
        allowIPDomain: readBoolean(
            "allowIPDomain",
            record.allowIPDomain,
            false,
        ),
        allowUTF8LocalPart: readBoolean(
            "allowUTF8LocalPart",
            record.allowUTF8LocalPart,
            true,
        ),
    };
}

/**
 * Whether `value` is an address, optionally wrapped as a display name.
 *
 * @param value - The original input.
 * @param options - Flags with defaults applied.
 * @returns `true` when the address shape matches.
 */
function matchesEmail(value: string, options: EmailCheckOptions): boolean {
    if (value.length === 0) {
        return false;
    }
    let address = value;
    if (value.includes("<") || value.includes(">")) {
        if (!options.allowDisplayName) {
            return false;
        }
        const peeled = addressInsideDisplayName(value);
        if (peeled === undefined) {
            return false;
        }
        address = peeled;
    }
    return matchesBareAddress(address, options);
}

/**
 * Reads the address from `Name <user@domain>`.
 *
 * @param value - Text that contains an angle bracket.
 * @returns The address, or `undefined` when the wrapper is not that shape.
 */
function addressInsideDisplayName(value: string): string | undefined {
    if (!value.endsWith(">")) {
        return undefined;
    }
    const openIndex = value.lastIndexOf("<");
    if (openIndex <= 0) {
        return undefined;
    }
    const displayName = value.slice(0, openIndex).trim();
    const address = value.slice(openIndex + 1, -1).trim();
    if (displayName.length === 0 || address.length === 0) {
        return undefined;
    }
    if (/[\r\n<>]/u.test(displayName)) {
        return undefined;
    }
    return address;
}

/**
 * Whether `address` is a single `local@domain` value.
 *
 * @param address - The address with any display name already removed.
 * @param options - Flags with defaults applied.
 * @returns `true` when the local part and domain match.
 */
function matchesBareAddress(
    address: string,
    options: EmailCheckOptions,
): boolean {
    if (
        address.length === 0 ||
        address.length > maximumAddressLength ||
        /\s/u.test(address)
    ) {
        return false;
    }
    const atIndex = address.indexOf("@");
    if (atIndex <= 0 || atIndex !== address.lastIndexOf("@")) {
        return false;
    }
    const localPart = address.slice(0, atIndex);
    const domain = address.slice(atIndex + 1);
    if (localPart.length > maximumLocalLength) {
        return false;
    }
    const localExpression = options.allowUTF8LocalPart
        ? unicodeLocalExpression
        : asciiLocalExpression;
    if (!localExpression.test(localPart)) {
        return false;
    }
    return matchesEmailDomain(
        domain,
        options.requireTopLevelDomain,
        options.allowIPDomain,
    );
}

/**
 * Whether `domain` is a hostname or an allowed IP literal.
 *
 * @param domain - The text after `@`.
 * @param requireTopLevelDomain - When `true`, a dotted letter top-level label is required.
 * @param allowIPDomain - When `true`, `[IPv4]` and `[IPv6]` are accepted.
 * @returns `true` when the domain matches.
 */
function matchesEmailDomain(
    domain: string,
    requireTopLevelDomain: boolean,
    allowIPDomain: boolean,
): boolean {
    if (domain.startsWith("[") && domain.endsWith("]")) {
        if (!allowIPDomain) {
            return false;
        }
        const literal = domain.slice(1, -1);
        return matchesIPv4(literal) || matchesIPv6(literal);
    }
    if (
        domain.length === 0 ||
        domain.length > 253 ||
        domain.startsWith(".") ||
        domain.endsWith(".") ||
        domain.includes("..")
    ) {
        return false;
    }
    const labels = domain.split(".");
    if (requireTopLevelDomain && labels.length < 2) {
        return false;
    }
    for (let index = 0; index < labels.length; index += 1) {
        const label = labels[index] ?? "";
        const isLast = index === labels.length - 1;
        if (isLast && requireTopLevelDomain) {
            if (!topLevelExpression.test(label)) {
                return false;
            }
            continue;
        }
        if (!domainLabelExpression.test(label)) {
            return false;
        }
    }
    return true;
}
