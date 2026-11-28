import { describe, expect, it } from "vitest";
import { isWeakMap } from "./is-weak-map.js";

describe("isWeakMap", () => {
    it("accepts a WeakMap", () => {
        expect(isWeakMap(new WeakMap())).toBe(true);
        expect(isWeakMap(new Map())).toBe(false);
        expect(isWeakMap(null)).toBe(false);
    });
});
