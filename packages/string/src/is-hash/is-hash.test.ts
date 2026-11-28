import { describe, expect, it } from "vitest";
import { isHash } from "./is-hash.js";
describe("isHash", () => {
    it("checks length", () => {
        expect(isHash({ value: "a".repeat(32), algorithm: "md5" })).toBe(true);
        expect(isHash({ value: "zz", algorithm: "md5" })).toBe(false);
        expect(() => isHash({ value: "a", algorithm: "nope" })).toThrow(
            RangeError,
        );
        expect(isHash("abc")).toBe(false);
    });
});
