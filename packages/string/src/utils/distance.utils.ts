/**
 * Levenshtein distance between two unit sequences.
 *
 * A substitution, insertion, or deletion costs 1. Equal sequences return 0.
 *
 * @param left - Units of the first string.
 * @param right - Units of the second string.
 * @returns The edit distance.
 */
export function levenshteinDistance(
    left: readonly string[],
    right: readonly string[],
): number {
    if (left.length === 0) {
        return right.length;
    }
    if (right.length === 0) {
        return left.length;
    }
    let previous = Array.from(
        { length: right.length + 1 },
        (_, index) => index,
    );
    for (let leftIndex = 0; leftIndex < left.length; leftIndex += 1) {
        const current = [leftIndex + 1];
        const leftUnit = left[leftIndex];
        for (let rightIndex = 0; rightIndex < right.length; rightIndex += 1) {
            const substitution =
                (previous[rightIndex] ?? 0) +
                (leftUnit === right[rightIndex] ? 0 : 1);
            const deletion = (current[rightIndex] ?? 0) + 1;
            const insertion = (previous[rightIndex + 1] ?? 0) + 1;
            current.push(Math.min(substitution, deletion, insertion));
        }
        previous = current;
    }
    return previous[right.length] ?? 0;
}

/**
 * Damerau-Levenshtein distance, including adjacent transpositions.
 *
 * @param left - Units of the first string.
 * @param right - Units of the second string.
 * @returns The edit distance.
 */
export function damerauLevenshteinDistance(
    left: readonly string[],
    right: readonly string[],
): number {
    const leftLength = left.length;
    const rightLength = right.length;
    const distances: number[][] = Array.from({ length: leftLength + 1 }, () =>
        Array.from({ length: rightLength + 1 }, () => 0),
    );
    for (let index = 0; index <= leftLength; index += 1) {
        const row = distances[index];
        if (row !== undefined) {
            row[0] = index;
        }
    }
    const firstRow = distances[0];
    if (firstRow !== undefined) {
        for (let index = 0; index <= rightLength; index += 1) {
            firstRow[index] = index;
        }
    }
    for (let leftIndex = 1; leftIndex <= leftLength; leftIndex += 1) {
        for (let rightIndex = 1; rightIndex <= rightLength; rightIndex += 1) {
            const cost = left[leftIndex - 1] === right[rightIndex - 1] ? 0 : 1;
            const row = distances[leftIndex];
            const previousRow = distances[leftIndex - 1];
            if (row === undefined || previousRow === undefined) {
                continue;
            }
            const deletion = (previousRow[rightIndex] ?? 0) + 1;
            const insertion = (row[rightIndex - 1] ?? 0) + 1;
            const substitution = (previousRow[rightIndex - 1] ?? 0) + cost;
            let best = Math.min(deletion, insertion, substitution);
            if (
                leftIndex > 1 &&
                rightIndex > 1 &&
                left[leftIndex - 1] === right[rightIndex - 2] &&
                left[leftIndex - 2] === right[rightIndex - 1]
            ) {
                const transposeRow = distances[leftIndex - 2];
                best = Math.min(
                    best,
                    (transposeRow?.[rightIndex - 2] ?? 0) + 1,
                );
            }
            row[rightIndex] = best;
        }
    }
    return distances[leftLength]?.[rightLength] ?? 0;
}

/**
 * Hamming distance.
 *
 * @param left - Units of the first string.
 * @param right - Units of the second string.
 * @returns The number of differing positions, or `undefined` when the lengths differ.
 */
export function hammingDistance(
    left: readonly string[],
    right: readonly string[],
): number | undefined {
    if (left.length !== right.length) {
        return undefined;
    }
    let distance = 0;
    for (let index = 0; index < left.length; index += 1) {
        if (left[index] !== right[index]) {
            distance += 1;
        }
    }
    return distance;
}

/**
 * Jaro-Winkler similarity from 0 to 1.
 *
 * The prefix scale is 0.1 and the shared prefix is capped at 4 units.
 *
 * @param left - Units of the first string.
 * @param right - Units of the second string.
 * @returns 1 when both sequences are empty or equal, otherwise the similarity.
 */
export function jaroWinklerSimilarity(
    left: readonly string[],
    right: readonly string[],
): number {
    if (left.length === 0 && right.length === 0) {
        return 1;
    }
    const jaro = jaroSimilarity(left, right);
    let prefix = 0;
    const limit = Math.min(4, left.length, right.length);
    while (prefix < limit && left[prefix] === right[prefix]) {
        prefix += 1;
    }
    return jaro + prefix * 0.1 * (1 - jaro);
}

/**
 * Sørensen–Dice coefficient on bigrams, from 0 to 1.
 *
 * @param left - Units of the first string.
 * @param right - Units of the second string.
 * @returns 1 when both sequences have no bigrams and are equal, otherwise the coefficient.
 */
