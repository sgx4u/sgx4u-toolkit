import { describe, expect, it } from "vitest";
import { isSafeNumberBigInt } from "../index.js";

describe("isSafeNumberBigInt", () => {
    it("covers the documented behavior", () => {
        expect(isSafeNumberBigInt(1n)).toBe(true);
        expect(isSafeNumberBigInt(BigInt(Number.MAX_SAFE_INTEGER) + 1n)).toBe(
            false,
        );
    });
});
