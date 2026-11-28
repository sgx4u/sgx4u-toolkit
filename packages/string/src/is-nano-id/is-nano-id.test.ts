import { describe, expect, it } from "vitest";
import { isNanoID } from "./is-nano-id.js";
describe("isNanoID", () => {
    it("checks the default length", () => {
        expect(isNanoID("A".repeat(21))).toBe(true);
        expect(isNanoID("short")).toBe(false);
        expect(() => isNanoID({ value: "a", length: 0 })).toThrow(RangeError);
    });
});
