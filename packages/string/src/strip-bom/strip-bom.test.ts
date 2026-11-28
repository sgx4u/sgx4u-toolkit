import { describe, expect, it } from "vitest";
import { stripBOM } from "./strip-bom.js";
describe("stripBOM", () => {
    it("removes one leading BOM", () => {
        expect(stripBOM("\uFEFFhello")).toBe("hello");
        expect(stripBOM("hello")).toBe("hello");
        expect(stripBOM("")).toBe("");
        expect(stripBOM(null)).toBeUndefined();
    });
});
