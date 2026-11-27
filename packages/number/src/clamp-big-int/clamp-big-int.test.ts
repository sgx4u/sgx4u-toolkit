import { describe, expect, it } from "vitest";
import { clampBigInt } from "../index.js";

describe("clampBigInt", () => {
    it("covers the documented behavior", () => {
        expect(clampBigInt({ value: 5n, lower: 0n, upper: 3n })).toBe(3n);
        expect(clampBigInt({ value: 1n, lower: 0n, upper: 3n })).toBe(1n);
        expect(() => clampBigInt({ value: 1n, lower: 2n, upper: 1n })).toThrow(
            RangeError,
        );
    });
});
