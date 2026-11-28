import { describe, expect, it } from "vitest";
import { getQuotientAndRemainder } from "../index.js";

describe("getQuotientAndRemainder", () => {
    it("covers the documented behavior", () => {
        expect(getQuotientAndRemainder({ dividend: 5, divisor: 2 })).toEqual({
            quotient: 2,
            remainder: 1,
        });
        expect(
            getQuotientAndRemainder({ dividend: 5, divisor: 0 }),
        ).toBeUndefined();
    });
});
