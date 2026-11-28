import { maximumSequenceLength } from "../constants/number-defaults.constants.js";
import { addDecimal } from "./decimal-arithmetic.utils.js";

/**
 * Builds `[start, end)` or `[start, end]` using decimal steps.
 *
 * Throws `RangeError` when `step` is zero, has the wrong sign, or the
 * sequence would be longer than {@link maximumSequenceLength}.
 */
export function createNumericSequence(
    start: number,
    end: number,
    step: number,
    includeEnd: boolean,
): number[] {
    if (
        !Number.isFinite(start) ||
        !Number.isFinite(end) ||
        !Number.isFinite(step)
    ) {
        throw new RangeError(
            `start, end, and step must be finite numbers. Received start ${String(start)}, end ${String(end)}, step ${String(step)}.`,
        );
    }
    if (step === 0) {
        throw new RangeError(`step must not be 0. Received ${String(step)}.`);
    }
    if (start < end && step < 0) {
        throw new RangeError(
            `step must be positive when start is less than end. Received step ${String(step)}.`,
        );
    }
    if (start > end && step > 0) {
        throw new RangeError(
            `step must be negative when start is greater than end. Received step ${String(step)}.`,
        );
    }
    if (start === end) {
        return includeEnd ? [start] : [];
    }
    const values: number[] = [];
    let current = start;
    while (values.length <= maximumSequenceLength) {
        const pastEnd = step > 0 ? current > end : current < end;
        if (pastEnd) {
            break;
        }
        const onEnd = current === end;
        if (onEnd && !includeEnd) {
            break;
        }
        values.push(current);
        if (onEnd) {
            break;
        }
        const next = addDecimal(current, step);
        if (next === undefined || Object.is(next, current)) {
            break;
        }
        current = next;
    }
    if (values.length > maximumSequenceLength) {
        throw new RangeError(
            `the range length must be at most ${String(maximumSequenceLength)}.`,
        );
    }
    return values;
}

/**
 * Builds a half-open bigint range. Throws `RangeError` for a zero step, the
 * wrong sign, or a length above {@link maximumSequenceLength}.
 */
export function createBigIntSequence(
    start: bigint,
    end: bigint,
    step: bigint,
): bigint[] {
    if (step === 0n) {
        throw new RangeError("step must not be 0n. Received 0n.");
    }
    if (start < end && step < 0n) {
        throw new RangeError(
            `step must be positive when start is less than end. Received step ${step.toString()}n.`,
        );
    }
    if (start > end && step > 0n) {
        throw new RangeError(
            `step must be negative when start is greater than end. Received step ${step.toString()}n.`,
        );
    }
    const values: bigint[] = [];
    for (
        let current = start;
        step > 0n ? current < end : current > end;
        current += step
    ) {
        values.push(current);
        if (values.length > maximumSequenceLength) {
            throw new RangeError(
                `the range length must be at most ${String(maximumSequenceLength)}.`,
            );
        }
    }
    return values;
}
