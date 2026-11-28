import { describe, expect, it } from "vitest";
import { sortKeys } from "./sort-keys.js";

describe("sortKeys", () => {
    it("sorts numeric digit runs so a2 comes before a10", () => {
        const result = sortKeys({ object: { a10: 1, a2: 2, a1: 3 } });

        expect(Object.keys(result as object)).toEqual(["a1", "a2", "a10"]);
    });

    it("sorts lexicographically when numeric is false", () => {
        const result = sortKeys({
            object: { a10: 1, a2: 2, a1: 3 },
            numeric: false,
        });

        expect(Object.keys(result as object)).toEqual(["a1", "a10", "a2"]);
    });

    it("reverses the order when order is descending", () => {
        const result = sortKeys({
            object: { a10: 1, a2: 2, a1: 3 },
            order: "descending",
        });

        expect(Object.keys(result as object)).toEqual(["a10", "a2", "a1"]);
    });

    it("sorts object elements and keeps array order", () => {
        const input = [
            { b: 1, a: 2 },
            { d: 1, c: 2 },
        ];
        const result = sortKeys({ object: input });

        expect(result).toEqual([
            { a: 2, b: 1 },
            { c: 2, d: 1 },
        ]);
        expect(input[0]).toEqual({ b: 1, a: 2 });
    });

    it("does not sort nested objects when deep is false", () => {
        const nested = { b: 1, a: 2 };
        const result = sortKeys({
            object: { z: nested },
            deep: false,
        }) as { z: object };

        expect(Object.keys(result)).toEqual(["z"]);
        expect(result.z).toBe(nested);
    });

    it("uses a custom compare and accepts a locale", () => {
        const result = sortKeys({
            object: { bb: 1, a: 2, ccc: 3 },
            compare: (left, right) => left.length - right.length,
        });

        expect(Object.keys(result as object)).toEqual(["a", "bb", "ccc"]);
        expect(
            Object.keys(
                sortKeys({ object: { b: 1, a: 2 }, locale: "en" }) as object,
            ),
        ).toEqual(["a", "b"]);
        expect(
            Object.keys(
                sortKeys({
                    object: { b: 1, a: 2 },
                    locale: ["en"],
                }) as object,
            ),
        ).toEqual(["a", "b"]);
    });

    it("preserves a null prototype, skips a dangerous key, and does not mutate", () => {
        const input = Object.create(null) as Record<string, number>;
        input.b = 1;
        input.a = 2;
        input.__proto__ = 3;
        const result = sortKeys({ object: input });

        expect(Object.keys(result as object)).toEqual(["a", "b"]);
        expect(Object.getPrototypeOf(result)).toBeNull();
        expect(input.__proto__).toBe(3);
        expect(({} as { polluted?: unknown }).polluted).toBeUndefined();
    });

    it("throws when compare is not a function or order is unknown", () => {
        expect(() =>
            sortKeys({
                object: { a: 1 },
                compare: "name" as unknown as () => number,
            }),
        ).toThrow(TypeError);
        expect(() =>
            sortKeys({
                object: { a: 1 },
                order: "sideways" as "ascending",
            }),
        ).toThrow(RangeError);
    });

    it("throws when locale is not a string or a list of strings", () => {
        expect(() =>
            sortKeys({
                object: { a: 1 },
                locale: 1 as unknown as string,
            }),
        ).toThrow(RangeError);
    });

    it("points a cycle at the sorted copy", () => {
        const box: { b: number; a: number; self?: object } = { b: 1, a: 2 };
        box.self = box;
        const result = sortKeys({ object: box }) as {
            a: number;
            b: number;
            self: object;
        };

        expect(Object.keys(result)).toEqual(["a", "b", "self"]);
        expect(result.self).toBe(result);
        expect(box.self).toBe(box);
    });

    it("returns undefined for null and primitives", () => {
        expect(sortKeys({ object: null })).toBeUndefined();
        expect(sortKeys({ object: "a" })).toBeUndefined();
    });
});
