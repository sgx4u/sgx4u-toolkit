import type { ArrayConfig } from "../types/config.types.js";
import { resolveArrayConfig } from "../utils/config.utils.js";
import { everyAsync } from "../every-async/every-async.js";
import { filterAsync } from "../filter-async/filter-async.js";
import { findAsync } from "../find-async/find-async.js";
import { flatMapAsync } from "../flat-map-async/flat-map-async.js";
import { forEachAsync } from "../for-each-async/for-each-async.js";
import { mapAsync } from "../map-async/map-async.js";
import { mapAsyncSettled } from "../map-async-settled/map-async-settled.js";
import { reduceAsync } from "../reduce-async/reduce-async.js";
import { someAsync } from "../some-async/some-async.js";

/**
 * The async helpers with `concurrency` from `createAsyncArray` bound in.
 */
export interface AsyncArrayToolkit {
    readonly everyAsync: typeof everyAsync;
    readonly filterAsync: typeof filterAsync;
    readonly findAsync: typeof findAsync;
    readonly flatMapAsync: typeof flatMapAsync;
    readonly forEachAsync: typeof forEachAsync;
    readonly mapAsync: typeof mapAsync;
    readonly mapAsyncSettled: typeof mapAsyncSettled;
    readonly reduceAsync: typeof reduceAsync;
    readonly someAsync: typeof someAsync;
}

/**
 * Returns a frozen set of async helpers with `config` bound in.
 *
 * Only `concurrency` changes call behavior. Other config fields are
 * validated and ignored. A per-call `concurrency` replaces the bound one.
 *
 * @param config - Defaults read once.
 * @returns A frozen toolkit.
 * @throws {@link TypeError} When `config` is not an object, or a field has the wrong type.
 * @throws {@link RangeError} When `concurrency` is not a positive integer or `Infinity`.
 * @example
 * const asyncArrays = createAsyncArray({ concurrency: 4 });
 */
export function createAsyncArray(config?: ArrayConfig): AsyncArrayToolkit {
    const resolved = resolveArrayConfig(config);
    const toolkit: AsyncArrayToolkit = {
        everyAsync: bindConcurrency(everyAsync, resolved.concurrency),
        filterAsync: bindConcurrency(filterAsync, resolved.concurrency),
        findAsync: bindConcurrency(findAsync, resolved.concurrency),
        flatMapAsync: bindConcurrency(flatMapAsync, resolved.concurrency),
        forEachAsync: bindConcurrency(forEachAsync, resolved.concurrency),
        mapAsync: bindConcurrency(mapAsync, resolved.concurrency),
        mapAsyncSettled: bindConcurrency(mapAsyncSettled, resolved.concurrency),
        reduceAsync,
        someAsync: bindConcurrency(someAsync, resolved.concurrency),
    };
    return Object.freeze(toolkit);
}

/**
 * Fills `concurrency` when the call omitted it.
 *
 * @param implementation - One async helper.
 * @param concurrency - The bound limit, if the config set one.
 * @returns The helper, or a wrapper with the same type.
 */
function bindConcurrency<FunctionType extends (input: never) => unknown>(
    implementation: FunctionType,
    concurrency: number | undefined,
): FunctionType {
    if (concurrency === undefined) {
        return implementation;
    }
    const call = implementation as unknown as (value: unknown) => unknown;
    return ((input: unknown) => {
        if (
            input !== null &&
            typeof input === "object" &&
            !Array.isArray(input)
        ) {
            const params: Record<string, unknown> = {
                ...(input as Record<string, unknown>),
            };
            if (params.concurrency === undefined) {
                params.concurrency = concurrency;
            }
            return call(params);
        }
        return call(input);
    }) as unknown as FunctionType;
}
