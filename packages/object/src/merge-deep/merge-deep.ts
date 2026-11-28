import {
    arrayMergeValues,
    circularValues,
    prototypeKeyValues,
} from "../constants/object-options.constants.js";
import {
    assertFunction,
    readChoice,
} from "../utils/describe-received.utils.js";
import { mergeDeepValues } from "../utils/merge.utils.js";
import type { MergeOptions, MergeVisit } from "../utils/merge.utils.js";
import { isObjectLikeValue } from "../utils/value-kind.utils.js";
import type { MergeDeepParams } from "./merge-deep.types.js";

/**
 * Deep-merges object-like values from left to right.
 *
 * Calls `mergeDeepValues`. Later plain objects overlay earlier ones. A
 * non-object item is ignored. When `customizer` returns `undefined`, the
 * merge util keeps its default rule for that key. The inputs are not
 * mutated. Dangerous keys are skipped unless `prototypeKeys` says otherwise.
 *
 * @param params - The sources and merge policies.
 * @returns A new object or array, or `undefined` when `objects` is not an array.
 * @throws {TypeError} When `customizer` is present and is not a function.
 * @throws {RangeError} When `arrayMerge`, `prototypeKeys`, or `circular` is unknown, or when `circular` is `"throw"` and a source cycle is found.
 * @example
 * mergeDeep({ objects: [{ a: 1 }, { b: 2 }] });
 */
export function mergeDeep(params: MergeDeepParams): object | undefined {
    if (!isObjectLikeValue(params) || !Array.isArray(params.objects)) {
        return undefined;
    }
    const customizer = readCustomizer(params.customizer);
    const options: MergeOptions = {
        arrayMerge: readChoice(
            params.arrayMerge,
            "arrayMerge",
            arrayMergeValues,
            "replace",
        ),
        circular: readChoice(
            params.circular,
            "circular",
            circularValues,
            "preserve",
        ),
        prototypeKeys: readChoice(
            params.prototypeKeys,
            "prototypeKeys",
            prototypeKeyValues,
            "skip",
        ),
    };
    if (customizer !== undefined) {
        options.customizer = customizer;
    }
    return mergeDeepValues(params.objects, options);
}

/**
 * Checks `customizer` when the caller passed one.
 *
 * @param value - The `customizer` field, which may be omitted.
 * @returns The customizer, or `undefined` when it was omitted.
 * @throws {TypeError} When `value` is present and is not a function.
 */
function readCustomizer(
    value: unknown,
): ((details: MergeVisit) => unknown) | undefined {
    if (value === undefined) {
        return undefined;
    }
    assertFunction(value, "customizer");
    return value as (details: MergeVisit) => unknown;
}
