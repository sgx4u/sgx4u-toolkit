import { describe, expect, it } from "vitest";
import { sumBigInt } from "../index.js";

describe("sumBigInt", () => {
    it("covers the documented behavior", () => {
        expect(sumBigInt([])).toBe(0n);
        expect(sumBigInt([1n, 2n, 3n])).toBe(6n);
    });
});
