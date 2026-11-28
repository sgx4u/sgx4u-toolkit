import { describe, expect, it } from "vitest";
import { isPlural } from "./is-plural.js";
describe("isPlural", () => {
    it("detects plurals and uncountables", () => {
        expect(isPlural("cats")).toBe(true);
        expect(isPlural("cat")).toBe(false);
        expect(isPlural("sheep")).toBe(true);
        expect(isPlural("")).toBe(false);
        expect(isPlural(null as unknown as string)).toBe(false);
    });
});
