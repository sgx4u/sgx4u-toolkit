import type { ArrayConfig } from "../types/config.types.js";
import { resolveArrayConfig } from "../utils/config.utils.js";
import { getCartesianProduct } from "../get-cartesian-product/get-cartesian-product.js";
import { getCombinations } from "../get-combinations/get-combinations.js";
import { getPairs } from "../get-pairs/get-pairs.js";
import { getPermutations } from "../get-permutations/get-permutations.js";
import { getPowerSet } from "../get-power-set/get-power-set.js";

/**
 * The combinatorics helpers.
 *
 * `createCombinatorics` validates `ArrayConfig` and ignores fields these
 * functions do not read.
 */
export interface CombinatoricsToolkit {
    readonly getCartesianProduct: typeof getCartesianProduct;
    readonly getCombinations: typeof getCombinations;
    readonly getPairs: typeof getPairs;
    readonly getPermutations: typeof getPermutations;
    readonly getPowerSet: typeof getPowerSet;
}

/**
 * Returns a frozen set of combinatorics helpers.
 *
 * Config fields are validated so a bad `concurrency` or `random` fails
 * at creation. None of these functions read the config.
 *
 * @param config - Defaults read once. Omit it when there is nothing to validate.
 * @returns A frozen toolkit.
 * @throws {@link TypeError} When `config` is not an object, or a field has the wrong type.
 * @throws {@link RangeError} When a field is the right type but not usable.
 * @example
 * const combinatorics = createCombinatorics();
 */
export function createCombinatorics(
    config?: ArrayConfig,
): CombinatoricsToolkit {
    resolveArrayConfig(config);
    const toolkit: CombinatoricsToolkit = {
        getCartesianProduct,
        getCombinations,
        getPairs,
        getPermutations,
        getPowerSet,
    };
    return Object.freeze(toolkit);
}
