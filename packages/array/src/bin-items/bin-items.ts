import type { BinItemsParams } from "./bin-items.types.js";
import type { HistogramBin } from "../types/aggregate.types.js";
import { rangeError, typeError } from "../utils/errors.utils.js";
import { assertIteratee } from "../utils/iteratee.utils.js";
import { assertPositiveInteger } from "../utils/number.utils.js";
import type { NumericSample } from "../utils/numbers.utils.js";
import { readFiniteNumbers } from "../utils/numbers.utils.js";
import { readArray, readParams } from "../utils/params.utils.js";

/**
 * Builds a numeric histogram.
 *
 * Provide exactly one of `binCount` and `binWidth`. `start` defaults to the
 * minimum value and `end` defaults to the maximum. Every bin except the last
 * is half-open: `start <= value < end`. The last bin is closed on the right.
 * Values outside `[start, end]` are excluded.
 *
 * When the span is 0 and `binCount` is set, the width is 1, so every value
 * falls in the first bin and the extra bins follow. When `binWidth` is set,
 * the number of bins is 1 when the span is 0 and otherwise
 * `Math.ceil(span / binWidth)`.
 *
 * An empty array returns `undefined`. A value that is not a params object,
 * or whose `array` is not an array, returns `undefined`.
 *
 * @param input - {@link BinItemsParams}.
 * @returns The bins, or `undefined` when there is nothing to bin.
 * @throws {@link TypeError} When `by` is set and is not an iteratee, when an item or `by` result is not a finite number, or when `binCount`, `binWidth`, `start`, or `end` is not a number.
 * @throws {@link RangeError} When both or neither of `binCount` and `binWidth` are set, when either is not positive and finite, when `start` or `end` is not finite, when `end` is less than `start`, or when the computed bin count is not a safe integer.
 * @example
 * binItems({ array: [1, 2, 3, 4, 5], binCount: 2 })
 */
export function binItems<Item>(
    params: BinItemsParams<Item>,
): HistogramBin<Item>[] | undefined;
export function binItems(input: unknown): HistogramBin<unknown>[] | undefined;
export function binItems(input: unknown): HistogramBin<unknown>[] | undefined {
    const params = readParams<BinItemsParams<unknown>>(input);
    if (params === undefined) {
        return undefined;
    }
    const array = readArray(params.array);
    if (array === undefined) {
        return undefined;
    }
    const binCount = readOptionalBinCount(params.binCount);
    const binWidth = readOptionalBinWidth(params.binWidth);
    if (binCount !== undefined && binWidth !== undefined) {
        throw new RangeError(
            "`binCount` and `binWidth` must not both be set; received both.",
        );
    }
    if (binCount === undefined && binWidth === undefined) {
        throw new RangeError(
            "Either `binCount` or `binWidth` must be set; received neither.",
        );
    }
    const start = readOptionalBound("start", params.start);
    const end = readOptionalBound("end", params.end);
    if (start !== undefined && end !== undefined && end < start) {
        throw rangeError("end", "greater than or equal to `start`", end);
    }
    if (params.by !== undefined) {
        assertIteratee("by", params.by);
    }
    if (array.length === 0) {
        return undefined;
    }
    const samples = readFiniteNumbers(array, params.by);
    const first = samples[0] as NumericSample<unknown>;
    let dataMin = first.value;
    let dataMax = first.value;
    for (const sample of samples) {
        if (sample.value < dataMin) {
            dataMin = sample.value;
        }
        if (sample.value > dataMax) {
            dataMax = sample.value;
        }
    }
    const rangeStart = start ?? dataMin;
    const rangeEnd = end ?? dataMax;
    if (rangeEnd < rangeStart) {
        throw rangeError("end", "greater than or equal to `start`", rangeEnd);
    }
    return buildBins(samples, rangeStart, rangeEnd, binCount, binWidth);
}

/**
 * @param value - The caller's `binCount`, when present.
 * @returns A positive integer, or `undefined` when it was omitted.
 */
function readOptionalBinCount(value: unknown): number | undefined {
    if (value === undefined) {
        return undefined;
    }
    return assertPositiveInteger("binCount", value);
}

