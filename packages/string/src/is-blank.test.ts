import { describe, expect, it } from "vitest";
import { collapseWhitespace } from "./collapse-whitespace.js";
import { isBlank } from "./is-blank.js";

describe("isBlank", () => {
    it("accepts an empty string", () => {
        expect(isBlank("")).toBe(true);
    });

    it("accepts whitespace", () => {
        expect(isBlank(" \n\t")).toBe(true);
    });

    it("rejects text", () => {
        expect(isBlank(" sgx ")).toBe(false);
    });
});

describe("collapseWhitespace", () => {
    it("trims and collapses internal whitespace", () => {
        expect(collapseWhitespace("  a \t b\nc  ")).toBe("a b c");
    });
});
