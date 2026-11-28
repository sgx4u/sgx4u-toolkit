import { resolveDateInput } from "./date-input.utils.js";
import { typeError } from "./error.utils.js";

/**
 * Compares two instants.
 *
 * @param first - The first date.
 * @param second - The second date.
 * @param firstName - Parameter name for the first argument.
 * @param secondName - Parameter name for the second argument.
 * @returns `-1` when `first` is earlier, `1` when it is later, and `0` when they match.
 * @throws {@link TypeError} When either value has the wrong type.
 * @throws {@link RangeError} When either value is not a real date.
 */
export function compareResolvedInstants(
    first: unknown,
    second: unknown,
    firstName: string,
    secondName: string,
): -1 | 0 | 1 {
    const firstTime = resolveDateInput(first, firstName).getTime();
    const secondTime = resolveDateInput(second, secondName).getTime();
    if (firstTime < secondTime) {
        return -1;
    }
    if (firstTime > secondTime) {
        return 1;
    }
    return 0;
}

/**
 * The nearest candidate and the index it came from.
 */
export interface ClosestDateMatch {
    date: Date;
    index: number;
}

/**
 * Finds the candidate nearest to a target.
 *
 * On a tie the earlier candidate wins. Equal instants keep the first index.
 *
 * @param target - The instant to approach.
 * @param candidates - The dates to search.
 * @returns The match, or `undefined` when the list is empty.
 * @throws {@link TypeError} When `candidates` is not an array.
 * @throws {@link RangeError} When a value is not a real date.
 */
export function closestDate(
    target: unknown,
    candidates: readonly unknown[],
): ClosestDateMatch | undefined {
    if (!Array.isArray(candidates)) {
        throw typeError("candidates", "an array of dates", candidates);
    }
    const targetTime = resolveDateInput(target, "target").getTime();
    let match: ClosestDateMatch | undefined;
    let bestDistance = Number.POSITIVE_INFINITY;
    for (const [index, value] of candidates.entries()) {
        const date = resolveDateInput(value, `candidates[${String(index)}]`);
        const distance = Math.abs(date.getTime() - targetTime);
        const isCloser = distance < bestDistance;
        const isTieAndEarlier =
            distance === bestDistance &&
            match !== undefined &&
            date.getTime() < match.date.getTime();
        if (match === undefined || isCloser || isTieAndEarlier) {
            match = { date, index };
            bestDistance = distance;
        }
    }
    return match;
}

/**
 * @param dates - The dates to search.
 * @param direction - Which end to keep.
 * @returns A new date, or `undefined` when the list is empty.
 * @throws {@link TypeError} When `dates` is not an array.
 * @throws {@link RangeError} When an entry is not a real date.
 */
export function extremeDate(
    dates: readonly unknown[],
    direction: "earliest" | "latest",
): Date | undefined {
    if (!Array.isArray(dates)) {
        throw typeError("dates", "an array of dates", dates);
    }
    let chosen: Date | undefined;
    for (const [index, value] of dates.entries()) {
        const date = resolveDateInput(value, `dates[${String(index)}]`);
        if (chosen === undefined) {
            chosen = date;
            continue;
        }
        const isBetter =
            direction === "earliest"
                ? date.getTime() < chosen.getTime()
                : date.getTime() > chosen.getTime();
        if (isBetter) {
            chosen = date;
        }
    }
    return chosen;
}
