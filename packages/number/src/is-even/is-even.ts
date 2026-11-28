/**
 * Reports whether `value` is a finite even integer. Fractions and non-numbers return `false`.
 *
 * @example
 * isEven(2);
 */
export function isEven(value: unknown): boolean {
    return (
        typeof value === "number" && Number.isInteger(value) && value % 2 === 0
    );
}
