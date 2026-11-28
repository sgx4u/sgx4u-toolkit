import {
    numberFromScaledInteger,
    readFloatComponents,
} from "./float-bits.utils.js";

interface SignedTerm {
    sign: 1 | -1;
    significand: bigint;
    exponent: number;
}

/**
 * Correctly rounded sum of the exact values of finite doubles.
 *
 * An empty list is `0`, which differs from `Math.sumPrecise` on an empty
 * list. A non-finite item returns `undefined`. A mathematical sum of zero
 * is `-0` only when every item is `-0`.
 */
export function sumExact(values: readonly number[]): number | undefined {
    if (values.length === 0) {
        return 0;
    }
    const terms: SignedTerm[] = [];
    let minimumExponent = 0;
    let everyItemIsNegativeZero = true;
    for (const value of values) {
        if (!Number.isFinite(value)) {
            return undefined;
        }
        if (!Object.is(value, -0)) {
            everyItemIsNegativeZero = false;
        }
        const components = readFloatComponents(value);
        terms.push(components);
        if (
            components.significand !== 0n &&
            components.exponent < minimumExponent
        ) {
            minimumExponent = components.exponent;
        }
    }
    if (terms.every((term) => term.significand === 0n)) {
        return everyItemIsNegativeZero ? -0 : 0;
    }
    let total = 0n;
    for (const term of terms) {
        const shift = term.exponent - minimumExponent;
        const magnitude = term.significand << BigInt(shift);
        total += term.sign === -1 ? -magnitude : magnitude;
    }
    if (total === 0n) {
        return 0;
    }
    const sign: 1 | -1 = total < 0n ? -1 : 1;
    return numberFromScaledInteger(
        sign,
        total < 0n ? -total : total,
        minimumExponent,
    );
}
