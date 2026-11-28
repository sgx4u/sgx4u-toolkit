import { describe, expect, it } from "vitest";
import { isBigInt } from "../index.js";

describe("isBigInt", () => {
    it("covers the documented behavior", () => {
        expect(isBigInt(1n)).toBe(true);
        expect(isBigInt(1)).toBe(false);
        expect(isBigInt("1")).toBe(false);
    });
});
