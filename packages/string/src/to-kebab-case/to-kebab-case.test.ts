import { describe, expect, it } from "vitest";
import { toKebabCase } from "./to-kebab-case.js";

describe("toKebabCase", () => {
    it("separates words with hyphens", () => {
        expect(toKebabCase("XMLHttpRequest")).toBe("xml-http-request");
        expect(toKebabCase("foo bar")).toBe("foo-bar");
        expect(toKebabCase("")).toBe("");
        expect(toKebabCase(null as never)).toBeUndefined();
    });
});
