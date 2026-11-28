import { describe, expect, it } from "vitest";
import { capitalize } from "./capitalize.js";

describe("capitalize", () => {
    it("changes the first grapheme", () => {
        expect(capitalize("hello")).toBe("Hello");
        expect(capitalize("ÉCLAIR")).toBe("Éclair");
        expect(capitalize({ value: "hELLO", restToLowerCase: false })).toBe(
            "HELLO",
        );
        expect(capitalize({ value: "istanbul", locale: "tr-TR" })).toBe(
            "İstanbul",
        );
        expect(capitalize("")).toBe("");
        expect(capitalize(null as unknown as string)).toBeUndefined();
    });
});
