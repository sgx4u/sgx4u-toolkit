import { maximumSequenceLength } from "../constants/number-defaults.constants.js";

/** Function that returns a float in `[0, 1)`. Not cryptographically secure. */
export type RandomSource = () => number;

/**
 * Reads one sample and throws when it is outside `[0, 1)`.
 */
export function readUnitSample(random: RandomSource): number {
    const sample = random();
    if (
        typeof sample !== "number" ||
        sample < 0 ||
        sample >= 1 ||
        Number.isNaN(sample)
    ) {
        throw new RangeError(
            `random must return a number in [0, 1). Received ${String(sample)}.`,
        );
    }
    return sample;
}

/**
 * Uniform integer in the inclusive or half-open range.
 *
 * Not cryptographically secure. Throws `RangeError` when the bounds are not
 * integers, the range is empty, or the span is not a safe integer.
 */
export function randomIntegerBetween(
    lower: number,
    upper: number,
    includeUpper: boolean,
    random: RandomSource,
): number {
    if (!Number.isInteger(lower) || !Number.isInteger(upper)) {
        throw new RangeError(
            `lower and upper must be integers. Received lower ${String(lower)}, upper ${String(upper)}.`,
        );
    }
    const maximum = includeUpper ? upper : upper - 1;
    if (lower > maximum) {
        throw new RangeError(
            `lower must not be greater than upper. Received lower ${String(lower)}, upper ${String(upper)}.`,
        );
    }
    const span = maximum - lower + 1;
    if (!Number.isSafeInteger(span)) {
        throw new RangeError(
            `the integer span must be a safe integer. Received span ${String(span)}.`,
        );
    }
    return lower + Math.floor(readUnitSample(random) * span);
}

/**
 * Float in `[lower, upper)` or `[lower, upper]`.
 *
 * Not cryptographically secure. Throws `RangeError` when `lower > upper`,
 * or when the half-open range is empty.
 */
export function randomRealBetween(
    lower: number,
    upper: number,
    includeUpper: boolean,
    random: RandomSource,
): number {
    if (!Number.isFinite(lower) || !Number.isFinite(upper) || lower > upper) {
        throw new RangeError(
            `lower must be a finite number less than or equal to upper. Received lower ${String(lower)}, upper ${String(upper)}.`,
        );
    }
    if (!includeUpper && lower === upper) {
        throw new RangeError(
            `lower must be less than upper when includeUpper is false. Received ${String(lower)}.`,
        );
    }
    const sample = readUnitSample(random);
    if (lower === upper) {
        return lower;
    }
    const result = lower + sample * (upper - lower);
    if (!includeUpper && result >= upper) {
        return Math.min(lower, nextLower(upper));
    }
    if (includeUpper && result > upper) {
        return upper;
    }
    return result;
}

/**
 * Cryptographically secure integer. Throws when `crypto.getRandomValues` is missing.
 */
export function randomIntegerSecureBetween(
    lower: number,
    upper: number,
    includeUpper: boolean,
): number {
    if (!Number.isInteger(lower) || !Number.isInteger(upper)) {
        throw new RangeError(
            `lower and upper must be integers. Received lower ${String(lower)}, upper ${String(upper)}.`,
        );
    }
    const maximum = includeUpper ? upper : upper - 1;
    if (lower > maximum) {
        throw new RangeError(
            `lower must not be greater than upper. Received lower ${String(lower)}, upper ${String(upper)}.`,
        );
    }
    const span = maximum - lower + 1;
    if (!Number.isSafeInteger(span)) {
        throw new RangeError(
            `the integer span must be a safe integer. Received span ${String(span)}.`,
        );
    }
    return lower + randomBelow(span);
}

/**
 * Cryptographically secure float in the requested range.
 */
export function randomRealSecureBetween(
    lower: number,
    upper: number,
    includeUpper: boolean,
): number {
    return randomRealBetween(lower, upper, includeUpper, () => {
        return randomBelow(0x20_0000_0000_0000) / 0x20_0000_0000_0000;
    });
}

/**
 * Shuffled bag of every integer in the range. Cycles after the last value.
 *
 * Not cryptographically secure. Throws when the range is invalid or longer
 * than the sequence limit.
 */
export function createUniqueIntegerSource(
    lower: number,
    upper: number,
    includeUpper: boolean,
    random: RandomSource,
): () => number {
    const maximum = includeUpper ? upper : upper - 1;
    if (
        !Number.isInteger(lower) ||
        !Number.isInteger(upper) ||
        lower > maximum
    ) {
        throw new RangeError(
            `lower and upper must be integers with lower not greater than the included end. Received lower ${String(lower)}, upper ${String(upper)}.`,
        );
    }
    const span = maximum - lower + 1;
    if (!Number.isSafeInteger(span) || span > maximumSequenceLength) {
        throw new RangeError(
            `the integer span must be from 1 to ${String(maximumSequenceLength)}. Received span ${String(span)}.`,
        );
    }
    let bag = shuffleRange(lower, span, random);
    let index = 0;
    return () => {
        const value = bag[index];
        index += 1;
        if (index >= bag.length) {
            bag = shuffleRange(lower, span, random);
            index = 0;
        }
        return value ?? lower;
    };
}

