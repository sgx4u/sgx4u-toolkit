import { createNumericSequence } from "../utils/sequence.utils.js";

/**
 * Creates the half-open sequence `[start, end)`. `start` defaults to 0 and `step` defaults to 1. Decimal steps use decimal arithmetic, so a step of `0.1` does not drift.
 *
 * @throws {@link RangeError} When `step` is 0, has the wrong sign, is not finite, or the sequence is longer than 1000000.
 *
 * @example
 * createRange({ end: 3 });
 */
export function createRange(parameters: {
    start?: number;
    end: number;
    step?: number;
}): number[] {
    const start = parameters.start ?? 0;
    const step = parameters.step ?? 1;
    return createNumericSequence(start, parameters.end, step, false);
}