/**
 * @param value - The caller's `binWidth`, when present.
 * @returns A positive finite number, or `undefined` when it was omitted.
 */
function readOptionalBinWidth(value: unknown): number | undefined {
    if (value === undefined) {
        return undefined;
    }
    if (typeof value !== "number") {
        throw typeError("binWidth", "a positive finite number", value);
    }
    if (!Number.isFinite(value) || value <= 0) {
        throw rangeError("binWidth", "a positive finite number", value);
    }
    return value;
}

/**
 * @param name - `"start"` or `"end"`.
 * @param value - The caller's bound, when present.
 * @returns A finite number, or `undefined` when it was omitted.
 */
function readOptionalBound(name: string, value: unknown): number | undefined {
    if (value === undefined) {
        return undefined;
    }
    if (typeof value !== "number") {
        throw typeError(name, "a finite number", value);
    }
    if (!Number.isFinite(value)) {
        throw rangeError(name, "a finite number", value);
    }
    return value;
}

/**
 * @param samples - Finite numbers and the items they came from.
 * @param start - Left edge of the range.
 * @param end - Right edge of the range.
 * @param requestedCount - `binCount` when the caller set it.
 * @param requestedWidth - `binWidth` when the caller set it.
 * @returns One bin per slot, including empty bins.
 */
function buildBins(
    samples: readonly NumericSample<unknown>[],
    start: number,
    end: number,
    requestedCount: number | undefined,
    requestedWidth: number | undefined,
): HistogramBin<unknown>[] {
    const span = end - start;
    const planned = planBins(start, end, span, requestedCount, requestedWidth);
    for (const sample of samples) {
        const index = indexForValue(
            sample.value,
            start,
            end,
            planned.width,
            planned.bins.length,
            span,
        );
        if (index === undefined) {
            continue;
        }
        const bin = planned.bins[index] as HistogramBin<unknown>;
        bin.items.push(sample.item);
        bin.count += 1;
    }
    return planned.bins;
}

/**
 * @param start - Left edge.
 * @param end - Right edge.
 * @param span - `end - start`.
 * @param requestedCount - `binCount` when set.
 * @param requestedWidth - `binWidth` when set.
 * @returns The empty bins and the width used to place values.
 */
function planBins(
    start: number,
    end: number,
    span: number,
    requestedCount: number | undefined,
    requestedWidth: number | undefined,
): { bins: HistogramBin<unknown>[]; width: number } {
    let binCount: number;
    let width: number;
    let extendLast: boolean;
    if (requestedWidth !== undefined) {
        width = requestedWidth;
        binCount = span === 0 ? 1 : Math.ceil(span / requestedWidth);
        extendLast = span !== 0;
    } else {
        binCount = requestedCount as number;
        if (span === 0) {
            width = 1;
            extendLast = true;
        } else {
            width = span / binCount;
            extendLast = false;
        }
    }
    if (!Number.isSafeInteger(binCount) || binCount < 1) {
        throw rangeError("binCount", "a safe integer number of bins", binCount);
    }
    const bins: HistogramBin<unknown>[] = [];
    for (let index = 0; index < binCount; index += 1) {
        const binStart = start + index * width;
        const isLast = index === binCount - 1;
        let binEnd = binStart + width;
        if (isLast && !extendLast) {
            binEnd = end;
        }
        bins.push({ start: binStart, end: binEnd, count: 0, items: [] });
    }
    return { bins, width };
}

/**
 * @param value - A data value.
 * @param start - Left edge of the range.
 * @param end - Right edge of the range.
 * @param width - Bin width used for placement.
 * @param binCount - How many bins were built.
 * @param span - `end - start`.
 * @returns The bin index, or `undefined` when `value` is outside the range.
 */
function indexForValue(
    value: number,
    start: number,
    end: number,
    width: number,
    binCount: number,
    span: number,
): number | undefined {
    if (value < start || value > end) {
        return undefined;
    }
    if (span === 0) {
        return 0;
    }
    if (value === end) {
        return binCount - 1;
    }
    const index = Math.floor((value - start) / width);
    if (index <= 0) {
        return 0;
    }
    if (index >= binCount) {
        return binCount - 1;
    }
    return index;
}
