import { describe, expect, it } from "vitest";
import { isConstantCase } from "./is-constant-case.js";

describe("isConstantCase", () => {
    it("accepts the constant-case conversion", () => {
        expect(isConstantCase("FOO_BAR")).toBe(true);
        expect(isConstantCase("FOO")).toBe(true);
        expect(isConstantCase("foo_bar")).toBe(false);
        expect(isConstantCase("")).toBe(false);
        expect(isConstantCase(null)).toBe(false);
    });
});
