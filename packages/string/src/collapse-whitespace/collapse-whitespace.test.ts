import { describe, expect, it } from "vitest";
import { collapseWhitespace } from "../index.js";

describe("collapseWhitespace", () => {
    it("trims and collapses internal whitespace", () => {
        expect(collapseWhitespace("  a \t b\nc  ")).toBe("a b c");
    });

    it("collapses a whitespace-only string to empty", () => {
        expect(collapseWhitespace(" \n\t")).toBe("");
    });

    it("collapses a no-break space", () => {
        expect(collapseWhitespace("a\u00A0\u00A0b")).toBe("a b");
    });

    it("leaves a single space between words", () => {
        expect(collapseWhitespace("a b")).toBe("a b");
    });

    it("returns the same result on a second call", () => {
        // The pattern is global. replace resets lastIndex, and a second call
        // must not resume from the previous match.
        expect(collapseWhitespace("  a \t b  ")).toBe("a b");
        expect(collapseWhitespace("  a \t b  ")).toBe("a b");
    });
});
