import { describe, expect, it } from "vitest";
import { trim } from "./trim.js";

describe("trim", () => {
    it("trims whitespace and custom graphemes", () => {
        expect(trim("  hello  ")).toBe("hello");
        expect(trim({ value: "xxhelloxx", characters: "x" })).toBe("hello");
        expect(trim("\u00A0a\u00A0")).toBe("a");
        expect(trim("")).toBe("");
        expect(trim(null as unknown as string)).toBeUndefined();
    });
});
