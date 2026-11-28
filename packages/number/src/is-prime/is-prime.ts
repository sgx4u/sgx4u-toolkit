/**
 * Reports whether `value` is a prime number.
 *
 * Values below 2, non-integers, and integers outside the safe range return `false`.
 *
 * @example
 * isPrime(2);
 */
export function isPrime(value: unknown): boolean {
    if (
        typeof value !== "number" ||
        !Number.isSafeInteger(value) ||
        value < 2
    ) {
        return false;
    }
    if (value % 2 === 0) {
        return value === 2;
    }
    if (value % 3 === 0) {
        return value === 3;
    }
    const limit = Math.floor(Math.sqrt(value));
    for (let factor = 5; factor <= limit; factor += 6) {
        if (value % factor === 0 || value % (factor + 2) === 0) {
            return false;
        }
    }
    return true;
}
