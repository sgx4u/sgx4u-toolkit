/**
 * How a percentile or quantile picks a value from an ordered sample.
 *
 * `"linear"` and `"inclusive"` are Hyndman-Fan type 7. `"exclusive"` is
 * Hyndman-Fan type 6. The other names pick or average order statistics at
 * the type 7 position without a fractional blend, except `"midpoint"`,
 * which averages the two surrounding values.
 */
export type QuantileMethod =
    | "linear"
    | "inclusive"
    | "exclusive"
    | "nearest"
    | "lower"
    | "higher"
    | "midpoint";
