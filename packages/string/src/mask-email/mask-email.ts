import {
    readBoolean,
    readInteger,
    readOptionalString,
} from "../utils/assertions.utils.js";
import { describeReceived } from "../utils/describe-received.utils.js";
import { readStringCall } from "../utils/read-call.utils.js";
import { splitIntoUnits } from "../utils/units.utils.js";
import type { MaskEmailOptions } from "./mask-email.types.js";

/**
 * Settings after defaults and checks have been applied.
 */
interface MaskEmailSettings {
    /** The first grapheme of the mask text. */
    mask: string;
    /** Visible graphemes at the start of the local part. */
    unmaskedLocalLength: number;
    /** Whether the domain is copied unchanged. */
    unmaskedDomain: boolean;
}

/**
 * Masks the local part of an email address.
 *
 * `jane@example.com` becomes `j***@example.com` with the defaults. The
 * address is split on the first `@`. When there is no `@`, the result is
 * `undefined`. A local part shorter than `unmaskedLocalLength` stays
 * visible. The input is not changed.
 *
 * @param value - An email address.
 * @returns The masked address, or `undefined` when there is no `@`.
 * @example
 * maskEmail("jane@example.com");
 */
export function maskEmail(value: string): string | undefined;
/**
 * @param options - `value` plus the mask and how much of the address stays visible.
 * @returns The masked address, or `undefined` when `value` is not a string or has no `@`.
 * @throws {@link TypeError} When an option has the wrong type.
 * @throws {@link RangeError} When `unmaskedLocalLength` is negative or not an integer, or `maskCharacter` is empty.
 */
export function maskEmail(options: MaskEmailOptions): string | undefined;
/**
 * @param valueOrOptions - A string, or one flat options object.
 * @returns The masked address, or `undefined` when the text is not a usable address.
 */
export function maskEmail(valueOrOptions: unknown): string | undefined {
    const resolved = readStringCall(valueOrOptions, readMaskEmailOptions);
    if (resolved === undefined) {
        return undefined;
    }
    return maskAddress(resolved.value, resolved.options);
}

/**
 * @param record - The options object, or an empty object for a bare string.
 * @returns Checked mask settings.
 */
function readMaskEmailOptions(
    record: Record<string, unknown>,
): MaskEmailSettings {
    return {
        mask: readMaskGrapheme(record.maskCharacter),
        unmaskedLocalLength: readInteger(
            "unmaskedLocalLength",
            record.unmaskedLocalLength,
            0,
            undefined,
            1,
        ),
        unmaskedDomain: readBoolean(
            "unmaskedDomain",
            record.unmaskedDomain,
            true,
        ),
    };
}

/**
 * @param value - The `maskCharacter` option.
 * @returns The first grapheme of the mask.
 */
function readMaskGrapheme(value: unknown): string {
    const maskCharacter = readOptionalString("maskCharacter", value) ?? "*";
    if (maskCharacter.length === 0) {
        throw new RangeError(
            `maskCharacter must not be empty. Received ${describeReceived(maskCharacter)}.`,
        );
    }
    return splitIntoUnits(maskCharacter, "grapheme")[0] ?? "*";
}

/**
 * @param value - The address.
 * @param settings - Checked mask settings.
 * @returns The masked address, or `undefined` when there is no `@`.
 */
function maskAddress(
    value: string,
    settings: MaskEmailSettings,
): string | undefined {
    const atIndex = value.indexOf("@");
    if (atIndex === -1) {
        return undefined;
    }
    const local = value.slice(0, atIndex);
    const domain = value.slice(atIndex + 1);
    return `${maskLocal(local, settings)}@${maskDomain(domain, settings)}`;
}

/**
 * @param local - The text before the first `@`.
 * @param settings - Checked mask settings.
 * @returns The local part, masked when it is long enough.
 */
function maskLocal(local: string, settings: MaskEmailSettings): string {
    const graphemes = splitIntoUnits(local, "grapheme");
    if (graphemes.length <= settings.unmaskedLocalLength) {
        return local;
    }
    const visible = graphemes.slice(0, settings.unmaskedLocalLength).join("");
    const maskedCount = graphemes.length - settings.unmaskedLocalLength;
    return `${visible}${settings.mask.repeat(maskedCount)}`;
}

/**
 * @param domain - The text after the first `@`.
 * @param settings - Checked mask settings.
 * @returns The domain, copied or masked.
 */
function maskDomain(domain: string, settings: MaskEmailSettings): string {
    if (settings.unmaskedDomain) {
        return domain;
    }
    let masked = "";
    for (const grapheme of splitIntoUnits(domain, "grapheme")) {
        masked += grapheme === "." ? grapheme : settings.mask;
    }
    return masked;
}
