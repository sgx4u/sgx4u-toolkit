/** Sign bit, integer significand, and power of two for a finite number. */
interface FloatComponents {
    sign: 1 | -1;
    significand: bigint;
    exponent: number;
}

const binaryBuffer = new ArrayBuffer(8);
const binaryView = new DataView(binaryBuffer);

/**
 * Splits a finite number into `sign * significand * 2^exponent`.
 *
 * The significand is a non-negative integer. Zero has a zero significand.
 * The caller must not pass a non-finite number.
 */
function readFloatComponents(value: number): FloatComponents {
    binaryView.setFloat64(0, value);
    const bits = binaryView.getBigUint64(0);
    const sign: 1 | -1 = bits >> 63n === 0n ? 1 : -1;
    const storedExponent = Number((bits >> 52n) & 0x7ffn);
    const fraction = bits & 0xfffffffffffffn;
    if (storedExponent === 0) {
        return { sign, significand: fraction, exponent: -1074 };
    }
    return {
        sign,
        significand: fraction | (1n << 52n),
        exponent: storedExponent - 1023 - 52,
    };
}

/**
 * Builds a number from a sign and an integer multiple of a power of two.
 *
 * The result is the nearest double, with ties rounded to even. A magnitude
 * that overflows becomes signed infinity. A magnitude that underflows
 * becomes signed zero.
 */
function numberFromScaledInteger(
    sign: 1 | -1,
    magnitude: bigint,
    exponent: number,
): number {
    if (magnitude === 0n) {
        return sign === -1 ? -0 : 0;
    }
    const bitLength = magnitude.toString(2).length;
    const highestBit = exponent + bitLength - 1;
    if (highestBit > 1023) {
        return sign === -1
            ? Number.NEGATIVE_INFINITY
            : Number.POSITIVE_INFINITY;
    }
    if (highestBit < -1022) {
        return subnormalFromScaledInteger(sign, magnitude, exponent);
    }
    const droppedBitCount = bitLength - 53;
    let significand = magnitude;
    let finalExponent = highestBit;
    if (droppedBitCount > 0) {
        const dropped = significand & ((1n << BigInt(droppedBitCount)) - 1n);
        significand >>= BigInt(droppedBitCount);
        const halfway = 1n << BigInt(droppedBitCount - 1);
        const roundUp =
            dropped > halfway ||
            (dropped === halfway && (significand & 1n) === 1n);
        if (roundUp) {
            significand += 1n;
            if (significand === 1n << 53n) {
                significand >>= 1n;
                finalExponent += 1;
            }
        }
    } else if (droppedBitCount < 0) {
        significand <<= BigInt(-droppedBitCount);
    }
    if (finalExponent > 1023) {
        return sign === -1
            ? Number.NEGATIVE_INFINITY
            : Number.POSITIVE_INFINITY;
    }
    const fraction = significand & ((1n << 52n) - 1n);
    const storedExponent = BigInt(finalExponent + 1023);
    const signBit = sign === -1 ? 1n << 63n : 0n;
    binaryView.setBigUint64(0, signBit | (storedExponent << 52n) | fraction);
    return binaryView.getFloat64(0);
}

/**
 * Rounds a value smaller than the smallest normal onto the subnormal grid.
 */
function subnormalFromScaledInteger(
    sign: 1 | -1,
    magnitude: bigint,
    exponent: number,
): number {
    const shift = exponent + 1074;
    let integer: bigint;
    if (shift >= 0) {
        integer = magnitude << BigInt(shift);
    } else {
        const droppedBitCount = -shift;
        const dropped = magnitude & ((1n << BigInt(droppedBitCount)) - 1n);
        integer = magnitude >> BigInt(droppedBitCount);
        const halfway = 1n << BigInt(droppedBitCount - 1);
        const roundUp =
            dropped > halfway || (dropped === halfway && (integer & 1n) === 1n);
        if (roundUp) {
            integer += 1n;
        }
    }
    if (integer === 0n) {
        return sign === -1 ? -0 : 0;
    }
    if (integer >= 1n << 52n) {
        return numberFromScaledInteger(sign, integer, -1074);
    }
    const signBit = sign === -1 ? 1n << 63n : 0n;
    binaryView.setBigUint64(0, signBit | integer);
    return binaryView.getFloat64(0);
}

/**
 * Whether `value` is an integer power of two and at least 1.
 *
 * Non-numbers, non-integers, and values below 1 are not powers of two.
 */
export function isPowerOfTwoValue(value: unknown): boolean {
    if (typeof value !== "number" || !Number.isFinite(value) || value < 1) {
        return false;
    }
    binaryView.setFloat64(0, value);
    const bits = binaryView.getBigUint64(0);
    const storedExponent = Number((bits >> 52n) & 0x7ffn);
    const fraction = bits & 0xfffffffffffffn;
    return storedExponent !== 0 && storedExponent !== 0x7ff && fraction === 0n;
}

/**
 * Smallest power of two that is greater than or equal to `value`.
 *
 * Returns `undefined` when `value` is not a positive finite number, or when
 * that power of two is not finite.
 */
export function nextPowerOfTwoValue(value: number): number | undefined {
    if (!Number.isFinite(value) || value <= 0) {
        return undefined;
    }
    const exponent = Math.ceil(Math.log2(value));
    let power = 2 ** exponent;
    if (!Number.isFinite(power)) {
        return undefined;
    }
    if (power < value) {
        power *= 2;
    }
    while (power / 2 >= value && Number.isFinite(power / 2)) {
        power /= 2;
    }
    if (!Number.isFinite(power) || power < value) {
        return undefined;
    }
    return power;
}

/**
 * Next smaller double, or `-Number.MIN_VALUE` when `value` is zero.
 */
export function nextDownValue(value: number): number {
    if (value === 0) {
        return -Number.MIN_VALUE;
    }
    binaryView.setFloat64(0, value);
    let bits = binaryView.getBigUint64(0);
    bits = value > 0 ? bits - 1n : bits + 1n;
    binaryView.setBigUint64(0, bits);
    return binaryView.getFloat64(0);
}

export { numberFromScaledInteger, readFloatComponents };
