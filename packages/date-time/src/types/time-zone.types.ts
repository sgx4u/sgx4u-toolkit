/**
 * One change of a zone's offset from UTC.
 */
export interface TimeZoneTransition {
    instant: Date;
    offsetMinutesBefore: number;
    offsetMinutesAfter: number;
}

/**
 * Whether a wall-clock time exists once, twice, or not at all.
 */
export type WallTimeStatus = "valid" | "skipped" | "repeated";
