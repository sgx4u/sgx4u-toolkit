import { describe, expect, it } from "vitest";
import { isWellFormedString } from "./is-well-formed-string.js";

describe("isWellFormedString", () => {
    it("rejects a lone surrogate", () => {
        expect(isWellFormedString("")).toBe(true);
        expect(isWellFormedString("ok")).toBe(true);
        expect(isWellFormedString("\uD800")).toBe(false);
        expect(isWellFormedString(null)).toBe(false);
    });
});
