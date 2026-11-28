/**
 * Non-negative greatest common divisor of two or more safe integers.
 *
 * Returns `undefined` when fewer than two values are supplied or any value
 * is not a safe integer.
 */
export function greatestCommonDivisorOf(
    values: readonly number[],
): number | undefined {
    if (values.length < 2) {
        return undefined;
    }
    let result: bigint | undefined;
    for (const value of values) {
        if (!Number.isSafeInteger(value)) {
            return undefined;
        }
        const absolute = BigInt(Math.abs(value));
        result =
            result === undefined
                ? absolute
                : greatestCommonDivisorPair(result, absolute);
    }
    return result === undefined ? undefined : Number(result);
}

/**
 * Non-negative least common multiple of two or more safe integers.
 *
 * Returns `undefined` when fewer than two safe integers are supplied or the
 * result is greater than `Number.MAX_SAFE_INTEGER`.
 */
export function leastCommonMultipleOf(
    values: readonly number[],
): number | undefined {
    if (values.length < 2) {
        return undefined;
    }
    let result: bigint | undefined;
    for (const value of values) {
        if (!Number.isSafeInteger(value)) {
            return undefined;
        }
        const absolute = BigInt(Math.abs(value));
        if (result === undefined) {
            result = absolute;
            continue;
        }
        result = leastCommonMultiplePair(result, absolute);
        if (result > BigInt(Number.MAX_SAFE_INTEGER)) {
            return undefined;
        }
    }
    return result === undefined ? undefined : Number(result);
}

/**
 * Non-negative greatest common divisor of two or more bigints.
 */
export function greatestCommonDivisorOfBigInt(
    values: readonly bigint[],
): bigint | undefined {
    if (values.length < 2) {
        return undefined;
    }
    let result = values[0];
    if (result === undefined) {
        return undefined;
    }
    result = result < 0n ? -result : result;
    for (let index = 1; index < values.length; index += 1) {
        const value = values[index];
        if (value === undefined) {
            return undefined;
        }
        result = greatestCommonDivisorPair(result, value < 0n ? -value : value);
    }
    return result;
}

/**
 * Non-negative least common multiple of two or more bigints.
 */
export function leastCommonMultipleOfBigInt(
    values: readonly bigint[],
): bigint | undefined {
    if (values.length < 2) {
        return undefined;
    }
    let result = values[0];
    if (result === undefined) {
        return undefined;
    }
    result = result < 0n ? -result : result;
    for (let index = 1; index < values.length; index += 1) {
        const value = values[index];
        if (value === undefined) {
            return undefined;
        }
        result = leastCommonMultiplePair(result, value < 0n ? -value : value);
    }
    return result;
}

function greatestCommonDivisorPair(left: bigint, right: bigint): bigint {
    let a = left;
    let b = right;
    while (b !== 0n) {
        const next = a % b;
        a = b;
        b = next;
    }
    return a;
}

function leastCommonMultiplePair(left: bigint, right: bigint): bigint {
    if (left === 0n || right === 0n) {
        return 0n;
    }
    return (left / greatestCommonDivisorPair(left, right)) * right;
}
