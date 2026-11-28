import { describe, expect, it } from "vitest";
import { clone } from "./clone.js";

describe("clone", () => {
    it("returns primitives as-is", () => {
        expect(clone(1)).toBe(1);
        expect(clone("a")).toBe("a");
        expect(clone(null)).toBeNull();
        expect(clone(undefined)).toBeUndefined();
        const fn = (): number => 1;
        expect(clone(fn)).toBe(fn);
    });

    it("copies one level and shares nested values", () => {
        const nested = { b: 1 };
        const source = { a: nested, list: [nested] };
        const result = clone(source);

        expect(result).toEqual(source);
        expect(result).not.toBe(source);
        expect(result.a).toBe(nested);
        expect(result.list).toBe(source.list);
        expect(source).toEqual({ a: nested, list: [nested] });
    });

    it("copies a date and an array as new instances", () => {
        const date = new Date(0);
        const copied = clone(date);
        const nested = { a: 1 };
        const list = [1, nested];
        const copiedList = clone(list);

        expect(copied).toEqual(date);
        expect(copied).not.toBe(date);
        expect(copiedList).not.toBe(list);
        expect(copiedList[1]).toBe(nested);
    });
});
