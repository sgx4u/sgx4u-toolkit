import { describe, expect, it } from "vitest";
import { invertBy } from "./invert-by.js";

describe("invertBy", () => {
    it("groups keys by the stringified value", () => {
        expect(invertBy({ object: { a: 1, b: 2, c: 1 } })).toEqual({
            "1": ["a", "c"],
            "2": ["b"],
        });
    });

    it("uses the iteratee result as the group", () => {
        expect(
            invertBy({
                object: { a: "x", b: "yy", c: "z" },
                iteratee: (value) => String(value).length,
            }),
        ).toEqual({
            "1": ["a", "c"],
            "2": ["b"],
        });
    });

    it("passes the key and the source object to the iteratee", () => {
        expect(
            invertBy({
                object: { a: 1, b: 1 },
                iteratee: (_value, key) => key,
            }),
        ).toEqual({
            a: ["a"],
            b: ["b"],
        });
    });

    it("skips a dangerous group name", () => {
        const result = invertBy({
            object: { a: 1, b: 2 },
            iteratee: () => "__proto__",
        });

        expect(result).toEqual({});
        expect(({} as { polluted?: unknown }).polluted).toBeUndefined();
    });

    it("throws when iteratee is present and is not a function", () => {
        expect(() =>
            invertBy({
                object: { a: 1 },
                iteratee: "length" as unknown as () => unknown,
            }),
        ).toThrow(TypeError);
    });

    it("returns undefined for a non-object and for an array", () => {
        expect(invertBy({ object: null })).toBeUndefined();
        expect(invertBy({ object: [1, 2] })).toBeUndefined();
        expect(
            invertBy({ a: 1 } as unknown as { object: unknown }),
        ).toBeUndefined();
    });
});
