import { describe, expect, it } from "vitest";
import { wrapText } from "./wrap-text.js";
describe("wrapText", () => {
    it("wraps on spaces", () => {
        expect(wrapText({ value: "hello world", maximumWidth: 8 })).toBe(
            "hello\nworld",
        );
        expect(wrapText({ value: "hi", maximumWidth: 10 })).toBe("hi");
        expect(() => wrapText({ value: "a", maximumWidth: 0 })).toThrow(
            RangeError,
        );
        expect(
            wrapText({ value: 1 as unknown as string, maximumWidth: 4 }),
        ).toBeUndefined();
    });
});
