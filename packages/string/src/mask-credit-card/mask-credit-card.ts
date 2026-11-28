import { readInteger, readOptionalString } from "../utils/assertions.utils.js";
import { describeReceived } from "../utils/describe-received.utils.js";
import { readStringCall } from "../utils/read-call.utils.js";
import { splitIntoUnits } from "../utils/units.utils.js";
import type { MaskCreditCardOptions } from "./mask-credit-card.types.js";

const digitExpression = /^\p{Nd}$/u;

/**
 * Settings after defaults and checks have been applied.
 */
interface MaskCreditCardSettings {
    /** The first grapheme of the mask text. */
    mask: string;
    /** Digits left visible at the end. */
    unmaskedEndLength: number;
}

/**
 * Masks the digits of a card number and keeps separators in place.
 *
 * Spaces and hyphens stay. Any other non-digit stays as it is. The last
 * `unmaskedEndLength` digits stay visible. A value with no digits returns
 * `undefined`. The input is not changed.
 *
 * @param value - A card number.
 * @returns The masked number, or `undefined` when it contains no digits.
 * @example
 * maskCreditCard("4111 1111 1111 1111");
 */
export function maskCreditCard(value: string): string | undefined;
/**
 * @param options - `value` plus the mask and how many ending digits stay visible.
 * @returns The masked number, or `undefined` when `value` is not a string or has no digits.
 * @throws {@link TypeError} When an option has the wrong type.
 * @throws {@link RangeError} When `unmaskedEndLength` is negative or not an integer, or `maskCharacter` is empty.
 */
export function maskCreditCard(
    options: MaskCreditCardOptions,
): string | undefined;
/**
 * @param valueOrOptions - A string, or one flat options object.
 * @returns The masked number, or `undefined` when the text has no digits.
 */
export function maskCreditCard(valueOrOptions: unknown): string | undefined {
    const resolved = readStringCall(valueOrOptions, readMaskCreditCardOptions);
    if (resolved === undefined) {
        return undefined;
    }
    return maskDigits(resolved.value, resolved.options);
}

/**
 * @param record - The options object, or an empty object for a bare string.
 * @returns Checked mask settings.
 */
function readMaskCreditCardOptions(
    record: Record<string, unknown>,
): MaskCreditCardSettings {
    return {
        mask: readMaskGrapheme(record.maskCharacter),
        unmaskedEndLength: readInteger(
            "unmaskedEndLength",
            record.unmaskedEndLength,
            0,
            undefined,
            4,
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
 * @param value - The card text.
 * @param settings - Checked mask settings.
 * @returns The masked text, or `undefined` when there are no digits.
 */
function maskDigits(
    value: string,
    settings: MaskCreditCardSettings,
): string | undefined {
    const graphemes = splitIntoUnits(value, "grapheme");
    const digitIndexes: number[] = [];
    for (let index = 0; index < graphemes.length; index += 1) {
        if (digitExpression.test(graphemes[index] ?? "")) {
            digitIndexes.push(index);
        }
    }
    if (digitIndexes.length === 0) {
        return undefined;
    }
    const visibleDigits = new Set(
        digitIndexes.slice(
            Math.max(0, digitIndexes.length - settings.unmaskedEndLength),
        ),
    );
    let masked = "";
    for (let index = 0; index < graphemes.length; index += 1) {
        const grapheme = graphemes[index] ?? "";
        if (digitExpression.test(grapheme) && !visibleDigits.has(index)) {
            masked += settings.mask;
            continue;
        }
        masked += grapheme;
    }
    return masked;
}
