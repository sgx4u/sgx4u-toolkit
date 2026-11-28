import { readBoolean, readInteger } from "../utils/assertions.utils.js";
import { readStringCall } from "../utils/read-call.utils.js";
import type { IsStrongPasswordOptions } from "./is-strong-password.types.js";

export type { IsStrongPasswordOptions } from "./is-strong-password.types.js";

/**
 * Resolved password-policy options after defaults are applied.
 */
interface PasswordCheckOptions {
    /** Minimum code-point count. */
    minimumLength: number;
    /** Whether a lowercase letter is required. */
    requireLowercase: boolean;
    /** Whether an uppercase letter is required. */
    requireUppercase: boolean;
    /** Whether a decimal digit is required. */
    requireNumber: boolean;
    /** Whether a symbol is required. */
    requireSymbol: boolean;
}

/**
 * Reports whether `value` meets a password policy.
 *
 * The default policy is at least 8 code points, with one lowercase letter,
 * one uppercase letter, one number, and one symbol. A symbol is a
 * character that is not a letter, a number, or whitespace. Every
 * requirement can be turned off, and the minimum length can be changed.
 * Passing this check is not a promise that the password is hard to guess.
 * A non-string returns `false`. The input is not changed.
 *
 * @param value - Any value. Only a string can match.
 * @returns `true` when `value` meets the selected policy.
 * @throws {@link TypeError} When an option has the wrong type.
 * @throws {@link RangeError} When `minimumLength` is less than 1 or is not an integer.
 * @example
 * isStrongPassword("Sup3r-secret");
 */
export function isStrongPassword(value: unknown): boolean;
/**
 * @param options - `value` and the policy flags.
 * @returns `true` when `value` meets the selected policy.
 */
export function isStrongPassword(options: IsStrongPasswordOptions): boolean;
/**
 * @param valueOrOptions - A string, or `value` plus policy flags.
 * @returns `true` when `value` meets the selected policy.
 */
export function isStrongPassword(valueOrOptions: unknown): boolean {
    const resolved = readStringCall(valueOrOptions, readPasswordOptions);
    if (resolved === undefined) {
        return false;
    }
    return meetsPasswordPolicy(resolved.value, resolved.options);
}

/**
 * Reads password-policy options and applies the defaults.
 *
 * @param record - The flat options object, or an empty object for a bare string.
 * @returns The policy with every flag set.
 * @throws {@link TypeError} When an option has the wrong type.
 * @throws {@link RangeError} When `minimumLength` is less than 1 or is not an integer.
 */
function readPasswordOptions(
    record: Record<string, unknown>,
): PasswordCheckOptions {
    return {
        minimumLength: readInteger(
            "minimumLength",
            record.minimumLength,
            1,
            undefined,
            8,
        ),
        requireLowercase: readBoolean(
            "requireLowercase",
            record.requireLowercase,
            true,
        ),
        requireUppercase: readBoolean(
            "requireUppercase",
            record.requireUppercase,
            true,
        ),
        requireNumber: readBoolean("requireNumber", record.requireNumber, true),
        requireSymbol: readBoolean("requireSymbol", record.requireSymbol, true),
    };
}

/**
 * Whether `value` meets `options`.
 *
 * @param value - The password text.
 * @param options - The policy with defaults applied.
 * @returns `true` when every selected requirement holds.
 */
function meetsPasswordPolicy(
    value: string,
    options: PasswordCheckOptions,
): boolean {
    if (Array.from(value).length < options.minimumLength) {
        return false;
    }
    if (options.requireLowercase && !/\p{Ll}/u.test(value)) {
        return false;
    }
    if (options.requireUppercase && !/\p{Lu}/u.test(value)) {
        return false;
    }
    if (options.requireNumber && !/\p{Nd}/u.test(value)) {
        return false;
    }
    if (options.requireSymbol && !/[^\p{L}\p{N}\p{Z}\s]/u.test(value)) {
        return false;
    }
    return true;
}
