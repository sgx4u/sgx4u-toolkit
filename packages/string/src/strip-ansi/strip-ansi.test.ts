import { describe, expect, it } from "vitest";
import { stripANSI } from "./strip-ansi.js";
describe("stripANSI", () => {
    it("removes a color sequence", () => {
        expect(stripANSI("\u001b[31mred\u001b[0m")).toBe("red");
        expect(stripANSI("plain")).toBe("plain");
        expect(stripANSI(null)).toBeUndefined();
    });
});
