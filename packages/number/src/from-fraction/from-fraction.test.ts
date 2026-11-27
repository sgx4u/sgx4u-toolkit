import { describe, expect, it } from "vitest";
import { fromFraction } from "../index.js";

describe("fromFraction", () => {
    it("covers the documented behavior", () => {
        expect(fromFraction({ numerator: 1, denominator: 4 })).toBe(0.25);
        expect(fromFraction({ numerator: 1, denominator: 0 })).toBeUndefined();
    });
});
