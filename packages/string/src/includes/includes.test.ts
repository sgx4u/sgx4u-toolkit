import { describe, expect, it } from "vitest";
import { includes } from "./includes.js";
describe("includes", () => {
    it("searches", () => {
        expect(includes({ value: "hello", search: "ell" })).toBe(true);
        expect(
            includes({ value: "hello", search: "ELL", ignoreCase: true }),
        ).toBe(true);
        expect(includes({ value: "hello", search: "x" })).toBe(false);
        expect(includes({ value: 1 as unknown as string, search: "a" })).toBe(
            false,
        );
    });
});
