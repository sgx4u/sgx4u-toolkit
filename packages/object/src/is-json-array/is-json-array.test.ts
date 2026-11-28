import { describe, expect, it } from "vitest";
import { isJSONArray } from "./is-json-array.js";

describe("isJSONArray", () => {
    it("requires a JSON array", () => {
        expect(isJSONArray([1, "a", null])).toBe(true);
        expect(isJSONArray({})).toBe(false);
        expect(isJSONArray([undefined])).toBe(false);
    });
});
