/** Integer digits of a finite number and how many decimal places they use. */
interface DecimalParts {
    digits: bigint;
    scale: number;
}

const decimalTextPattern = /^(-?)(\d+)(?:\.(\d+))?(?:e([+-]?\d+))?$/i;

/**
 * Reads the shortest decimal JavaScript prints for `value`.
 *
 * Returns `undefined` when `value` is not finite. `-0` is zero at scale 0.
 */
function readDecimal(value: number): DecimalParts | undefined {
    if (!Number.isFinite(value)) {
        return undefined;
    }
    if (Object.is(value, -0)) {
        return { digits: 0n, scale: 0 };
    }
    const match = decimalTextPattern.exec(value.toString());
    if (match === null) {
        return undefined;
    }
    const signText = match[1];
    const whole = match[2];
    const fraction = match[3] ?? "";
    const exponentText = match[4];
    if (whole === undefined) {
        return undefined;
    }
    const sign = signText === "-" ? -1n : 1n;
    const exponent = exponentText === undefined ? 0 : Number(exponentText);
    return {
        digits: sign * BigInt(`${whole}${fraction}`),
        scale: fraction.length - exponent,
    };
}

/**
 * Turns decimal digits back into a number.
 *
 * Returns `undefined` when the digits are not a finite double.
 */
function decimalToNumber(digits: bigint, scale: number): number | undefined {
    const negative = digits < 0n;
    const text = (negative ? -digits : digits).toString();
    let body: string;
    if (scale > 0) {
        const padded = text.padStart(scale + 1, "0");
        const pointIndex = padded.length - scale;
        body = `${padded.slice(0, pointIndex)}.${padded.slice(pointIndex)}`;
    } else if (scale < 0) {
        body = `${text}${"0".repeat(-scale)}`;
    } else {
        body = text;
    }
    const parsed = Number(`${negative ? "-" : ""}${body}`);
    if (!Number.isFinite(parsed)) {
        return undefined;
    }
    if (digits === 0n && negative) {
        return -0;
    }
    return parsed;
}

/**
 * Adds the decimal forms of two finite numbers.
 *
 * `0.1 + 0.2` is `0.3`. Returns `undefined` when either value is not finite
 * or the sum is not a finite double.
 */
export function addDecimal(first: number, second: number): number | undefined {
    const left = readDecimal(first);
    const right = readDecimal(second);
    if (left === undefined || right === undefined) {
        return undefined;
    }
    return decimalToNumber(
        align(left.digits, left.scale, right.scale) +
            align(right.digits, right.scale, left.scale),
        Math.max(left.scale, right.scale),
    );
}

/**
 * Subtracts the decimal form of `second` from `first`.
 */
export function subtractDecimal(
    first: number,
    second: number,
): number | undefined {
    return addDecimal(first, second === 0 ? 0 : -second);
}

/**
 * Multiplies the decimal forms of two finite numbers.
 */
export function multiplyDecimal(
    first: number,
    second: number,
): number | undefined {
    const left = readDecimal(first);
    const right = readDecimal(second);
    if (left === undefined || right === undefined) {
        return undefined;
    }
    return decimalToNumber(
        left.digits * right.digits,
        left.scale + right.scale,
    );
}

/**
 * Divides the decimal form of `first` by `second`.
 *
 * Returns `undefined` when `second` is zero or either value is not finite.
 * A result that is not a short decimal is rounded to 15 fractional digits
 * with ties away from zero, then trailing zeros are removed.
 */
export function divideDecimal(
    first: number,
    second: number,
): number | undefined {
    if (!Number.isFinite(first) || !Number.isFinite(second) || second === 0) {
        return undefined;
    }
    const left = readDecimal(first);
    const right = readDecimal(second);
    if (left === undefined || right === undefined || right.digits === 0n) {
        return undefined;
    }
    const extraPlaces = 15;
    const dividend = left.digits * 10n ** BigInt(extraPlaces);
    const divisor = right.digits < 0n ? -right.digits : right.digits;
    const signedDividend = right.digits < 0n ? -dividend : dividend;
    const negative = signedDividend < 0n;
    const absoluteDividend = negative ? -signedDividend : signedDividend;
    let quotient = absoluteDividend / divisor;
    const remainder = absoluteDividend % divisor;
    if (remainder * 2n >= divisor) {
        quotient += 1n;
    }
    const scale = extraPlaces + left.scale - right.scale;
    return decimalToNumber(negative ? -quotient : quotient, scale);
}

/**
 * Shifts `digits` so they share `targetScale`.
 */
function align(digits: bigint, scale: number, otherScale: number): bigint {
    const targetScale = Math.max(scale, otherScale);
    return digits * 10n ** BigInt(targetScale - scale);
}
