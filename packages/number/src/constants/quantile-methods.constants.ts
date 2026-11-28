import type { QuantileMethod } from "../types/quantile-method.types.js";

/** Every quantile method this package accepts. */
export const quantileMethods: readonly QuantileMethod[] = [
    "linear",
    "inclusive",
    "exclusive",
    "nearest",
    "lower",
    "higher",
    "midpoint",
];
