import { readBoolean } from "../utils/assertions.utils.js";
import { describeReceived } from "../utils/describe-received.utils.js";
import { readStringCall } from "../utils/read-call.utils.js";
import type { UUIDVersion } from "../types/string-unit.types.js";
import type { IsUUIDOptions } from "./is-uuid.types.js";

export type { IsUUIDOptions, UUIDVersion } from "./is-uuid.types.js";

const nilUuid = "00000000-0000-0000-0000-000000000000";
const maxUuid = "ffffffff-ffff-ffff-ffff-ffffffffffff";
const uuidExpression =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/u;
const urnPrefix = "urn:uuid:";

/**
 * Resolved UUID options after defaults are applied.
 */
interface UUIDCheckOptions {
    /** Version selector, including `"any"`, `"nil"`, and `"max"`. */
    version: UUIDVersion;
    /** Whether `urn:uuid:` may appear in front of the identifier. */
    allowURN: boolean;
}

/**
 * Reports whether `value` is an RFC 9562 UUID.
 *
 * The text form is 8-4-4-4-12 hexadecimal digits with hyphens. `"any"`
 * accepts versions 1 through 8 when the variant nibble is `8`, `9`, `a`,
 * or `b`, and also accepts the nil UUID and the max UUID. A version
 * number checks that nibble. `"nil"` and `"max"` check those exact
 * values. Braces are rejected. A non-string returns `false`. The input
 * is not changed.
 *
 * @param value - Any value. Only a string can match.
 * @returns `true` when `value` is a UUID of the selected kind.
 * @throws {@link TypeError} When an option has the wrong type.
 * @throws {@link RangeError} When `version` is not 1 through 8, `"any"`, `"nil"`, or `"max"`. Version `0` throws.
 * @example
 * isUUID("123e4567-e89b-42d3-a456-426614174000");
 */
export function isUUID(value: unknown): boolean;
/**
 * @param options - `value`, `version`, and `allowURN`.
 * @returns `true` when `value` is a UUID of the selected kind.
 */
export function isUUID(options: IsUUIDOptions): boolean;
/**
 * @param valueOrOptions - A string, or `value` plus options.
 * @returns `true` when `value` is a UUID of the selected kind.
 */
export function isUUID(valueOrOptions: unknown): boolean {
    const resolved = readStringCall(valueOrOptions, readUUIDOptions);
    if (resolved === undefined) {
        return false;
    }
    return matchesUUID(resolved.value, resolved.options);
}

/**
 * Reads UUID options and applies the defaults.
 *
 * @param record - The flat options object, or an empty object for a bare string.
 * @returns Options with `version` and `allowURN` set.
 * @throws {@link TypeError} When an option has the wrong type.
 * @throws {@link RangeError} When `version` is not a supported value.
 */
function readUUIDOptions(record: Record<string, unknown>): UUIDCheckOptions {
    return {
        version: readUUIDVersion(record.version),
        allowURN: readBoolean("allowURN", record.allowURN, false),
    };
}

/**
 * Reads the `version` option.
 *
 * @param value - The option value.
 * @returns A supported version selector.
 * @throws {@link TypeError} When `value` is present and is not a number or a string.
 * @throws {@link RangeError} When the version is not supported. `0` and `9` throw.
 */
function readUUIDVersion(value: unknown): UUIDVersion {
    if (value === undefined || value === "any") {
        return "any";
    }
    if (value === "nil" || value === "max") {
        return value;
    }
    if (
        typeof value === "number" &&
        Number.isInteger(value) &&
        value >= 1 &&
        value <= 8
    ) {
        return value as UUIDVersion;
    }
    if (typeof value === "number" || typeof value === "string") {
        throw new RangeError(
            `version must be 1 through 8, "any", "nil", or "max". Received ${describeReceived(value)}.`,
        );
    }
    throw new TypeError(
        `version must be a number or a string. Received ${describeReceived(value)}.`,
    );
}

/**
 * Whether `value` is a UUID for `options`.
 *
 * @param value - Candidate text.
 * @param options - Version and URN flag.
 * @returns `true` when the text matches.
 */
function matchesUUID(value: string, options: UUIDCheckOptions): boolean {
    const identifier = stripUUIDPrefix(value, options.allowURN);
    if (identifier === undefined) {
        return false;
    }
    const normalized = identifier.toLowerCase();
    if (!uuidExpression.test(normalized)) {
        return false;
    }
    if (options.version === "nil") {
        return normalized === nilUuid;
    }
    if (options.version === "max") {
        return normalized === maxUuid;
    }
    if (options.version === "any") {
        if (normalized === nilUuid || normalized === maxUuid) {
            return true;
        }
        return hasVersion(normalized, undefined) && hasVariant(normalized);
    }
    return hasVersion(normalized, options.version) && hasVariant(normalized);
}

/**
 * Removes an optional `urn:uuid:` prefix.
 *
 * @param value - Candidate text.
 * @param allowURN - Whether the prefix is accepted.
 * @returns The identifier, or `undefined` when a prefix is present and forbidden.
 */
function stripUUIDPrefix(value: string, allowURN: boolean): string | undefined {
    if (value.toLowerCase().startsWith(urnPrefix)) {
        if (!allowURN) {
            return undefined;
        }
        return value.slice(urnPrefix.length);
    }
    return value;
}

/**
 * Whether the version nibble matches.
 *
 * @param identifier - A lowercase UUID.
 * @param version - The required nibble, or `undefined` to allow 1 through 8.
 * @returns `true` when the nibble at index 14 matches.
 */
function hasVersion(identifier: string, version: number | undefined): boolean {
    const nibble = identifier.charAt(14);
    if (version === undefined) {
        return nibble >= "1" && nibble <= "8";
    }
    return nibble === String(version);
}

/**
 * Whether the variant nibble is the RFC 9562 value `8`, `9`, `a`, or `b`.
 *
 * @param identifier - A lowercase UUID.
 * @returns `true` when the nibble at index 19 is a variant nibble.
 */
function hasVariant(identifier: string): boolean {
    const nibble = identifier.charAt(19);
    return nibble === "8" || nibble === "9" || nibble === "a" || nibble === "b";
}
