/**
 * Walks a piecewise-linear path through `values` as `amount` goes from 0 to 1. Amounts outside that interval extrapolate from the first or last segment.
 *
 * @example
 * interpolateAlongValues({ values: [0, 10, 30], amount: 0.5 });
 */
export function interpolateAlongValues(parameters: {
    values: readonly number[];
    amount: number;
}): number | undefined {
    const { values, amount } = parameters;
    if (!Number.isFinite(amount) || values.length < 2) {
        return undefined;
    }
    for (const value of values) {
        if (!Number.isFinite(value)) {
            return undefined;
        }
    }
    const segments = values.length - 1;
    const scaled = amount * segments;
    if (amount <= 0) {
        const first = values[0];
        const second = values[1];
        if (first === undefined || second === undefined) {
            return undefined;
        }
        return first + (second - first) * scaled;
    }
    if (amount >= 1) {
        const penultimate = values[segments - 1];
        const last = values[segments];
        if (penultimate === undefined || last === undefined) {
            return undefined;
        }
        return penultimate + (last - penultimate) * (scaled - (segments - 1));
    }
    const index = Math.floor(scaled);
    const left = values[index];
    const right = values[index + 1];
    if (left === undefined || right === undefined) {
        return undefined;
    }
    return left + (right - left) * (scaled - index);
}
