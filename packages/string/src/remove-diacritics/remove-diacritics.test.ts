import { describe, expect, it } from "vitest";
import { removeDiacritics } from "./remove-diacritics.js";

describe("removeDiacritics", () => {
    it("removes combining marks and maps a few Latin letters", () => {
        expect(removeDiacritics("Café")).toBe("Cafe");
        expect(removeDiacritics("Å")).toBe("A");
        expect(removeDiacritics("ß")).toBe("ss");
        expect(removeDiacritics("")).toBe("");
    });

    it("keeps CJK letters", () => {
        expect(removeDiacritics("你好")).toBe("你好");
    });

    it("does not change the input", () => {
        const value = "Café";
        removeDiacritics(value);
        expect(value).toBe("Café");
    });

    it("returns undefined for a non-string", () => {
        expect(removeDiacritics(1 as never)).toBeUndefined();
        expect(removeDiacritics(null as never)).toBeUndefined();
        expect(removeDiacritics(undefined as never)).toBeUndefined();
    });
});
