import { describe, expect, it } from "vitest";
import { isASCII } from "./is-ascii.js";

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

describe("isASCII", () => {
    it("checks the 0 through 127 range", () => {
        expect(isASCII("")).toBe(true);
        expect(isASCII("abc\n")).toBe(true);
        expect(isASCII("é")).toBe(false);
    });
    it("returns false for non-strings", () => {
        for (const rejectedValue of rejectedValues) {
            expect(isASCII(rejectedValue)).toBe(false);
        }
    });
});
