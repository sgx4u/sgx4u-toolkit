import { describe, expect, it } from "vitest";
import { getExcerpt } from "./get-excerpt.js";

describe("getExcerpt", () => {
    it("keeps short text and cuts long text on a word", () => {
        expect(getExcerpt("Hi")).toBe("Hi");
        expect(
            getExcerpt({ value: "The quick brown fox", maximumLength: 12 }),
        ).toBe("The quick\u2026");
        expect(
            getExcerpt({
                value: "The quick brown fox",
                maximumLength: 12,
                breakOnWord: false,
            }),
        ).toBe("The quick b\u2026");
        expect(getExcerpt(null as never)).toBeUndefined();
    });

    it("rejects a non-positive maximum length", () => {
        expect(() => getExcerpt({ value: "a", maximumLength: 0 })).toThrow(
            RangeError,
        );
    });
});
