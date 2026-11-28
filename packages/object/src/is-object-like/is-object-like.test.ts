import { describe, expect, it } from "vitest";
import { isObjectLike } from "./is-object-like.js";

describe("isObjectLike", () => {
    it("accepts objects and rejects null and functions", () => {
        expect(isObjectLike({})).toBe(true);
        expect(isObjectLike([])).toBe(true);
        expect(isObjectLike(new Date())).toBe(true);
        expect(isObjectLike(null)).toBe(false);
        expect(isObjectLike(undefined)).toBe(false);
        expect(isObjectLike(1)).toBe(false);
        expect(isObjectLike(() => undefined)).toBe(false);
    });
});
