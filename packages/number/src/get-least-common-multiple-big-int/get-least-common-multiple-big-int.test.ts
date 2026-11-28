import { describe, expect, it } from "vitest";
import { getLeastCommonMultipleBigInt } from "../index.js";

describe("getLeastCommonMultipleBigInt", () => {
    it("covers the documented behavior", () => {
        expect(getLeastCommonMultipleBigInt({ values: [4n, 6n] })).toBe(12n);
        expect(getLeastCommonMultipleBigInt({ values: [3n] })).toBeUndefined();
    });
});
