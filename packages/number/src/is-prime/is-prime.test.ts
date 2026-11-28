import { describe, expect, it } from "vitest";
import { isPrime } from "../index.js";

describe("isPrime", () => {
    it("accepts primes", () => {
        expect(isPrime(2)).toBe(true);
        expect(isPrime(3)).toBe(true);
        expect(isPrime(17)).toBe(true);
    });

    it("rejects composites and non-integers", () => {
        expect(isPrime(1)).toBe(false);
        expect(isPrime(0)).toBe(false);
        expect(isPrime(4)).toBe(false);
        expect(isPrime(9)).toBe(false);
        expect(isPrime(25)).toBe(false);
        expect(isPrime(1.5)).toBe(false);
        expect(isPrime(-5)).toBe(false);
        expect(isPrime("2")).toBe(false);
    });
});
