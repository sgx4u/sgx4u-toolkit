import { describe, expect, it } from "vitest";
import { isSafeInteger } from "../index.js";

describe("isSafeInteger", () => {
    it("accepts safe integers", () => {
        expect(isSafeInteger(0)).toBe(true);
        expect(isSafeInteger(Number.MAX_SAFE_INTEGER)).toBe(true);
        expect(isSafeInteger(Number.MIN_SAFE_INTEGER)).toBe(true);
    });

    it("rejects unsafe integers and other values", () => {
        expect(isSafeInteger(Number.MAX_SAFE_INTEGER + 1)).toBe(false);
        expect(isSafeInteger(1.5)).toBe(false);
        expect(isSafeInteger(1n)).toBe(false);
    });
});
