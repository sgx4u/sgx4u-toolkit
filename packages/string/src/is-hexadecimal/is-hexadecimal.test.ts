import { describe, expect, it } from "vitest";
import { isHexadecimal } from "./is-hexadecimal.js";

describe("isHexadecimal", () => {
    it("rejects a prefix, an empty string, and non-strings", () => {
        expect(isHexadecimal("deadBEEF")).toBe(true);
        expect(isHexadecimal("")).toBe(false);
        expect(isHexadecimal("0x1")).toBe(false);
        expect(isHexadecimal(null)).toBe(false);
    });
});
