import type { ByteStandard } from "../types/byte-standard.types.js";
import type { QuantileMethod } from "../types/quantile-method.types.js";
import type { RoundingMode } from "../types/rounding-mode.types.js";

/** Rounding mode used when a caller omits one. Ties move away from zero. */
export const defaultRoundingMode: RoundingMode = "halfExpand";

/** Quantile method used when a caller omits one. Hyndman-Fan type 7. */
export const defaultQuantileMethod: QuantileMethod = "linear";

/** Byte scale used when a caller omits one. Steps of 1000. */
export const defaultByteStandard: ByteStandard = "SI";

/**
 * Absolute difference that still counts as equal when a caller omits one.
 * Zero means only a zero difference passes the absolute check.
 */
export const defaultAbsoluteTolerance: number = 0;

/**
 * Relative difference that still counts as equal when a caller omits one.
 * Eight units of least precision at magnitude 1.
 */
export const defaultRelativeTolerance: number = Number.EPSILON * 8;

/** Largest sequence a range or unique-integer helper will allocate. */
export const maximumSequenceLength: number = 1_000_000;

/** Decimal places accepted by numeric rounding, in either direction. */
export const maximumPrecisionMagnitude: number = 308;
