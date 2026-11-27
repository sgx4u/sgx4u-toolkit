import { afterEach, describe, expect, it } from "vitest";
import type { UnsetPathParams } from "./unset-path.types.js";
import { unsetPath } from "./unset-path.js";

function sparseTriple(): number[] {
    const values: number[] = [];
    values[0] = 1;
    values[2] = 3;
    return values;
}

afterEach(() => {
    delete (Object.prototype as { polluted?: unknown }).polluted;
});

describe("unsetPath", () => {
    it("removes a key and leaves an empty parent in place", () => {
        const object = { a: { b: 1 }, c: 2 };
        const result = unsetPath({ object, path: "a.b" });

        expect(result).toEqual({ a: {}, c: 2 });
        expect(result).not.toBe(object);
        expect(object).toEqual({ a: { b: 1 }, c: 2 });
    });

    it("returns the same object when the path is missing or empty", () => {
        const object = { a: 1 };
        expect(unsetPath({ object, path: "missing" })).toBe(object);
        expect(unsetPath({ object, path: "" })).toBe(object);
    });

    it("splices an array index, including a sparse hole, and shifts later items", () => {
        expect(unsetPath({ object: [1, 2, 3], path: 0 })).toEqual([2, 3]);
        const sparse = sparseTriple();
        const result = unsetPath({ object: sparse, path: 1 }) as unknown[];

        expect(result).toEqual([1, 3]);
        expect(result).toHaveLength(2);
        expect(Object.hasOwn(sparse, 1)).toBe(false);
        expect(sparse).toHaveLength(3);
        expect(unsetPath({ object: sparse, path: 9 })).toBe(sparse);
    });

    it("returns undefined for a non-object or an illegal path", () => {
        expect(unsetPath({ object: null, path: "a" })).toBeUndefined();
        expect(unsetPath({ object: 1, path: "a" })).toBeUndefined();
        expect(unsetPath({ object: { a: 1 }, path: "a..b" })).toBeUndefined();
    });

    it("throws for an unknown option or a rejected dangerous key", () => {
        expect(() =>
            unsetPath({
                object: {},
                path: "a",
                pathDelimiter: "",
            }),
        ).toThrow('`pathDelimiter` must be a non-empty string; received "".');
        expect(() =>
            unsetPath({
                object: { __proto__: { polluted: true } } as {
                    polluted?: boolean;
                },
                path: "__proto__",
                prototypeKeys: "throw",
            } as unknown as UnsetPathParams),
        ).toThrow(RangeError);
        expect(({} as { polluted?: unknown }).polluted).toBeUndefined();
    });

    it("does not pollute Object.prototype from a dangerous path", () => {
        const payload = JSON.parse(
            '{"__proto__": {"polluted": true}, "ok": 1}',
        );
        const result = unsetPath({ object: payload, path: "ok" }) as {
            ok?: number;
        };

        expect(result.ok).toBeUndefined();
        unsetPath({ object: {}, path: "__proto__.polluted" });
        expect(({} as { polluted?: unknown }).polluted).toBeUndefined();
    });
});
