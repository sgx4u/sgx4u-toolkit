/**
 * Returns the sign of a finite number, including `-0`. Non-finite values return `undefined`.
 *
 * @example
 * getSign(-4);
 */
export function getSign(value: number): number | undefined {
    if (!Number.isFinite(value)) {
        return undefined;
    }
    return Math.sign(value);
}
