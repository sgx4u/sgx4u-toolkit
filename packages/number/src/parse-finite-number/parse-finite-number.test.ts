import { describe, expect, it } from "vitest";
import { parseFiniteNumber } from "../index.js";

describe("parseFiniteNumber", () => {
    it("covers the documented behavior", () => {
        expect(parseFiniteNumber(8)).toBe(8);
        expect(parseFiniteNumber("8")).toBe(8);
        expect(parseFiniteNumber(Number.POSITIVE_INFINITY)).toBeUndefined();
    });
});
