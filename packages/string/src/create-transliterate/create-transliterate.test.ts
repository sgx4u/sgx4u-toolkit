import { describe, expect, it } from "vitest";
import { createTransliterate } from "./create-transliterate.js";

describe("createTransliterate", () => {
    it("binds locale and slug settings", () => {
        const german = createTransliterate({ locale: "de" });
        expect(german.transliterate("Äpfel")).toBe("Aepfel");
        expect(german.slugifyTransliterated("Größe")).toBe("groesse");
        expect(german.transliterate({ value: "Äpfel", locale: "en" })).toBe(
            "Apfel",
        );
        const underscored = createTransliterate({
            slugifySeparator: "_",
            slugifyLowerCase: false,
        });
        expect(underscored.slugifyTransliterated("Hello World")).toBe(
            "Hello_World",
        );
        expect(
            createTransliterate({ unit: "grapheme" }).transliterate("a"),
        ).toBe("a");
    });

    it("rejects an unknown config key", () => {
        expect(() =>
            createTransliterate({ nope: true } as { locale?: string }),
        ).toThrow(RangeError);
        expect(() => createTransliterate(null as unknown as object)).toThrow(
            TypeError,
        );
    });
});
