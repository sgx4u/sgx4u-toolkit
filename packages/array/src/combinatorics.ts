/**
 * Combinatorics entry for `@sgx4u/array/combinatorics`. Re-exports only.
 */
export type { ArrayConfig } from "./types/config.types.js";

export { createCombinatorics } from "./create-combinatorics/create-combinatorics.js";
export type { CombinatoricsToolkit } from "./create-combinatorics/create-combinatorics.js";
export { getCartesianProduct } from "./get-cartesian-product/get-cartesian-product.js";
export type { GetCartesianProductParams } from "./get-cartesian-product/get-cartesian-product.types.js";
export { getCombinations } from "./get-combinations/get-combinations.js";
export type { GetCombinationsParams } from "./get-combinations/get-combinations.types.js";
export { getPairs } from "./get-pairs/get-pairs.js";
export { getPermutations } from "./get-permutations/get-permutations.js";
export type { GetPermutationsParams } from "./get-permutations/get-permutations.types.js";
export { getPowerSet } from "./get-power-set/get-power-set.js";
