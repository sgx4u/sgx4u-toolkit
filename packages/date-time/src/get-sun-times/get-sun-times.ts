import type { DateInput } from "../types/date-input.types.js";
import type { TimeZoneOptions } from "../types/options.types.js";
import type { SunTimes } from "../types/astronomy.types.js";
import { resolveDateInput } from "../utils/date-input.utils.js";
import { rangeError, typeError } from "../utils/error.utils.js";
import { utcEpochMilliseconds } from "../utils/gregorian.utils.js";
import { readDateParts, resolveTimeZone } from "../utils/time-zone.utils.js";

const officialZenith = 90.833;
const civilZenith = 96;

/**
 * A place on Earth. Latitude and longitude are degrees. North and east are positive.
 */
export interface SunLocation {
    latitude: number;
    longitude: number;
}

/**
 * Returns sunrise, sunset, solar noon, and civil twilight for one day.
 *
 * The calculation is the NOAA solar-position approximation, iterated at the
 * candidate instant. `sunrise` and `sunset` are absent during polar day or
 * polar night. For latitudes between -65 and 65 the result is within about
 * one minute of the refraction-corrected sunrise. At the equator on the
 * March equinox that instant is near 06:04 UTC, because of the equation of
 * time and the 0.833° sunrise zenith, not 06:00.
 *
 * @param date - Any instant on the civil day to compute, in `timeZone`.
 * @param location - Latitude and longitude in degrees.
 * @param options - `timeZone` defaults to the system zone and chooses the civil day.
 * @returns The sun events for that day.
 * @throws {@link TypeError} When the location is not an object of numbers.
 * @throws {@link RangeError} When a coordinate is outside its range or `date` is invalid.
 * @example
 * getSunTimes("2024-06-21T12:00:00Z", { latitude: 40.7, longitude: -74 }, { timeZone: "America/New_York" }).solarNoon.toISOString();
 */
export function getSunTimes(
    date: DateInput,
    location: SunLocation,
    options?: TimeZoneOptions,
): SunTimes {
    if (
        location === null ||
        typeof location !== "object" ||
        !Number.isFinite(location.latitude) ||
        !Number.isFinite(location.longitude)
    ) {
        throw typeError(
            "location",
            "an object with latitude and longitude",
            location,
        );
    }
    if (location.latitude < -90 || location.latitude > 90) {
        throw rangeError(
            "location.latitude",
            "a number from -90 to 90",
            location.latitude,
        );
    }
    if (location.longitude < -180 || location.longitude > 180) {
        throw rangeError(
            "location.longitude",
            "a number from -180 to 180",
            location.longitude,
        );
    }
    const timeZone = resolveTimeZone(options?.timeZone);
    const parts = readDateParts(
        resolveDateInput(date, "date", timeZone).getTime(),
        timeZone,
    );
    const noonUtc = utcEpochMilliseconds(
        parts.year,
        parts.month - 1,
        parts.day,
        12,
        0,
        0,
        0,
    );
    const result: SunTimes = {
        solarNoon:
            refinedEvent(noonUtc, location, 0) ??
            dateFromMinutes(noonUtc, 720 - 4 * location.longitude),
    };
    const sunrise = refinedEvent(noonUtc, location, -1, officialZenith);
    const sunset = refinedEvent(noonUtc, location, 1, officialZenith);
    const civilDawn = refinedEvent(noonUtc, location, -1, civilZenith);
    const civilDusk = refinedEvent(noonUtc, location, 1, civilZenith);
    if (sunrise !== undefined) {
        result.sunrise = sunrise;
    }
    if (sunset !== undefined) {
        result.sunset = sunset;
    }
    if (civilDawn !== undefined) {
        result.civilDawn = civilDawn;
    }
    if (civilDusk !== undefined) {
        result.civilDusk = civilDusk;
    }
    return result;
}

/**
 * Refines one sun event by reading the sun position at the candidate time.
 *
 * `side` is `-1` before noon, `1` after noon, and `0` for solar noon.
 *
 * @param noonUtc - UTC noon of the civil day.
 * @param location - Latitude and longitude.
 * @param side - Which side of noon to solve.
 * @param zenith - The zenith angle. Omit it for solar noon.
 * @returns The event, or `undefined` when the sun does not cross `zenith`.
 */
function refinedEvent(
    noonUtc: number,
    location: SunLocation,
    side: -1 | 0 | 1,
    zenith?: number,
): Date | undefined {
    let minutes = 720 - 4 * location.longitude;
    for (let iteration = 0; iteration < 3; iteration += 1) {
        const position = sunPosition(
            (noonUtc - 12 * 3_600_000 + minutes * 60_000) / 86_400_000 +
                2_440_587.5,
        );
        const solarNoonMinutes =
            720 - 4 * location.longitude - position.equationOfTimeMinutes;
        if (side === 0 || zenith === undefined) {
            minutes = solarNoonMinutes;
            continue;
        }
        const angle = hourAngle(
            location.latitude,
            position.declinationDegrees,
            zenith,
        );
        if (angle === undefined) {
            return undefined;
        }
        minutes = solarNoonMinutes + side * angle * 4;
    }
    return dateFromMinutes(noonUtc, minutes);
}

