import { describe, expect, it } from "vitest";
import { stripIndent } from "./strip-indent.js";
describe("stripIndent", () => {
    it("keeps an unindented first line and does not drop newlines", () => {
        expect(stripIndent("a\n  b\n   c")).toBe("a\nb\n c");
        expect(stripIndent("\n  a\n")).toBe("\na\n");
        expect(stripIndent(null)).toBeUndefined();
    });
});
