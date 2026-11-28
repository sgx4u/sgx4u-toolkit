/**
 * Returns the absolute value of a finite number.
 *
 * @example
 * getAbsolute(-4);
 */
export function getAbsolute(value: number): number | undefined {
    if (!Number.isFinite(value)) {
        return undefined;
    }
    return Math.abs(value);
}
