import { describe, expect, it } from "vitest";
import { indent } from "./indent.js";
describe("indent", () => {
    it("prefixes non-empty lines", () => {
        expect(indent({ value: "a\n\nb" })).toBe(" a\n\n b");
        expect(indent({ value: "a", count: 2, character: "." })).toBe("..a");
        expect(() => indent({ value: "a", count: -1 })).toThrow(RangeError);
        expect(indent({ value: 1 as unknown as string })).toBeUndefined();
    });
});
