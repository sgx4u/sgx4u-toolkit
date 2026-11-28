import type { TimeUnit } from "./time.types.js";

/**
 * A signed relative-time value. Negative means the past.
 */
export interface RelativeTimeParts {
    value: number;
    unit: TimeUnit;
}

/**
 * A countdown that never goes negative.
 *
 * After the target instant, every part is `0` and `isComplete` is `true`.
 */
export interface CountdownParts {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    milliseconds: number;
    totalMilliseconds: number;
    isComplete: boolean;
}
