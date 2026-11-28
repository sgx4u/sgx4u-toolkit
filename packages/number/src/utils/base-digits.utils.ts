const digitAlphabet = "0123456789abcdefghijklmnopqrstuvwxyz";

/**
 * Integer digits of `value` in `base`. A bigint keeps every digit.
 * A number outside the safe-integer range returns `undefined`.
 */
export function digitsFromInteger(
    value: number | bigint,
    base: number,
    prefix: boolean,
    minimumDigits: number,
): string | undefined {
    assertBase(base);
    if (!Number.isInteger(minimumDigits) || minimumDigits < 1) {
        throw new RangeError(
            `minimumDigits must be an integer of at least 1. Received ${String(minimumDigits)}.`,
        );
    }
    let integer: bigint;
    let negative: boolean;
    if (typeof value === "bigint") {
        negative = value < 0n;
        integer = negative ? -value : value;
    } else if (Number.isSafeInteger(value)) {
        negative = Object.is(value, -0) ? false : value < 0;
        integer = BigInt(Math.abs(value));
    } else {
        return undefined;
    }
    let digits = integer === 0n ? "0" : "";
    const baseInteger = BigInt(base);
    let remaining = integer;
    while (remaining > 0n) {
        const index = Number(remaining % baseInteger);
        const digit = digitAlphabet[index];
        if (digit === undefined) {
            return undefined;
        }
        digits = digit + digits;
        remaining /= baseInteger;
    }
    if (digits.length < minimumDigits) {
        digits = digits.padStart(minimumDigits, "0");
    }
    const marker = prefix ? basePrefix(base) : "";
    return `${negative ? "-" : ""}${marker}${digits}`;
}

/**
 * Parses digits in `base`. A safe integer is returned as a number, otherwise
 * as a bigint. Invalid digits return `undefined`.
 */
export function integerFromDigits(
    value: string,
    base: number,
): number | bigint | undefined {
    assertBase(base);
    const trimmed = value.trim();
    const match = /^([+-])?(?:0([box]))?([0-9a-z]+)$/i.exec(trimmed);
    if (match === null) {
        return undefined;
    }
    const sign = match[1] === "-" ? -1n : 1n;
    const marker = match[2]?.toLowerCase();
    const digits = match[3];
    if (digits === undefined) {
        return undefined;
    }
    if (marker !== undefined && markerBase(marker) !== base) {
        return undefined;
    }
    let integer = 0n;
    const baseInteger = BigInt(base);
    for (const character of digits) {
        const index = digitAlphabet.indexOf(character.toLowerCase());
        if (index < 0 || index >= base) {
            return undefined;
        }
        integer = integer * baseInteger + BigInt(index);
    }
    integer *= sign;
    if (
        integer >= BigInt(Number.MIN_SAFE_INTEGER) &&
        integer <= BigInt(Number.MAX_SAFE_INTEGER)
    ) {
        return Number(integer);
    }
    return integer;
}

function assertBase(base: number): void {
    if (!Number.isInteger(base) || base < 2 || base > 36) {
        throw new RangeError(
            `base must be an integer from 2 to 36. Received ${String(base)}.`,
        );
    }
}

function basePrefix(base: number): string {
    if (base === 2) {
        return "0b";
    }
    if (base === 8) {
        return "0o";
    }
    if (base === 16) {
        return "0x";
    }
    return "";
}

function markerBase(marker: string): number | undefined {
    if (marker === "b") {
        return 2;
    }
    if (marker === "o") {
        return 8;
    }
    if (marker === "x") {
        return 16;
    }
    return undefined;
}
