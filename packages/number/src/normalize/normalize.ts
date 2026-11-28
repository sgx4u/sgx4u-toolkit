import { remapRange } from "../remap-range/remap-range.js";

/**
 * Maps `value` from `[start, end]` onto `[0, 1]`. A zero-length source returns `0` only when `value` is exactly `start`.
 *
 * @example
 * normalize({ value: 5, start: 0, end: 10 });
 */
export function normalize(parameters: {
    value: number;
    start: number;
    end: number;
}): number | undefined {
    return remapRange({
        value: parameters.value,
        fromStart: parameters.start,
        fromEnd: parameters.end,
        toStart: 0,
        toEnd: 1,
    });
}
