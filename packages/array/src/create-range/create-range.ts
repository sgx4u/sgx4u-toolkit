import type { CreateRangeParams } from "./create-range.types.js";
import { rangeError, typeError } from "../utils/errors.utils.js";
import { assertFiniteNumber } from "../utils/number.utils.js";

const maximumRangeLength = 1_000_000;

/**
 * Builds a numeric range.
 *
 * `createRange(3)` is `[0, 1, 2]`. `start` defaults to `0` and `step`
 * defaults to `1`. The end is excluded unless `inclusive` is true. Values
 * use `start + index * step` and stop before passing the end. A step whose
 * sign points away from `end` returns `[]`. This function never returns
 * `undefined`.
 *
 * @param end - The exclusive end. The range starts at `0` and steps by `1`.
 * @returns The range.
 * @throws {@link TypeError} When a bound is not a number.
 * @throws {@link RangeError} When a bound is not finite, when `step` is `0`, or when the range would be longer than one million values.
 */
export function createRange(end: number): number[];
/**
 * @param params - `start`, `end`, `step`, and `inclusive`.
 * @returns The range.
 * @throws {@link TypeError} When a bound is not a number.
 * @throws {@link RangeError} When a bound is not finite, when `step` is `0`, or when the range would be longer than one million values.
 * @example
 * createRange({ start: 1, end: 4, step: 1, inclusive: true });
 */
export function createRange(params: CreateRangeParams): number[];
export function createRange(input: unknown): number[] {
    if (typeof input === "number") {
        return buildRange(0, assertFiniteNumber("end", input), 1, false);
    }
    if (input === null || typeof input !== "object" || Array.isArray(input)) {
        throw typeError("end", "a finite number", input);
    }
    const params = input as CreateRangeParams;
    const start =
        params.start === undefined
            ? 0
            : assertFiniteNumber("start", params.start);
    const end = assertFiniteNumber("end", params.end);
    const step =
        params.step === undefined ? 1 : assertFiniteNumber("step", params.step);
    if (step === 0) {
        throw rangeError("step", "a non-zero finite number", step);
    }
    return buildRange(start, end, step, params.inclusive === true);
}

/**
 * Fills the range with index math.
 *
 * @param start - The first value.
 * @param end - The bound the range approaches.
 * @param step - A non-zero finite distance.
 * @param inclusive - Whether a value that lands on `end` is kept.
 * @returns The range.
 * @throws {@link RangeError} When the range is not finite or is longer than one million values.
 */
function buildRange(
    start: number,
    end: number,
    step: number,
    inclusive: boolean,
): number[] {
    if (start === end) {
        return inclusive ? [start] : [];
    }
    const steps = (end - start) / step;
    if (steps < 0) {
        return [];
    }
    if (!Number.isFinite(steps)) {
        throw finiteRangeError(end);
    }
    const upperBound = Math.floor(steps) + 1;
    if (!Number.isFinite(upperBound) || upperBound > maximumRangeLength + 1) {
        throw finiteRangeError(end);
    }
    const stepsAreNearInteger = isNear(steps, Math.round(steps));
    const landingIndex = Math.round(steps);
    const values: number[] = [];
    for (let index = 0; index < upperBound; index += 1) {
        const value = start + index * step;
        if (isStrictlyBefore(value, end, step)) {
            values.push(value);
            continue;
        }
        if (
            inclusive &&
            (isNear(value, end) ||
                (stepsAreNearInteger && index === landingIndex))
        ) {
            values.push(value);
        }
        break;
    }
    if (values.length > maximumRangeLength) {
        throw finiteRangeError(end);
    }
    return values;
}

/**
 * @param value - The candidate value.
 * @param end - The range bound.
 * @param step - The step direction.
 * @returns `true` when `value` has not reached `end`.
 */
function isStrictlyBefore(value: number, end: number, step: number): boolean {
    if (step > 0) {
        return value < end;
    }
    return value > end;
}

/**
 * @param left - A number.
 * @param right - Another number.
 * @returns `true` when the two numbers are within a small relative tolerance.
 */
function isNear(left: number, right: number): boolean {
    const scale = Math.max(1, Math.abs(left), Math.abs(right));
    return Math.abs(left - right) <= 1e-9 * scale;
}

/**
 * @param end - The bound that made the range too large.
 * @returns The range error.
 */
function finiteRangeError(end: number): RangeError {
    return new RangeError(
        `\`end\` must produce a finite range; received ${end}.`,
    );
}
