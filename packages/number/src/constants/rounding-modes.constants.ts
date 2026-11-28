import type { RoundingMode } from "../types/rounding-mode.types.js";

/** Every rounding mode this package accepts, in documentation order. */
export const roundingModes: readonly RoundingMode[] = [
    "ceil",
    "floor",
    "expand",
    "trunc",
    "halfCeil",
    "halfFloor",
    "halfExpand",
    "halfTrunc",
    "halfEven",
];
