import { describe, expect, it } from "vitest";
import { isString } from "./is-string.js";

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

describe("isString", () => {
    it("accepts every string primitive", () => {
        expect(isString("")).toBe(true);
        expect(isString("hello")).toBe(true);
    });
    it("returns false for non-strings", () => {
        for (const rejectedValue of rejectedValues) {
            expect(isString(rejectedValue)).toBe(false);
        }
    });
});
