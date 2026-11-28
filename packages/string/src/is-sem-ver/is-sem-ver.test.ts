import { describe, expect, it } from "vitest";
import { isSemVer } from "./is-sem-ver.js";
describe("isSemVer", () => {
    it("accepts SemVer 2", () => {
        expect(isSemVer("1.2.3")).toBe(true);
        expect(isSemVer("1.2.3-alpha.1+build")).toBe(true);
        expect(isSemVer("v1.2.3")).toBe(false);
        expect(isSemVer(null)).toBe(false);
    });
});