/**
 * Mulberry32 generator. The same seed returns the same sequence.
 * Not cryptographically secure.
 */
export function createMulberry32(seed: number | string): RandomSource {
    let state = hashSeed(seed);
    return () => {
        state = (state + 0x6d2b79f5) >>> 0;
        let mixed = state;
        mixed = Math.imul(mixed ^ (mixed >>> 15), mixed | 1);
        mixed ^= mixed + Math.imul(mixed ^ (mixed >>> 7), mixed | 61);
        return ((mixed ^ (mixed >>> 14)) >>> 0) / 4294967296;
    };
}

/**
 * Bigint in the inclusive or half-open range. Not cryptographically secure.
 */
export function randomBigIntBetween(
    lower: bigint,
    upper: bigint,
    includeUpper: boolean,
    random: RandomSource,
): bigint {
    const maximum = includeUpper ? upper : upper - 1n;
    if (lower > maximum) {
        throw new RangeError(
            `lower must not be greater than upper. Received lower ${lower.toString()}n, upper ${upper.toString()}n.`,
        );
    }
    const span = maximum - lower + 1n;
    return lower + randomBigIntBelow(span, random);
}

function randomBelow(span: number): number {
    const cryptoSource = readCrypto();
    const space = 0x20_0000_0000_0000;
    const limit = space - (space % span);
    let sample = random53(cryptoSource);
    while (sample >= limit) {
        sample = random53(cryptoSource);
    }
    return sample % span;
}

function random53(cryptoSource: CryptoSource): number {
    const bytes = new Uint32Array(2);
    cryptoSource.getRandomValues(bytes);
    const high = (bytes[0] ?? 0) & 0x1f_ffff;
    const low = bytes[1] ?? 0;
    return high * 0x1_0000_0000 + low;
}

function randomBigIntBelow(span: bigint, random: RandomSource): bigint {
    if (span <= 1n) {
        return 0n;
    }
    const bitLength = span.toString(2).length;
    const chunks = Math.ceil(bitLength / 32);
    const space = 1n << BigInt(chunks * 32);
    const limit = space - (space % span);
    let sample = space;
    while (sample >= limit) {
        sample = 0n;
        for (let index = 0; index < chunks; index += 1) {
            const piece = BigInt(
                Math.floor(readUnitSample(random) * 0x1_0000_0000),
            );
            sample = (sample << 32n) | (piece & 0xffff_ffffn);
        }
    }
    return sample % span;
}

interface CryptoSource {
    getRandomValues<View extends ArrayBufferView>(view: View): View;
}

function readCrypto(): CryptoSource {
    const candidate = (globalThis as { crypto?: CryptoSource }).crypto;
    if (
        candidate === undefined ||
        typeof candidate.getRandomValues !== "function"
    ) {
        throw new Error("crypto.getRandomValues is not available.");
    }
    return candidate;
}

function nextLower(value: number): number {
    if (value === 0) {
        return -Number.MIN_VALUE;
    }
    const view = new DataView(new ArrayBuffer(8));
    view.setFloat64(0, value);
    let bits = view.getBigUint64(0);
    bits = value > 0 ? bits - 1n : bits + 1n;
    view.setBigUint64(0, bits);
    return view.getFloat64(0);
}

function shuffleRange(
    lower: number,
    span: number,
    random: RandomSource,
): number[] {
    const values = Array.from(
        { length: span },
        (_unused, index) => lower + index,
    );
    for (let index = values.length - 1; index > 0; index -= 1) {
        const swapIndex = Math.floor(readUnitSample(random) * (index + 1));
        const current = values[index];
        const swapped = values[swapIndex];
        if (current !== undefined && swapped !== undefined) {
            values[index] = swapped;
            values[swapIndex] = current;
        }
    }
    return values;
}

function hashSeed(seed: number | string): number {
    if (typeof seed === "number") {
        if (!Number.isFinite(seed)) {
            throw new RangeError(
                `seed must be a finite number or a string. Received ${String(seed)}.`,
            );
        }
        const view = new DataView(new ArrayBuffer(8));
        view.setFloat64(0, seed);
        return (view.getUint32(0) ^ view.getUint32(4)) >>> 0;
    }
    let hash = 2_166_136_261;
    for (let index = 0; index < seed.length; index += 1) {
        hash ^= seed.charCodeAt(index);
        hash = Math.imul(hash, 1_677_761_9);
    }
    return hash >>> 0;
}
