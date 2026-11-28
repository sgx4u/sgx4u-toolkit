import { describe, expect, it } from "vitest";
import { hasFullWidthCharacter } from "./has-full-width-character.js";

describe("hasFullWidthCharacter", () => {
    it("detects wide characters and emoji", () => {
        expect(hasFullWidthCharacter("あ")).toBe(true);
        expect(hasFullWidthCharacter("Ａ")).toBe(true);
        expect(hasFullWidthCharacter("😀")).toBe(true);
        expect(hasFullWidthCharacter("abc")).toBe(false);
        expect(hasFullWidthCharacter("")).toBe(false);
        expect(hasFullWidthCharacter(null)).toBe(false);
    });
});
