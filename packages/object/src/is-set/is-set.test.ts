import { describe, expect, it } from "vitest";
import { isSet } from "./is-set.js";

describe("isSet", () => {
    it("accepts a Set", () => {
        expect(isSet(new Set())).toBe(true);
        expect(isSet(new Map())).toBe(false);
        expect(isSet(null)).toBe(false);
    });
});
