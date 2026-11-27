import { createBigIntSequence } from "../utils/sequence.utils.js";

/**
 * Creates the half-open bigint sequence `[start, end)`. `step` defaults to `1n`. A sequence longer than 1000000 throws.
 *
 * @throws {@link RangeError} When `step` is `0n`, has the wrong sign, or the sequence is longer than 1000000.
 *
 * @example
 * createBigIntRange({ start: 0n, end: 3n });
 */
export function createBigIntRange(parameters: {
    start: bigint;
    end: bigint;
    step?: bigint;
}): bigint[] {
    return createBigIntSequence(
        parameters.start,
        parameters.end,
        parameters.step ?? 1n,
    );
}
