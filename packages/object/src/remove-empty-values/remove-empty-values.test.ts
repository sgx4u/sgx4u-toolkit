import { describe, expect, it } from "vitest";
import { removeEmptyValues } from "./remove-empty-values.js";

const everyEmpty = [
    "undefined",
    "null",
    "emptyString",
    "emptyArray",
    "emptyObject",
    "nan",
] as const;

describe("removeEmptyValues", () => {
    it("drops undefined by default and keeps 0, NaN, and an empty string", () => {
        expect(
            removeEmptyValues({
                object: { a: undefined, b: 0, c: Number.NaN, d: "", e: false },
            }),
        ).toEqual({ b: 0, c: Number.NaN, d: "", e: false });
    });

    it("drops NaN and keeps 0", () => {
        expect(
            removeEmptyValues({
                object: { a: Number.NaN, b: 0, c: 1 },
                emptyValues: ["nan"],
            }),
        ).toEqual({ b: 0, c: 1 });
    });

    it("cleans children first and drops a newly empty object only when asked", () => {
        expect(
            removeEmptyValues({
                object: { a: { b: undefined, c: 1 } },
            }),
        ).toEqual({ a: { c: 1 } });
        expect(
            removeEmptyValues({
                object: { a: { b: undefined } },
                emptyValues: ["undefined"],
            }),
        ).toEqual({ a: {} });
        expect(
            removeEmptyValues({
                object: { a: { b: undefined } },
                emptyValues: ["undefined", "emptyObject"],
            }),
        ).toEqual({});
    });

    it("removes empty array elements and shifts later elements", () => {
        expect(
            removeEmptyValues({
                object: { a: [undefined, 0, Number.NaN, 1] },
            }),
        ).toEqual({ a: [0, Number.NaN, 1] });
        expect(
            removeEmptyValues({
                object: { a: [1, undefined, 2] },
            }),
        ).toEqual({ a: [1, 2] });
        expect(
            removeEmptyValues({
                object: { a: [""] },
                emptyValues: ["emptyString", "emptyArray"],
            }),
        ).toEqual({});
    });

    it("drops every selected kind", () => {
        expect(
            removeEmptyValues({
                object: {
                    a: undefined,
                    b: null,
                    c: "",
                    d: [],
                    e: {},
                    f: Number.NaN,
                    g: 0,
                },
                emptyValues: everyEmpty,
            }),
        ).toEqual({ g: 0 });
    });

    it("does not walk children when deep is false", () => {
        const nested = { b: undefined };
        const result = removeEmptyValues({
            object: { a: nested },
            deep: false,
        }) as { a: { b?: undefined } };

        expect(result.a).toBe(nested);
        expect(result.a.b).toBeUndefined();
    });

    it("does not mutate the input", () => {
        const input = { a: undefined, b: 1 };
        removeEmptyValues({ object: input });

        expect(input).toEqual({ a: undefined, b: 1 });
    });

    it("throws for an unknown empty value name", () => {
        expect(() =>
            removeEmptyValues({
                object: { a: 1 },
                emptyValues: ["zero" as "null"],
            }),
        ).toThrow(RangeError);
    });

    it("cleans an array root and points a cycle at the copy", () => {
        expect(
            removeEmptyValues({ object: [undefined, 1, undefined] }),
        ).toEqual([1]);

        const box: { name?: string; self?: object } = { name: "a" };
        box.self = box;
        const cleaned = removeEmptyValues({
            object: box,
        }) as { name: string; self: object };

        expect(cleaned.self).toBe(cleaned);
        expect(cleaned.name).toBe("a");
        expect(box.self).toBe(box);
    });

    it("returns undefined for null and primitives", () => {
        expect(removeEmptyValues({ object: null })).toBeUndefined();
        expect(removeEmptyValues({ object: 0 })).toBeUndefined();
        expect(removeEmptyValues({ object: " " })).toBeUndefined();
    });
});
