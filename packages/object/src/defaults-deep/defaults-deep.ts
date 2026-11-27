import {
    arrayMergeValues,
    prototypeKeyValues,
} from "../constants/object-options.constants.js";
import { readChoice } from "../utils/describe-received.utils.js";
import type { DefaultsOptions } from "../utils/merge.utils.js";
import { defaultsDeepValues } from "../utils/merge.utils.js";
import { isObjectLikeValue } from "../utils/value-kind.utils.js";
import type { DefaultsDeepParams } from "./defaults-deep.types.js";

/**
 * Fills missing and `undefined` values at every level.
 *
 * Calls `defaultsDeepValues`. `object` wins, including a present `null`,
 * `0`, or `""`. Later defaults fill the remaining gaps. An array `defaults`
 * is a list of sources. The inputs are not mutated. Dangerous keys are
 * skipped unless `prototypeKeys` says otherwise.
 *
 * @param params - The source of truth, the defaults, and the policies.
 * @returns A new object or array, or `undefined` when `object` is not object-like or `defaults` is neither object-like nor an array.
 * @throws {RangeError} When `arrayMerge` or `prototypeKeys` is unknown, or when `prototypeKeys` is `"throw"` and a dangerous key is written.
 * @example
 * defaultsDeep({ object: { a: { b: 1 } }, defaults: { a: { c: 2 } } });
 */
export function defaultsDeep(params: DefaultsDeepParams): object | undefined {
    if (!isObjectLikeValue(params) || !isObjectLikeValue(params.object)) {
        return undefined;
    }
    const sources = listDefaultSources(params.defaults);
    if (sources === undefined) {
        return undefined;
    }
    const options: DefaultsOptions = {
        arrayMerge: readChoice(
            params.arrayMerge,
            "arrayMerge",
            arrayMergeValues,
            "replace",
        ),
        prototypeKeys: readChoice(
            params.prototypeKeys,
            "prototypeKeys",
            prototypeKeyValues,
            "skip",
        ),
    };
    return defaultsDeepValues(params.object, sources, options);
}

/**
 * Reads `defaults` as one object or a list of objects.
 *
 * @param value - The `defaults` argument.
 * @returns The sources, or `undefined` when `value` cannot be a source list.
 */
function listDefaultSources(value: unknown): readonly unknown[] | undefined {
    if (Array.isArray(value)) {
        return value;
    }
    if (isObjectLikeValue(value)) {
        return [value];
    }
    return undefined;
}
