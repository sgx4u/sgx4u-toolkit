/**
 * Reports whether `value` is a `latitude, longitude` pair.
 *
 * Spaces around the comma are optional. Latitude is from -90 through 90
 * and longitude is from -180 through 180, including the endpoints. A
 * number may be a decimal. A leading `+` is accepted. A non-string
 * returns `false`. The input is not changed.
 *
 * @param value - Any value. Only a string can match.
 * @returns `true` when both numbers are in range.
 * @example
 * isLatLong("40.7, -74");
 */
export function isLatLong(value: unknown): boolean {
    if (typeof value !== "string") {
        return false;
    }
    const match = /^([+-]?\d+(?:\.\d+)?)\s*,\s*([+-]?\d+(?:\.\d+)?)$/u.exec(
        value,
    );
    if (match === null) {
        return false;
    }
    const latitude = Number(match[1]);
    const longitude = Number(match[2]);
    return (
        Number.isFinite(latitude) &&
        Number.isFinite(longitude) &&
        latitude >= -90 &&
        latitude <= 90 &&
        longitude >= -180 &&
        longitude <= 180
    );
}