/**
 * @param julianDay - The Julian day number.
 * @returns The sun's declination and the equation of time in minutes.
 */
function sunPosition(julianDay: number): {
    declinationDegrees: number;
    equationOfTimeMinutes: number;
} {
    const century = (julianDay - 2_451_545) / 36_525;
    const meanLongitude = wrap360(
        280.46646 + century * (36_000.76983 + century * 0.0003032),
    );
    const meanAnomaly =
        357.52911 + century * (35_999.05029 - 0.0001537 * century);
    const eccentricity =
        0.016708634 - century * (0.000042037 + 0.0000001267 * century);
    const anomalyRadians = radians(meanAnomaly);
    const center =
        Math.sin(anomalyRadians) *
            (1.914602 - century * (0.004817 + 0.000014 * century)) +
        Math.sin(2 * anomalyRadians) * (0.019993 - 0.000101 * century) +
        Math.sin(3 * anomalyRadians) * 0.000289;
    const trueLongitude = meanLongitude + center;
    const omega = 125.04 - 1934.136 * century;
    const apparentLongitude =
        trueLongitude - 0.00569 - 0.00478 * Math.sin(radians(omega));
    const meanObliquity =
        23 +
        (26 +
            (21.448 -
                century * (46.815 + century * (0.00059 - century * 0.001813))) /
                60) /
            60;
    const correctedObliquity =
        meanObliquity + 0.00256 * Math.cos(radians(omega));
    const declinationDegrees = degrees(
        Math.asin(
            Math.sin(radians(correctedObliquity)) *
                Math.sin(radians(apparentLongitude)),
        ),
    );
    const y = Math.tan(radians(correctedObliquity / 2)) ** 2;
    const longitudeRadians = radians(meanLongitude);
    const equationOfTimeMinutes =
        4 *
        degrees(
            y * Math.sin(2 * longitudeRadians) -
                2 * eccentricity * Math.sin(anomalyRadians) +
                4 *
                    eccentricity *
                    y *
                    Math.sin(anomalyRadians) *
                    Math.cos(2 * longitudeRadians) -
                0.5 * y * y * Math.sin(4 * longitudeRadians) -
                1.25 *
                    eccentricity *
                    eccentricity *
                    Math.sin(2 * anomalyRadians),
        );
    return { declinationDegrees, equationOfTimeMinutes };
}

/**
 * @param latitude - Degrees north.
 * @param declination - The sun's declination in degrees.
 * @param zenith - The zenith angle in degrees.
 * @returns The hour angle in degrees, or `undefined` when the sun does not cross that zenith.
 */
function hourAngle(
    latitude: number,
    declination: number,
    zenith: number,
): number | undefined {
    const latitudeRadians = radians(latitude);
    const declinationRadians = radians(declination);
    const cosine =
        Math.cos(radians(zenith)) /
            (Math.cos(latitudeRadians) * Math.cos(declinationRadians)) -
        Math.tan(latitudeRadians) * Math.tan(declinationRadians);
    if (cosine > 1 || cosine < -1) {
        return undefined;
    }
    return degrees(Math.acos(cosine));
}

/**
 * @param noonUtc - UTC noon of the civil day, used as the day anchor.
 * @param minutesFromUtcMidnight - Minutes from 00:00 UTC, which may fall outside 0 through 1440.
 * @returns The instant.
 */
function dateFromMinutes(
    noonUtc: number,
    minutesFromUtcMidnight: number,
): Date {
    const utcMidnight = noonUtc - 12 * 3_600_000;
    return new Date(utcMidnight + minutesFromUtcMidnight * 60_000);
}

/**
 * @param degreesValue - An angle in degrees.
 * @returns The same angle in radians.
 */
function radians(degreesValue: number): number {
    return (degreesValue * Math.PI) / 180;
}

/**
 * @param radiansValue - An angle in radians.
 * @returns The same angle in degrees.
 */
function degrees(radiansValue: number): number {
    return (radiansValue * 180) / Math.PI;
}

/**
 * @param degreesValue - An angle that may fall outside 0 through 360.
 * @returns The angle wrapped into `[0, 360)`.
 */
function wrap360(degreesValue: number): number {
    const wrapped = degreesValue % 360;
    return wrapped < 0 ? wrapped + 360 : wrapped;
}
