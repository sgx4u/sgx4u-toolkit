/**
 * Reports whether `value` is a finite odd integer. Fractions and non-numbers return `false`.
 *
 * @example
 * isOdd(3);
 */
export function isOdd(value: unknown): boolean {
    return (
        typeof value === "number" &&
        Number.isInteger(value) &&
        Math.abs(value % 2) === 1
    );
}
