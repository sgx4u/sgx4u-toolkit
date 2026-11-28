import { describe, expect, it } from "vitest";
import { isBlank } from "./is-blank.js";

const rejectedValues: readonly unknown[] = [
    null,
    undefined,
    0,
    1,
    false,
    true,
    {},
    [],
    new String("value"),
];

describe("isBlank", () => {
    it("accepts empty and unicode whitespace", () => {
        expect(isBlank("")).toBe(true);
        expect(isBlank(" \n\t")).toBe(true);
        expect(isBlank("\u00A0")).toBe(true);
        expect(isBlank("\u2003")).toBe(true);
        expect(isBlank("\uFEFF")).toBe(false);
        expect(isBlank("a")).toBe(false);
        expect(isBlank(" a ")).toBe(false);
    });
    it("returns false for non-strings", () => {
        for (const rejectedValue of rejectedValues) {
            expect(isBlank(rejectedValue)).toBe(false);
        }
    });
});
