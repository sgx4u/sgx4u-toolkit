import { describe, expect, it } from "vitest";
import { isEmptyString } from "./is-empty-string.js";

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

describe("isEmptyString", () => {
    it("is true only for the empty string", () => {
        expect(isEmptyString("")).toBe(true);
        expect(isEmptyString(" ")).toBe(false);
    });
    it("returns false for non-strings", () => {
        for (const rejectedValue of rejectedValues) {
            expect(isEmptyString(rejectedValue)).toBe(false);
        }
    });
});
