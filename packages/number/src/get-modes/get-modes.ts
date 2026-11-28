/**
 * Returns every finite value with the highest frequency, sorted ascending. An empty list or a non-finite value returns an empty list.
 *
 * @example
 * getModes([1, 1, 2, 2, 3]);
 */
export function getModes(values: readonly number[]): number[] {
    if (values.length === 0) {
        return [];
    }
    const counts = new Map<number, number>();
    for (const value of values) {
        if (!Number.isFinite(value)) {
            return [];
        }
        counts.set(value, (counts.get(value) ?? 0) + 1);
    }
    let highest = 0;
    for (const count of counts.values()) {
        if (count > highest) {
            highest = count;
        }
    }
    return [...counts.keys()]
        .filter((value) => counts.get(value) === highest)
        .sort((left, right) => left - right);
}
