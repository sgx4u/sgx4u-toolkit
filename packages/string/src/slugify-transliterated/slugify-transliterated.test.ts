import { describe, expect, it } from "vitest";
import { slugifyTransliterated } from "./slugify-transliterated.js";

describe("slugifyTransliterated", () => {
    it("transliterates and then slugifies", () => {
        expect(slugifyTransliterated("Привет мир")).toBe("privet-mir");
        expect(slugifyTransliterated({ value: "Über", locale: "de" })).toBe(
            "ueber",
        );
    });
});
