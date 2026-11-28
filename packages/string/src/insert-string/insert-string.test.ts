import { describe, expect, it } from "vitest";
import { insertString } from "./insert-string.js";
describe("insertString", () => {
    it("inserts and clamps", () => {
        expect(insertString({ value: "ac", index: 1, insertion: "b" })).toBe(
            "abc",
        );
        expect(insertString({ value: "a", index: 9, insertion: "b" })).toBe(
            "ab",
        );
        expect(
            insertString({
                value: 1 as unknown as string,
                index: 0,
                insertion: "b",
            }),
        ).toBeUndefined();
    });
});
