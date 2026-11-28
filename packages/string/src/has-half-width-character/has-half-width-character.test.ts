import { describe, expect, it } from "vitest";
import { hasHalfWidthCharacter } from "./has-half-width-character.js";

describe("hasHalfWidthCharacter", () => {
    it("detects halfwidth forms", () => {
        expect(hasHalfWidthCharacter("ｱ")).toBe(true);
        expect(hasHalfWidthCharacter("abc")).toBe(false);
        expect(hasHalfWidthCharacter("あ")).toBe(false);
        expect(hasHalfWidthCharacter(null)).toBe(false);
    });
});
