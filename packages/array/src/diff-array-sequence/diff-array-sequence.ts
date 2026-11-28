import type { DiffArraySequenceParams } from "./diff-array-sequence.types.js";
import type { ArrayPatch } from "../types/patch.types.js";
import { resolveEquals } from "../utils/equality.utils.js";
import { readArray, readParams } from "../utils/params.utils.js";
import { sequencePatch } from "../utils/sequence.utils.js";

/**
 * Returns a sequence patch that turns `first` into `second`.
 *
 * The patch is keep, insert, and remove runs from a longest common
 * subsequence. Items in a keep run come from `second`. Either side not
 * being an array returns `undefined`. The inputs are not mutated.
 *
 * @param input - {@link DiffArraySequenceParams}.
 * @returns The patch, or `undefined` when either side is not an array.
 * @throws {@link TypeError} When `equals` is present and is not a function.
 * @example
 * diffArraySequence({ first: [1, 2, 3], second: [1, 3, 4] })
 */
export function diffArraySequence<Item>(
    params: DiffArraySequenceParams<Item>,
): ArrayPatch<Item>[] | undefined;
export function diffArraySequence(
    input: unknown,
): ArrayPatch<unknown>[] | undefined;
export function diffArraySequence(
    input: unknown,
): ArrayPatch<unknown>[] | undefined {
    const params = readParams<DiffArraySequenceParams<unknown>>(input);
    if (params === undefined) {
        return undefined;
    }
    const first = readArray(params.first);
    const second = readArray(params.second);
    if (first === undefined || second === undefined) {
        return undefined;
    }
    return sequencePatch(first, second, resolveEquals(params.equals));
}
