import { describe, expect, it } from "vitest";
import { isPlainObject } from "./is-plain-object.js";

describe("isPlainObject", () => {
    it("accepts ordinary objects and null-prototype objects", () => {
        expect(isPlainObject({})).toBe(true);
        expect(isPlainObject(Object.create(null))).toBe(true);
        const prototype = Object.create(null);
        Object.defineProperty(prototype, "constructor", {
            value: function Object() {
                return undefined;
            },
        });
        expect(isPlainObject(Object.create(prototype))).toBe(true);
    });

    it("rejects arrays, dates, classes, and primitives", () => {
        class Box {}
        expect(isPlainObject([])).toBe(false);
        expect(isPlainObject(new Date())).toBe(false);
        expect(isPlainObject(new Box())).toBe(false);
        expect(
            isPlainObject(Object.create(Object.create(Object.prototype))),
        ).toBe(false);
        expect(isPlainObject(null)).toBe(false);
        expect(isPlainObject(1)).toBe(false);
        expect(isPlainObject("a")).toBe(false);
        expect(isPlainObject(undefined)).toBe(false);
    });
});
