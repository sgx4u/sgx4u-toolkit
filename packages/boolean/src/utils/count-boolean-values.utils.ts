import { describeReceived } from "./describe-received.utils.js";

/**
 * How many entries were `true` and how many were `false`.
 */
export interface BooleanCounts {
    /** Number of primitive `true` entries. */
    trueCount: number;
    /** Number of primitive `false` entries. */
    falseCount: number;
}

/**
 * Counts a list of primitive booleans.
 *
 * The list is read and left unchanged. A non-array is a bad call. A
 * non-boolean entry is bad data and yields `undefined` so the caller does
 * not report a boolean result for a mixed list.
 *
 * @param values - The argument the public function received.
 * @param functionName - Public name written into the type error.
 * @returns The counts, or `undefined` when any entry is not a primitive boolean.
 * @throws {TypeError} When `values` is not an array.
 */
export function countBooleanValues(
    values: unknown,
    functionName: string,
): BooleanCounts | undefined {
    if (!Array.isArray(values)) {
        throw new TypeError(
            `${functionName} requires an array. Received ${describeReceived(values)}.`,
        );
    }

    let trueCount = 0;
    let falseCount = 0;
    for (const entry of values) {
        if (entry === true) {
            trueCount += 1;
            continue;
        }
        if (entry === false) {
            falseCount += 1;
            continue;
        }
        return undefined;
    }
    return { trueCount, falseCount };
}
