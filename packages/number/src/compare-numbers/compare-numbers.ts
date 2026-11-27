/**
 * Compares two numbers. Returns `-1`, `0`, or `1`. `NaN` and non-numbers return `undefined`. `-0` and `0` compare equal.
 *
 * @example
 * compareNumbers({ first: 1, second: 2 });
 */
export function compareNumbers(parameters: {
    first: number;
    second: number;
}): -1 | 0 | 1 | undefined {
    const { first, second } = parameters;
    if (typeof first !== "number" || typeof second !== "number") {
        return undefined;
    }
    if (Number.isNaN(first) || Number.isNaN(second)) {
        return undefined;
    }
    if (first < second) {
        return -1;
    }
    if (first > second) {
        return 1;
    }
    return 0;
}
