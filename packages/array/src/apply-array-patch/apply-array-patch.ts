import type { ApplyArrayPatchParams } from "./apply-array-patch.types.js";
import { typeError } from "../utils/errors.utils.js";
import { sameValueZero } from "../utils/equality.utils.js";
import { readArray, readParams } from "../utils/params.utils.js";

/**
 * Applies a sequence patch and returns the next array.
 *
 * `insert` appends the run's items and consumes nothing. `keep` requires
 * the next source items to match the run under SameValueZero and copies
 * those source items. `remove` requires the same match and skips the
 * source items. A keep or remove that does not match returns `undefined`.
 * Source items left over after the patch also return `undefined`.
 *
 * The patch must be an array of runs whose `type` is `"keep"`, `"insert"`,
 * or `"remove"` and whose `items` is an array. A value that is not a params
 * object, or whose `array` is not an array, returns `undefined`. Neither
 * input is mutated. Success returns a new array.
 *
 * @param input - {@link ApplyArrayPatchParams}.
 * @returns The next array, or `undefined` when the patch does not match.
 * @throws {@link TypeError} When `patch` is not an array, a run's `type` is not `"keep"`, `"insert"`, or `"remove"`, or a run's `items` is not an array.
 * @example
 * applyArrayPatch({
 *   array: [1, 2],
 *   patch: [
 *     { type: "keep", items: [1] },
 *     { type: "insert", items: [9] },
 *     { type: "remove", items: [2] },
 *   ],
 * })
 */
export function applyArrayPatch<Item>(
    params: ApplyArrayPatchParams<Item>,
): Item[] | undefined;
export function applyArrayPatch(input: unknown): unknown[] | undefined;
export function applyArrayPatch(input: unknown): unknown[] | undefined {
    const params = readParams<ApplyArrayPatchParams<unknown>>(input);
    if (params === undefined) {
        return undefined;
    }
    const array = readArray(params.array);
    if (array === undefined) {
        return undefined;
    }
    const runs = readPatch(params.patch);
    return applyRuns(array, runs);
}

interface PatchRun {
    type: "keep" | "insert" | "remove";
    items: readonly unknown[];
}

/**
 * @param patch - The caller's patch.
 * @returns The validated runs.
 * @throws {@link TypeError} When the patch or a run is malformed.
 */
function readPatch(patch: unknown): PatchRun[] {
    if (!Array.isArray(patch)) {
        throw typeError("patch", "an array", patch);
    }
    const runs: PatchRun[] = [];
    for (let index = 0; index < patch.length; index += 1) {
        const run = patch[index];
        if (run === null || typeof run !== "object") {
            throw typeError(
                "patch",
                'an array of runs whose type is "keep", "insert", or "remove"',
                run,
            );
        }
        const type = (run as { type?: unknown }).type;
        const items = (run as { items?: unknown }).items;
        if (type !== "keep" && type !== "insert" && type !== "remove") {
            throw typeError(
                "patch",
                'a run whose type is "keep", "insert", or "remove"',
                type,
            );
        }
        if (!Array.isArray(items)) {
            throw typeError("patch", "a run whose items are an array", items);
        }
        runs.push({ type, items });
    }
    return runs;
}

/**
 * @param array - The source array.
 * @param runs - Validated patch runs.
 * @returns The next array, or `undefined` when a run does not match.
 */
function applyRuns(
    array: readonly unknown[],
    runs: readonly PatchRun[],
): unknown[] | undefined {
    const result: unknown[] = [];
    let cursor = 0;
    for (const run of runs) {
        if (run.type === "insert") {
            for (let index = 0; index < run.items.length; index += 1) {
                result.push(run.items[index] as unknown);
            }
            continue;
        }
        for (let index = 0; index < run.items.length; index += 1) {
            if (cursor >= array.length) {
                return undefined;
            }
            const sourceItem = array[cursor] as unknown;
            if (!sameValueZero(sourceItem, run.items[index])) {
                return undefined;
            }
            if (run.type === "keep") {
                result.push(sourceItem);
            }
            cursor += 1;
        }
    }
    if (cursor !== array.length) {
        return undefined;
    }
    return result;
}
