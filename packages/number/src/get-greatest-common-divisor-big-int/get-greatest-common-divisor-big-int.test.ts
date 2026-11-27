import { describe, expect, it } from "vitest";
import { getGreatestCommonDivisorBigInt } from "../index.js";

describe("getGreatestCommonDivisorBigInt", () => {
    it("covers the documented behavior", () => {
        expect(getGreatestCommonDivisorBigInt({ values: [12n, 18n] })).toBe(6n);
        expect(
            getGreatestCommonDivisorBigInt({ values: [4n] }),
        ).toBeUndefined();
    });
});
