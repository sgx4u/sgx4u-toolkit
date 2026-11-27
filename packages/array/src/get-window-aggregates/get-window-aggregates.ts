import type {
    GetWindowAggregatesParams,
    WindowAggregateName,
} from "./get-window-aggregates.types.js";
import type { WindowAggregate } from "../types/aggregate.types.js";
import { assertChoice, rangeError, typeError } from "../utils/errors.utils.js";
import { assertPositiveInteger } from "../utils/number.utils.js";
import { readFiniteNumbers } from "../utils/numbers.utils.js";
import { readArray, readParams } from "../utils/params.utils.js";

/** Names `getWindowAggregates` accepts besides a function. */
const windowAggregateNames = ["sum", "mean", "min", "max"] as const;

/**
 * Returns a value for each sliding window.
 *
 * `end` is exclusive, so it is `start + items.length`. Each window's `items`
 * is a new array. Named aggregates require finite numbers. A function
 * receives the window items as they are.
 *
 * An empty array returns `undefined`. A non-empty array that cannot fit a
 * window (`partial: false` and `length < size`) returns an empty array.
 * A value that is not a params object, or whose `array` is not an array,
 * returns `undefined`.
 *
 * @param input - {@link GetWindowAggregatesParams}.
 * @returns The windows, `[]` when none fit, or `undefined` when `array` is missing or empty.
 * @throws {@link TypeError} When `size` or `step` is not a number, when `partial` is not a boolean, or when a named aggregate sees a value that is not a finite number.
 * @throws {@link RangeError} When `size` or `step` is not a positive integer, or when `aggregate` is not `"sum"`, `"mean"`, `"min"`, `"max"`, or a function.
 * @example
 * getWindowAggregates({
 *   array: [1, 2, 3, 4],
 *   size: 2,
 *   aggregate: "sum",
 * })
 */
export function getWindowAggregates<Item, Result>(
    params: GetWindowAggregatesParams<Item, Result>,
): WindowAggregate<Item, Result>[] | undefined;
export function getWindowAggregates(
    input: unknown,
): WindowAggregate<unknown, unknown>[] | undefined;
export function getWindowAggregates(
    input: unknown,
): WindowAggregate<unknown, unknown>[] | undefined {
    const params =
        readParams<GetWindowAggregatesParams<unknown, unknown>>(input);
    if (params === undefined) {
        return undefined;
    }
    const array = readArray(params.array);
    if (array === undefined) {
        return undefined;
    }
    const size = assertPositiveInteger("size", params.size);
    const step =
        params.step === undefined
            ? 1
            : assertPositiveInteger("step", params.step);
    const aggregate = readAggregate(params.aggregate);
    if (params.partial !== undefined && typeof params.partial !== "boolean") {
        throw typeError("partial", "a boolean", params.partial);
    }
    const partial = params.partial !== false;
    if (array.length === 0) {
        return undefined;
    }
    return slide(array, size, step, partial, aggregate);
}

/**
 * @param aggregate - The caller's aggregate.
 * @returns A name or a function.
 * @throws {@link RangeError} When `aggregate` is not a supported name or a function.
 */
function readAggregate(
    aggregate: unknown,
): WindowAggregateName | ((items: unknown[]) => unknown) {
    if (typeof aggregate === "function") {
        return aggregate as (items: unknown[]) => unknown;
    }
    assertChoice("aggregate", aggregate, windowAggregateNames);
    if (
        aggregate !== "sum" &&
        aggregate !== "mean" &&
        aggregate !== "min" &&
        aggregate !== "max"
    ) {
        throw rangeError(
            "aggregate",
            '"sum", "mean", "min", "max", or a function',
            aggregate,
        );
    }
    return aggregate;
}

/**
 * @param array - A non-empty array.
 * @param size - Window length.
 * @param step - Distance between window starts.
 * @param partial - Whether a short trailing window is kept.
 * @param aggregate - How to reduce one window.
 * @returns The windows that fit. Empty when none fit.
 */
function slide(
    array: readonly unknown[],
    size: number,
    step: number,
    partial: boolean,
    aggregate: WindowAggregateName | ((items: unknown[]) => unknown),
): WindowAggregate<unknown, unknown>[] {
    const windows: WindowAggregate<unknown, unknown>[] = [];
    for (let start = 0; start < array.length; start += step) {
        const end = Math.min(start + size, array.length);
        if (end - start < size && !partial) {
            break;
        }
        if (end === start) {
            break;
        }
        const items: unknown[] = [];
        for (let index = start; index < end; index += 1) {
            items.push(array[index]);
        }
        windows.push({
            start,
            end,
            items,
            value: aggregateWindow(aggregate, items),
        });
    }
    return windows;
}

/**
 * @param aggregate - A name or a function.
 * @param items - The window. A new array, and not empty.
 * @returns The aggregate value.
 */
function aggregateWindow(
    aggregate: WindowAggregateName | ((items: unknown[]) => unknown),
    items: unknown[],
): unknown {
    if (typeof aggregate === "function") {
        return aggregate(items);
    }
    const values = readFiniteNumbers(items, undefined).map(
        (sample) => sample.value,
    );
    if (aggregate === "sum") {
        return sumValues(values);
    }
    if (aggregate === "mean") {
        return sumValues(values) / values.length;
    }
    if (aggregate === "min") {
        return extreme(values, "min");
    }
    return extreme(values, "max");
}

/**
 * @param values - Finite numbers. Not empty.
 * @returns Their sum.
 */
function sumValues(values: readonly number[]): number {
    let total = 0;
    for (const value of values) {
        total += value;
    }
    return total;
}

/**
 * @param values - Finite numbers. Not empty.
 * @param direction - Which extreme to keep. Ties keep the earlier value.
 * @returns The minimum or the maximum.
 */
function extreme(values: readonly number[], direction: "min" | "max"): number {
    let champion = values[0] as number;
    for (let index = 1; index < values.length; index += 1) {
        const candidate = values[index] as number;
        if (direction === "min" ? candidate < champion : candidate > champion) {
            champion = candidate;
        }
    }
    return champion;
}
