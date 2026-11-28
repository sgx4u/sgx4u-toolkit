import { describe, expect, it } from "vitest";
import { bigIntToNumber } from "../index.js";

describe("bigIntToNumber", () => {
    it("covers the documented behavior", () => {
        expect(bigIntToNumber(12n)).toBe(12);
        expect(
            bigIntToNumber(BigInt(Number.MAX_SAFE_INTEGER) + 1n),
        ).toBeUndefined();
    });
});
