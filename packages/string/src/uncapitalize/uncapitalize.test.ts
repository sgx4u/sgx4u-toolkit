import { describe, expect, it } from "vitest";
import { uncapitalize } from "./uncapitalize.js";

describe("uncapitalize", () => {
    it("lowercases only the first grapheme", () => {
        expect(uncapitalize("Hello")).toBe("hello");
        expect(uncapitalize("ABC")).toBe("aBC");
        expect(uncapitalize({ value: "I", locale: "tr-TR" })).toBe("ı");
        expect(uncapitalize("")).toBe("");
        expect(uncapitalize(1 as unknown as string)).toBeUndefined();
    });
});
