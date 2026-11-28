import { describe, expect, it } from "vitest";
import { isSlug } from "./is-slug.js";
describe("isSlug", () => {
    it("accepts a lowercase slug", () => {
        expect(isSlug("hello-world")).toBe(true);
        expect(isSlug("-a")).toBe(false);
        expect(isSlug("A")).toBe(false);
        expect(isSlug(null)).toBe(false);
    });
});
