import { describe, expect, it } from "vitest";
import { isWeakSet } from "./is-weak-set.js";

describe("isWeakSet", () => {
    it("accepts a WeakSet", () => {
        expect(isWeakSet(new WeakSet())).toBe(true);
        expect(isWeakSet(new Set())).toBe(false);
        expect(isWeakSet(undefined)).toBe(false);
    });
});
