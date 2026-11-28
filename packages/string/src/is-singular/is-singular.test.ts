import { describe, expect, it } from "vitest";
import { isSingular } from "./is-singular.js";
describe("isSingular", () => {
    it("detects singulars", () => {
        expect(isSingular("cat")).toBe(true);
        expect(isSingular("cats")).toBe(false);
        expect(isSingular("sheep")).toBe(true);
        expect(isSingular(null as unknown as string)).toBe(false);
    });
});
