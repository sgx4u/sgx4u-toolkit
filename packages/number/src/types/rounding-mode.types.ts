/**
 * How a halfway case and the direction of rounding are chosen.
 *
 * The names and meanings match `Intl.NumberFormat`'s `roundingMode`.
 */
export type RoundingMode =
    | "ceil"
    | "floor"
    | "expand"
    | "trunc"
    | "halfCeil"
    | "halfFloor"
    | "halfExpand"
    | "halfTrunc"
    | "halfEven";
