import { describe, expect, it } from "vitest";
import { isEmptyObject } from "./is-empty-object.js";

describe("isEmptyObject", () => {
    it("ignores symbols and rejects non-objects", () => {
        const symbol = Symbol("id");
        expect(isEmptyObject({})).toBe(true);
        expect(isEmptyObject({ [symbol]: 1 })).toBe(true);
        expect(isEmptyObject({ id: 1 })).toBe(false);
        expect(isEmptyObject([])).toBe(false);
        expect(isEmptyObject(null)).toBe(false);
        expect(isEmptyObject(Object.create(null))).toBe(true);
    });
});
