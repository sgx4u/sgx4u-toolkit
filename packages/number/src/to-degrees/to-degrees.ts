/**
 * Converts radians to degrees. A non-finite value returns `undefined`.
 *
 * @example
 * toDegrees(Math.PI);
 */
export function toDegrees(radians: number): number | undefined {
    if (!Number.isFinite(radians)) {
        return undefined;
    }
    return (radians * 180) / Math.PI;
}
