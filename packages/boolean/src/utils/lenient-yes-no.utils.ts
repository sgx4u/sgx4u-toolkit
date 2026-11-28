/**
 * QWERTY neighbors for a–z, in alphabet order, not including the letter.
 *
 * One wrong neighboring key is the typo `lenient` accepts for `yes` and `no`.
 */
const neighborGroups: readonly string[] = [
    "qwszx",
    "fghvn",
    "sdfxv",
    "wersfxcv",
    "wrsdf",
    "ertdgcvb",
    "rtyfhvbn",
    "tyugjbnm",
    "uojkl",
    "yuihknm",
    "uiojlm",
    "iopk",
    "hjkn",
    "ghjbm",
    "ipkl",
    "ol",
    "was",
    "etdfg",
    "qweadzxc",
    "ryfgh",
    "yihjk",
    "dfgcb",
    "qeasd",
    "asdzc",
    "tughj",
    "asx",
];

/**
 * Whether `candidate` is English `yes` or `no`, or one neighboring-key typo.
 *
 * Call this only after the strict word lists miss. An exact `yes` or `no`
 * is included so a `"replace"` list that dropped those words can still
 * accept them when `lenient` is set. The candidate must already be folded
 * the way English tokens are folded.
 *
 * A typo has the same length and exactly one different character, and that
 * character is a QWERTY neighbor of the intended one. `yss` matches `yes`
 * because `s` is next to `e`. `mo` matches `no` because `m` is next to `n`.
 * An extra letter, a missing letter, or a swap does not match.
 *
 * @param candidate - The folded candidate. Not trimmed here.
 * @returns `true` for `yes`, `false` for `no`, or `undefined` when neither matches.
 */
export function matchesLenientYesOrNo(candidate: string): boolean | undefined {
    if (isNeighborTypo(candidate, "yes")) {
        return true;
    }
    if (isNeighborTypo(candidate, "no")) {
        return false;
    }
    return undefined;
}

/**
 * Whether `candidate` is `target` or one neighboring substitution of it.
 *
 * @param candidate - Folded text from the caller.
 * @param target - `yes` or `no`.
 * @returns `true` when the candidate should take that meaning.
 */
function isNeighborTypo(candidate: string, target: string): boolean {
    if (candidate === target) {
        return true;
    }
    if (candidate.length !== target.length) {
        return false;
    }
    let differenceIndex = -1;
    for (let index = 0; index < candidate.length; index += 1) {
        if (candidate[index] === target[index]) {
            continue;
        }
        if (differenceIndex !== -1) {
            return false;
        }
        differenceIndex = index;
    }
    return charactersAdjacent(
        candidate[differenceIndex],
        target[differenceIndex],
    );
}

/**
 * Whether two letters share an edge or a corner on a QWERTY keyboard.
 *
 * @param left - The typed character.
 * @param right - The character in `yes` or `no`.
 * @returns `true` when `right` is a neighbor of `left`.
 */
function charactersAdjacent(
    left: string | undefined,
    right: string | undefined,
): boolean {
    if (left === undefined || right === undefined) {
        return false;
    }
    const neighbors = neighborGroups[left.charCodeAt(0) - 97];
    return neighbors !== undefined && neighbors.includes(right);
}
