import { describe, expect, it } from "vitest";
import { toPascalCase } from "./to-pascal-case.js";

describe("toPascalCase", () => {
    it("converts words to pascal case", () => {
        expect(toPascalCase("foo bar")).toBe("FooBar");
        expect(toPascalCase("XMLHttpRequest")).toBe("XmlHttpRequest");
        expect(toPascalCase("__typename")).toBe("Typename");
        expect(toPascalCase("")).toBe("");
        expect(toPascalCase(null as never)).toBeUndefined();
    });

    it("keeps a leading acronym when asked", () => {
        expect(
            toPascalCase({
                value: "XMLHttpRequest",
                keepConsecutiveUppercase: true,
            }),
        ).toBe("XMLHttpRequest");
        expect(toPascalCase({ value: "i", locale: "tr-TR" })).toBe("İ");
    });
});
