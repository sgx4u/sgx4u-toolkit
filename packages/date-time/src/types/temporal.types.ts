/**
 * Anything that exposes a finite Unix time in milliseconds.
 *
 * Temporal `Instant` and `ZonedDateTime` both match.
 */
export interface TemporalInstantLike {
    readonly epochMilliseconds: number;
}

/**
 * The part of `Temporal.Instant` this package returns.
 *
 * The runtime object may have more methods. The package names only the
 * field it relies on, so it compiles where the Temporal types are absent.
 */
export interface TemporalInstant {
    readonly epochMilliseconds: number;
}
