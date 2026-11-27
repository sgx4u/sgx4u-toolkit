import { afterEach, describe, expect, it } from "vitest";
import type { OmitPathsParams } from "./omit-paths.types.js";
import { omitPaths } from "./omit-paths.js";

function sparseTriple(): number[] {
    const values: number[] = [];
    values[0] = 1;
    values[2] = 3;
    return values;
}

afterEach(() => {
    delete (Object.prototype as { polluted?: unknown }).polluted;
});

describe("omitPaths", () => {
    it("removes a path and drops plain objects that become empty", () => {
        const sibling = { keep: true };
        const object = { a: { b: { c: 1 } }, d: 2, sibling };
        const result = omitPaths({ object, paths: ["a.b.c"] }) as {
            d: number;
            sibling: typeof sibling;
        };

        expect(result).toEqual({ d: 2, sibling });
        expect(result.sibling).toBe(sibling);
        expect(object.a.b.c).toBe(1);
    });

    it("keeps a parent that still has keys", () => {
        const result = omitPaths({
            object: { a: { b: 1, c: 2 } },
            paths: ["a.b"],
        });

        expect(result).toEqual({ a: { c: 2 } });
    });

    it("returns the same object when nothing is removed", () => {
        const object = { a: 1 };
        expect(omitPaths({ object, paths: ["missing", ""] })).toBe(object);
    });

    it("splices an array element and a plain object that became empty", () => {
        expect(omitPaths({ object: [1, 2, 3], paths: [0] })).toEqual([2, 3]);
        expect(
            omitPaths({ object: [{ a: 1 }, { b: 2 }], paths: ["0.a"] }),
        ).toEqual([{ b: 2 }]);
    });

    it("preserves a sparse hole that was not removed", () => {
        const source = sparseTriple();
        const removed = omitPaths({ object: source, paths: [2] }) as unknown[];

        expect(removed).toHaveLength(2);
        expect(removed[0]).toBe(1);
        expect(Object.hasOwn(removed, 1)).toBe(false);
        expect(Object.hasOwn(source, 1)).toBe(false);
        expect(source).toEqual(sparseTriple());
    });

    it("keeps an empty array", () => {
        expect(omitPaths({ object: { a: [] }, paths: ["missing"] })).toEqual({
            a: [],
        });
        const object = { a: [] };
        expect(omitPaths({ object, paths: ["a.0"] })).toBe(object);
    });

    it("returns undefined for invalid input", () => {
        expect(omitPaths({ object: null, paths: ["a"] })).toBeUndefined();
        expect(omitPaths({ object: 1, paths: ["a"] })).toBeUndefined();
        expect(
            omitPaths({
                object: { a: 1 },
                paths: "a" as unknown as OmitPathsParams["paths"],
            }),
        ).toBeUndefined();
    });

    it("throws when a path option is invalid", () => {
        expect(() =>
            omitPaths({
                object: { a: 1 },
                paths: ["a"],
                pathStyle: "bad",
            } as unknown as OmitPathsParams),
        ).toThrow(RangeError);
        expect(() =>
            omitPaths({
                object: { a: 1 },
                paths: ["a"],
                pathDelimiter: "",
            }),
        ).toThrow(RangeError);
    });

    it("edits an own __proto__ value without polluting Object.prototype", () => {
        const payload = JSON.parse(
            '{"__proto__": {"polluted": true, "safe": 1}, "ok": 2}',
        );
        const result = omitPaths({
            object: payload,
            paths: ["__proto__.polluted", "__proto__.polluted"],
        }) as Record<string, unknown>;

        expect(
            Object.getOwnPropertyDescriptor(result, "__proto__")?.value,
        ).toEqual({ safe: 1 });
        expect(result.ok).toBe(2);
        expect(({} as { polluted?: unknown }).polluted).toBeUndefined();
        omitPaths({ object: {}, paths: ["__proto__.polluted"] });
        expect(({} as { polluted?: unknown }).polluted).toBeUndefined();
    });
});
