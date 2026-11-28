import { clamp } from "../clamp/clamp.js";

/**
 * Maps `value` linearly from `[fromStart, fromEnd]` onto `[toStart, toEnd]`. `amount` is not involved; the source position is the ratio. Set `clamp` to clamp the input to the source range first.
 *
 * @example
 * remapRange({ value: 5, fromStart: 0, fromEnd: 10, toStart: 0, toEnd: 100 });
 */
export function remapRange(parameters: {
    value: number;
    fromStart: number;
    fromEnd: number;
    toStart: number;
    toEnd: number;
    clamp?: boolean;
}): number | undefined {
    const {
        value,
        fromStart,
        fromEnd,
        toStart,
        toEnd,
        clamp: shouldClamp = false,
    } = parameters;
    if (
        ![value, fromStart, fromEnd, toStart, toEnd].every((entry) =>
            Number.isFinite(entry),
        )
    ) {
        return undefined;
    }
    if (fromStart === fromEnd) {
        return value === fromStart ? toStart : undefined;
    }
    let source = value;
    if (shouldClamp) {
        const lower = Math.min(fromStart, fromEnd);
        const upper = Math.max(fromStart, fromEnd);
        const clamped = clamp({ value, lower, upper });
        if (clamped === undefined) {
            return undefined;
        }
        source = clamped;
    }
    const ratio = (source - fromStart) / (fromEnd - fromStart);
    return toStart + ratio * (toEnd - toStart);
}
