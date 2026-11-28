import { describe, expect, it } from "vitest";
import { equalsIgnoreCase } from "./equals-ignore-case.js";
describe("equalsIgnoreCase", () => {
    it("ignores case and keeps accents", () => {
        expect(equalsIgnoreCase({ first: "A", second: "a" })).toBe(true);
        expect(equalsIgnoreCase({ first: "é", second: "e" })).toBe(false);
        expect(equalsIgnoreCase({ first: "É", second: "é" })).toBe(true);
        expect(
            equalsIgnoreCase({ first: "i", second: "İ", locale: "tr" }),
        ).toBe(true);
        expect(
            equalsIgnoreCase({ first: 1 as unknown as string, second: "a" }),
        ).toBe(false);
    });
});
