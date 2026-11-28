import { createNumericSequence } from "../utils/sequence.utils.js";

/**
 * Creates the closed sequence `[start, end]`. `end` is included when it lands on a step.
 *
 * @throws {@link RangeError} When `step` is 0, has the wrong sign, is not finite, or the sequence is longer than 1000000.
 *
 * @example
 * createInclusiveRange({ start: 0, end: 2 });
 */
export function createInclusiveRange(parameters: {
    start: number;
    end: number;
    step?: number;
}): number[] {
    return createNumericSequence(
        parameters.start,
        parameters.end,
        parameters.step ?? 1,
        true,
    );
}
