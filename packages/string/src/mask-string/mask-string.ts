import { readInteger, readOptionalString } from "../utils/assertions.utils.js";
import { describeReceived } from "../utils/describe-received.utils.js";
import { readStringCall } from "../utils/read-call.utils.js";
import { readUnit, splitIntoUnits } from "../utils/units.utils.js";
import type { StringUnit } from "../types/string-unit.types.js";
import type { MaskStringOptions } from "./mask-string.types.js";

/**
 * Settings after defaults and checks have been applied.
 */
interface MaskStringSettings {
    /** The first grapheme of the caller's mask text. */
    mask: string;
    /** Visible units at the start. */
    unmaskedStartLength: number;
    /** Visible units at the end. */
    unmaskedEndLength: number;
    /** Unit used to split `value`. */
    unit: StringUnit;
}

/**
 * Replaces the middle of `value` with a mask character.
 *
 * Each masked unit becomes one grapheme: the first grapheme of
 * `maskCharacter`. When the visible lengths overlap, or their sum is at
 * least the number of units, the whole string is returned. The input is
 * not changed.
 *
 * @param value - Text to mask.
 * @returns The masked text.
 * @example
 * maskString({ value: "secret", unmaskedStartLength: 1, unmaskedEndLength: 1 });
 */
export function maskString(value: string): string;
/**
 * @param options - `value` plus the mask and the visible lengths.
 * @returns The masked text, or `undefined` when `value` is not a string.
 * @throws {@link TypeError} When an option has the wrong type.
 * @throws {@link RangeError} When a length is negative or not an integer, `maskCharacter` is empty, or `unit` is unknown.
 */
export function maskString(options: MaskStringOptions): string | undefined;
/**
 * @param valueOrOptions - A string, or one flat options object.
 * @returns The masked text, or `undefined` when the text is not a string.
 */
export function maskString(valueOrOptions: unknown): string | undefined {
    const resolved = readStringCall(valueOrOptions, readMaskStringOptions);
    if (resolved === undefined) {
        return undefined;
    }
    return maskUnits(resolved.value, resolved.options);
}

/**
 * @param record - The options object, or an empty object for a bare string.
 * @returns Checked mask settings.
 */
function readMaskStringOptions(
    record: Record<string, unknown>,
): MaskStringSettings {
    return {
        mask: readMaskGrapheme(record.maskCharacter),
        unmaskedStartLength: readInteger(
            "unmaskedStartLength",
            record.unmaskedStartLength,
            0,
            undefined,
            0,
        ),
        unmaskedEndLength: readInteger(
            "unmaskedEndLength",
            record.unmaskedEndLength,
            0,
            undefined,
            0,
        ),
        unit: readUnit(record.unit),
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
 * @param value - The text to mask.
 * @param settings - Checked mask settings.
 * @returns The masked text, or `value` when the visible lengths cover it.
 */
function maskUnits(value: string, settings: MaskStringSettings): string {
    const units = splitIntoUnits(value, settings.unit);
    const length = units.length;
    if (settings.unmaskedStartLength + settings.unmaskedEndLength >= length) {
        return value;
    }
    let masked = "";
    for (let index = 0; index < length; index += 1) {
        const visible =
            index < settings.unmaskedStartLength ||
            index >= length - settings.unmaskedEndLength;
        masked += visible ? (units[index] ?? "") : settings.mask;
    }
    return masked;
}
