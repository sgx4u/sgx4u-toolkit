import { afterEach, describe, expect, it } from "vitest";
import type { PickPathsParams } from "./pick-paths.types.js";
import { pickPaths } from "./pick-paths.js";

function sparseTriple(): number[] {
    const values: number[] = [];
    values[0] = 1;
    values[2] = 3;
    return values;
}

afterEach(() => {
    delete (Object.prototype as { polluted?: unknown }).polluted;
});

describe("pickPaths", () => {
    it("rebuilds an object that contains only the given paths", () => {
        const leaf = { n: 1 };
        const object = { a: { b: leaf, c: 2 }, d: 3 };
        const result = pickPaths({
            object,
            paths: ["a.b", "d", "missing"],
        }) as {
            a: { b: typeof leaf };
            d: number;
        };

        expect(result).toEqual({ a: { b: leaf }, d: 3 });
        expect(result.a.b).toBe(leaf);
        expect(object).toEqual({ a: { b: leaf, c: 2 }, d: 3 });
    });

    it("rebuilds an array when the root is an array", () => {
        const result = pickPaths({
            object: [{ name: "Ada" }, { name: "Grace" }],
            paths: ["1.name"],
        });

        expect(result).toEqual([undefined, { name: "Grace" }]);
    });

    it("does not copy a sparse hole", () => {
        const result = pickPaths({
            object: sparseTriple(),
            paths: [0, 1, 2],
        }) as unknown[];

        expect(result[0]).toBe(1);
        expect(Object.hasOwn(result, 1)).toBe(false);
        expect(result[2]).toBe(3);
        expect(result).toHaveLength(3);
    });

    it("returns an empty object when every path is missing or empty", () => {
        const object = { a: 1 };
        const result = pickPaths({ object, paths: ["", "missing", "a..b"] });

        expect(result).toEqual({});
        expect(result).not.toBe(object);
    });

    it("returns undefined when the object or the path list is invalid", () => {
        expect(pickPaths({ object: null, paths: ["a"] })).toBeUndefined();
        expect(pickPaths({ object: "ada", paths: ["a"] })).toBeUndefined();
        expect(
            pickPaths({
                object: { a: 1 },
                paths: "a" as unknown as PickPathsParams["paths"],
            }),
        ).toBeUndefined();
    });

    it("throws when pathStyle or pathDelimiter is invalid", () => {
        expect(() =>
            pickPaths({
                object: { a: 1 },
                paths: ["a"],
                pathStyle: "bad",
            } as unknown as PickPathsParams),
        ).toThrow(
            '`pathStyle` must be "dot" or "json-pointer"; received "bad".',
        );
        expect(() =>
            pickPaths({
                object: { a: 1 },
                paths: ["a"],
                pathDelimiter: "",
            }),
        ).toThrow('`pathDelimiter` must be a non-empty string; received "".');
    });

    it("does not set Object.prototype from a __proto__ path or a JSON payload", () => {
        pickPaths({
            object: {},
            paths: ["__proto__.polluted"],
        });
        const payload = JSON.parse(
            '{"__proto__": {"polluted": true}, "ok": 1}',
        );
        const result = pickPaths({
            object: payload,
            paths: ["ok", "__proto__"],
        });

        expect(result).toEqual({ ok: 1 });
        expect(({} as { polluted?: unknown }).polluted).toBeUndefined();
    });
});
