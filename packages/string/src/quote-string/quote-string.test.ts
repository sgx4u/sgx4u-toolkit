import { describe, expect, it } from "vitest";
import { quoteString } from "./quote-string.js";
describe("quoteString", () => {
    it("quotes and escapes", () => {
        expect(quoteString("a")).toBe('"a"');
        expect(quoteString({ value: "a" })).toBe('"a"');
        expect(quoteString({ value: 'a"b', style: "double" })).toBe('"a\\"b"');
        expect(quoteString({ value: "a\\b" })).toBe('"a\\\\b"');
        expect(quoteString({ value: "a", style: "single" })).toBe("'a'");
        expect(quoteString({ value: "a`b", style: "backtick" })).toBe(
            "`a\\`b`",
        );
        expect(() =>
            quoteString({ value: "a", style: "none" as "double" }),
        ).toThrow(RangeError);
    });
});
