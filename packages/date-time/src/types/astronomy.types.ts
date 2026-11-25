/**
 * Sun events for one civil day at one location.
 *
 * `sunrise` and `sunset` are absent during polar day and polar night.
 * Dawn and dusk are the moments the sun is 6 degrees below the horizon.
 */
export interface SunTimes {
    solarNoon: Date;
    sunrise?: Date;
    sunset?: Date;
    civilDawn?: Date;
    civilDusk?: Date;
}

/**
 * One of the eight named phases of the Moon.
 */
export type MoonPhaseName =
    | "new-moon"
    | "waxing-crescent"
    | "first-quarter"
    | "waxing-gibbous"
    | "full-moon"
    | "waning-gibbous"
    | "last-quarter"
    | "waning-crescent";

/**
 * A meteorological or astronomical season.
 */
export type Season = "spring" | "summer" | "autumn" | "winter";

/**
 * Phase of the Moon at one instant.
 *
 * `fraction` is in `[0, 1)`, measured from the new moon.
 */
export interface MoonPhase {
    fraction: number;
    name: MoonPhaseName;
}
