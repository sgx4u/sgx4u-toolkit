/**
 * Converts degrees to radians. A non-finite value returns `undefined`.
 *
 * @example
 * toRadians(180);
 */
export function toRadians(degrees: number): number | undefined {
    if (!Number.isFinite(degrees)) {
        return undefined;
    }
    return (degrees * Math.PI) / 180;
}
