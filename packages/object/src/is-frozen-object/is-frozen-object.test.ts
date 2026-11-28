import { describe, expect, it } from "vitest";
import { isFrozenObject } from "./is-frozen-object.js";

describe("isFrozenObject", () => {
    it("uses Object.isFrozen for objects only", () => {
        expect(isFrozenObject(Object.freeze({ id: 1 }))).toBe(true);
        expect(isFrozenObject({ id: 1 })).toBe(false);
        expect(isFrozenObject(1)).toBe(false);
        expect(isFrozenObject(null)).toBe(false);
        expect(isFrozenObject(Object.freeze(() => undefined))).toBe(false);
    });
});
