import { describe, expect, it } from "vitest";
import { isNonEmptyString } from "./is-non-empty-string.js";

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

describe("isNonEmptyString", () => {
    it("rejects an empty string and accepts whitespace", () => {
        expect(isNonEmptyString("")).toBe(false);
        expect(isNonEmptyString(" ")).toBe(true);
        expect(isNonEmptyString("a")).toBe(true);
    });
    it("returns false for non-strings", () => {
        for (const rejectedValue of rejectedValues) {
            expect(isNonEmptyString(rejectedValue)).toBe(false);
        }
    });
});
