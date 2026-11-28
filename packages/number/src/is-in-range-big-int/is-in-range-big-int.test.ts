import { describe, expect, it } from "vitest";
import { isInRangeBigInt } from "../index.js";

describe("isInRangeBigInt", () => {
    it("covers the documented behavior", () => {
        expect(isInRangeBigInt({ value: 1n, start: 0n, end: 2n })).toBe(true);
        expect(isInRangeBigInt({ value: 2n, start: 0n, end: 2n })).toBe(false);
        expect(
            isInRangeBigInt({
                value: 2n,
                start: 0n,
                end: 2n,
                includeEnd: true,
            }),
        ).toBe(true);
    });
});
