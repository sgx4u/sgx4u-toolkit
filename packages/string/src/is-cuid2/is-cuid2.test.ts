import { describe, expect, it } from "vitest";
import { isCUID2 } from "./is-cuid2.js";
describe("isCUID2", () => {
    it("requires a leading letter", () => {
        expect(isCUID2("a".repeat(24))).toBe(true);
        expect(isCUID2("1".repeat(24))).toBe(false);
    });
});
