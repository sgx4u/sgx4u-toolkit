import { describe, expect, it } from "vitest";
import { collapseWhitespace } from "./collapse-whitespace.js";
describe("collapseWhitespace", () => {
    it("collapses runs and trims ends", () => {
        expect(collapseWhitespace("  a   b  ")).toBe("a b");
        expect(collapseWhitespace("a\u00A0\u00A0b")).toBe("a b");
        expect(collapseWhitespace("\uFEFFa")).toBe("\uFEFFa");
        expect(collapseWhitespace("")).toBe("");
        expect(collapseWhitespace(null)).toBeUndefined();
    });
});
