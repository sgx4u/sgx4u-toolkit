import { describe, expect, it } from "vitest";
import { flattenObject } from "./flatten-object.js";

describe("flattenObject", () => {
    it("joins nested keys and indexes arrays", () => {
        expect(
            flattenObject({
                object: { a: [10, { b: 20 }], user: { name: "Ada" } },
            }),
        ).toEqual({
            "a.0": 10,
            "a.1.b": 20,
            "user.name": "Ada",
        });
    });

    it("keeps arrays as values", () => {
        const items = [10, { b: 20 }];

        expect(flattenObject({ object: { a: items }, arrays: "keep" })).toEqual(
            {
                a: items,
            },
        );
    });

    it("stores a value when the next edge would pass maxDepth", () => {
        const object = { a: { b: { c: 1 } } };

        expect(flattenObject({ object, maxDepth: 1 })).toEqual({
            a: { b: { c: 1 } },
        });
        expect(flattenObject({ object, maxDepth: 2 })).toEqual({
            "a.b": { c: 1 },
        });
        expect(flattenObject({ object, maxDepth: 0 })).toEqual({ "": object });
        expect(flattenObject({ object, maxDepth: 0, prefix: "root" })).toEqual({
            root: object,
        });
    });

    it("returns an empty record for an empty root and stores a nested empty object", () => {
        expect(flattenObject({ object: {} })).toEqual({});
        expect(flattenObject({ object: { a: {} } })).toEqual({ a: {} });
        expect(flattenObject({ object: [] })).toEqual({});
        expect(flattenObject({ object: { a: [] } })).toEqual({ a: [] });
    });

    it("omits a cycling edge for skip, preserve, and replace", () => {
        const box: { name: string; self?: object } = { name: "a" };
        box.self = box;

        expect(flattenObject({ object: box })).toEqual({ name: "a" });
        expect(flattenObject({ object: box, circular: "preserve" })).toEqual({
            name: "a",
        });
        expect(flattenObject({ object: box, circular: "replace" })).toEqual({
            name: "a",
        });
        expect(() => flattenObject({ object: box, circular: "throw" })).toThrow(
            RangeError,
        );
    });

    it("duplicates a shared object that is not a cycle", () => {
        const shared = { n: 1 };

        expect(flattenObject({ object: { a: shared, b: shared } })).toEqual({
            "a.n": 1,
            "b.n": 1,
        });
    });

    it("skips a dangerous result key and still writes a nested safe key", () => {
        const source = Object.create(null) as Record<string, unknown>;
        source.__proto__ = 1;
        source.safe = 2;
        const nested = Object.create(null) as Record<string, unknown>;
        nested.__proto__ = { polluted: true };
        nested.safe = 3;

        expect(flattenObject({ object: source })).toEqual({ safe: 2 });
        expect(flattenObject({ object: nested })).toEqual({
            "__proto__.polluted": true,
            safe: 3,
        });
        expect(({} as { polluted?: unknown }).polluted).toBeUndefined();
    });

    it("uses prefix and delimiter", () => {
        expect(
            flattenObject({
                object: { a: { b: 1 } },
                delimiter: "/",
                prefix: "pre",
            }),
        ).toEqual({ "pre/a/b": 1 });
    });

    it("stores a date as a leaf", () => {
        const at = new Date("2020-01-01T00:00:00.000Z");

        expect(flattenObject({ object: { at } })).toEqual({ at });
    });

    it("throws for an unknown arrays or circular policy and a bad delimiter", () => {
        expect(() =>
            flattenObject({ object: { a: 1 }, arrays: "auto" as "index" }),
        ).toThrow(RangeError);
        expect(() =>
            flattenObject({ object: { a: 1 }, circular: "drop" as "skip" }),
        ).toThrow(RangeError);
        expect(() =>
            flattenObject({ object: { a: 1 }, delimiter: "" }),
        ).toThrow(RangeError);
        expect(() => flattenObject({ object: { a: 1 }, maxDepth: -1 })).toThrow(
            RangeError,
        );
    });

    it("omits an array hole and rejects a prefix that is not a string", () => {
        const items: number[] = [];
        items[0] = 1;
        items[2] = 3;

        expect(flattenObject({ object: { items } })).toEqual({
            "items.0": 1,
            "items.2": 3,
        });
        expect(() =>
            flattenObject({
                object: { a: 1 },
                prefix: 1 as unknown as string,
            }),
        ).toThrow(RangeError);
        expect(
            flattenObject({ a: 1 } as unknown as { object: unknown }),
        ).toBeUndefined();
    });

    it("returns undefined for null and primitives", () => {
        expect(flattenObject({ object: null })).toBeUndefined();
        expect(flattenObject({ object: "a" })).toBeUndefined();
        expect(flattenObject({ object: 1 })).toBeUndefined();
    });
});
