import { quantileMethods } from "../constants/quantile-methods.constants.js";
import type { QuantileMethod } from "../types/quantile-method.types.js";

const quantileMethodSet: ReadonlySet<string> = new Set(quantileMethods);

/**
 * Throws when `method` is not a quantile method.
 */
export function assertQuantileMethod(
    method: string,
    argumentName = "method",
): asserts method is QuantileMethod {
    if (!quantileMethodSet.has(method)) {
        throw new RangeError(
            `${argumentName} must be a quantile method. Received ${JSON.stringify(method)}.`,
        );
    }
}

/**
 * Throws when `percentile` is outside 0 to 100.
 */
export function assertPercentile(percentile: number): void {
    if (!Number.isFinite(percentile) || percentile < 0 || percentile > 100) {
        throw new RangeError(
            `percentile must be a number from 0 to 100. Received ${String(percentile)}.`,
        );
    }
}

/**
 * Throws when `probability` is outside 0 to 1.
 */
export function assertProbability(probability: number): void {
    if (!Number.isFinite(probability) || probability < 0 || probability > 1) {
        throw new RangeError(
            `probability must be a number from 0 to 1. Received ${String(probability)}.`,
        );
    }
}

/**
 * Quantile of a sample. Does not mutate `values`.
 *
 * `"linear"` and `"inclusive"` use Hyndman-Fan type 7. `"exclusive"` uses
 * type 6 and returns `undefined` when the position falls outside the sample.
 * An empty sample, or any non-finite value, returns `undefined`.
 */
export function quantileOf(
    values: readonly number[],
    probability: number,
    method: QuantileMethod,
): number | undefined {
    if (values.length === 0) {
        return undefined;
    }
    for (const value of values) {
        if (!Number.isFinite(value)) {
            return undefined;
        }
    }
    const sorted = [...values].sort((left, right) => left - right);
    const length = sorted.length;
    if (method === "exclusive") {
        const position = (length + 1) * probability - 1;
        if (position < 0 || position > length - 1) {
            return undefined;
        }
        return interpolateSorted(sorted, position);
    }
    const position = (length - 1) * probability;
    if (method === "lower") {
        return sorted[Math.floor(position)];
    }
    if (method === "higher") {
        return sorted[Math.ceil(position)];
    }
    if (method === "nearest") {
        return sorted[Math.round(position)];
    }
    if (method === "midpoint") {
        const lower = sorted[Math.floor(position)];
        const upper = sorted[Math.ceil(position)];
        if (lower === undefined || upper === undefined) {
            return undefined;
        }
        return (lower + upper) / 2;
    }
    return interpolateSorted(sorted, position);
}

function interpolateSorted(
    sorted: readonly number[],
    position: number,
): number | undefined {
    const lower = sorted[Math.floor(position)];
    const upper = sorted[Math.ceil(position)];
    if (lower === undefined || upper === undefined) {
        return undefined;
    }
    return lower + (upper - lower) * (position - Math.floor(position));
}