export function diceCoefficient(
    left: readonly string[],
    right: readonly string[],
): number {
    if (left.length < 2 && right.length < 2) {
        return left.length === right.length && left[0] === right[0] ? 1 : 0;
    }
    const leftBigrams = bigramCounts(left);
    const rightBigrams = bigramCounts(right);
    let overlap = 0;
    let leftTotal = 0;
    let rightTotal = 0;
    for (const count of leftBigrams.values()) {
        leftTotal += count;
    }
    for (const count of rightBigrams.values()) {
        rightTotal += count;
    }
    for (const [bigram, count] of leftBigrams) {
        overlap += Math.min(count, rightBigrams.get(bigram) ?? 0);
    }
    if (leftTotal + rightTotal === 0) {
        return 0;
    }
    return (2 * overlap) / (leftTotal + rightTotal);
}

/**
 * Longest common subsequence, not necessarily contiguous.
 *
 * Ties keep the match that appears first in `left`.
 *
 * @param left - Units of the first string.
 * @param right - Units of the second string.
 * @returns The subsequence joined back into a string.
 */
export function longestCommonSubsequence(
    left: readonly string[],
    right: readonly string[],
): string {
    const rows = left.length + 1;
    const columns = right.length + 1;
    const scores: number[][] = Array.from({ length: rows }, () =>
        Array.from({ length: columns }, () => 0),
    );
    for (let leftIndex = left.length - 1; leftIndex >= 0; leftIndex -= 1) {
        for (
            let rightIndex = right.length - 1;
            rightIndex >= 0;
            rightIndex -= 1
        ) {
            const row = scores[leftIndex];
            const nextRow = scores[leftIndex + 1];
            if (row === undefined || nextRow === undefined) {
                continue;
            }
            if (left[leftIndex] === right[rightIndex]) {
                row[rightIndex] = (nextRow[rightIndex + 1] ?? 0) + 1;
            } else {
                row[rightIndex] = Math.max(
                    nextRow[rightIndex] ?? 0,
                    row[rightIndex + 1] ?? 0,
                );
            }
        }
    }
    const units: string[] = [];
    let leftIndex = 0;
    let rightIndex = 0;
    while (leftIndex < left.length && rightIndex < right.length) {
        if (left[leftIndex] === right[rightIndex]) {
            const unit = left[leftIndex];
            if (unit !== undefined) {
                units.push(unit);
            }
            leftIndex += 1;
            rightIndex += 1;
        } else if (
            (scores[leftIndex + 1]?.[rightIndex] ?? 0) >=
            (scores[leftIndex]?.[rightIndex + 1] ?? 0)
        ) {
            leftIndex += 1;
        } else {
            rightIndex += 1;
        }
    }
    return units.join("");
}

/**
 * Normalized Levenshtein similarity from 0 to 1.
 *
 * @param left - Units of the first string.
 * @param right - Units of the second string.
 * @returns 1 when both are empty. Otherwise `1 - distance / max(length, length)`.
 */
export function normalizedLevenshteinSimilarity(
    left: readonly string[],
    right: readonly string[],
): number {
    const longest = Math.max(left.length, right.length);
    if (longest === 0) {
        return 1;
    }
    return 1 - levenshteinDistance(left, right) / longest;
}

/**
 * Jaro similarity from 0 to 1.
 *
 * @param left - Units of the first string.
 * @param right - Units of the second string.
 * @returns The Jaro score.
 */
function jaroSimilarity(
    left: readonly string[],
    right: readonly string[],
): number {
    if (left.length === 0 && right.length === 0) {
        return 1;
    }
    if (left.length === 0 || right.length === 0) {
        return 0;
    }
    const matchDistance = Math.max(
        0,
        Math.floor(Math.max(left.length, right.length) / 2) - 1,
    );
    const leftMatches = Array.from({ length: left.length }, () => false);
    const rightMatches = Array.from({ length: right.length }, () => false);
    let matches = 0;
    for (let leftIndex = 0; leftIndex < left.length; leftIndex += 1) {
        const start = Math.max(0, leftIndex - matchDistance);
        const end = Math.min(right.length - 1, leftIndex + matchDistance);
        for (let rightIndex = start; rightIndex <= end; rightIndex += 1) {
            if (
                rightMatches[rightIndex] === true ||
                left[leftIndex] !== right[rightIndex]
            ) {
                continue;
            }
            leftMatches[leftIndex] = true;
            rightMatches[rightIndex] = true;
            matches += 1;
            break;
        }
    }
    if (matches === 0) {
        return 0;
    }
    let transpositions = 0;
    let rightIndex = 0;
    for (let leftIndex = 0; leftIndex < left.length; leftIndex += 1) {
        if (leftMatches[leftIndex] !== true) {
            continue;
        }
        while (rightMatches[rightIndex] !== true) {
            rightIndex += 1;
        }
        if (left[leftIndex] !== right[rightIndex]) {
            transpositions += 1;
        }
        rightIndex += 1;
    }
    const transpositionCount = transpositions / 2;
    return (
        (matches / left.length +
            matches / right.length +
            (matches - transpositionCount) / matches) /
        3
    );
}

/**
 * Counts adjacent unit pairs.
 *
 * @param units - The sequence.
 * @returns Counts keyed by the joined pair.
 */
function bigramCounts(units: readonly string[]): Map<string, number> {
    const counts = new Map<string, number>();
    for (let index = 0; index < units.length - 1; index += 1) {
        const bigram = `${units[index] ?? ""}\u0000${units[index + 1] ?? ""}`;
        counts.set(bigram, (counts.get(bigram) ?? 0) + 1);
    }
    return counts;
}
