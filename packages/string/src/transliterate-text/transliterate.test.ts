import { describe, expect, it } from "vitest";
import { transliterate } from "./transliterate.js";

describe("transliterate", () => {
    it("maps Latin, Greek, Cyrillic, Arabic, Hebrew, and Devanagari", () => {
        expect(transliterate("Äpfel")).toBe("Apfel");
        expect(transliterate({ value: "Äpfel", locale: "de" })).toBe("Aepfel");
        expect(transliterate({ value: "Größe", locale: "de-DE" })).toBe(
            "Groesse",
        );
        expect(transliterate("β")).toBe("v");
        expect(transliterate("Привет")).toBe("Privet");
        expect(transliterate("ب")).toBe("b");
        expect(transliterate("ש")).toBe("sh");
        expect(transliterate("क")).toBe("k");
        expect(transliterate("")).toBe("");
        expect(transliterate(null as never)).toBeUndefined();
    });

    it("rejects an empty locale", () => {
        expect(() => transliterate({ value: "a", locale: "" })).toThrow(
            RangeError,
        );
    });
});
