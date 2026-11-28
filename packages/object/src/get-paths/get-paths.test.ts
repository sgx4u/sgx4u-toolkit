import { afterEach, describe, expect, it } from "vitest";
import type { GetPathsParams } from "./get-paths.types.js";
import { getPaths } from "./get-paths.js";

function sparseTriple(): number[] {
    const values: number[] = [];
    values[0] = 1;
    values[2] = 3;
    return values;
}

afterEach(() => {
    delete (Object.prototype as { polluted?: unknown }).polluted;
});

describe("getPaths", () => {
    it("returns one result per path in order", () => {
        const object = { a: 1, b: { c: 2 } };
        expect(
            getPaths({
                object,
                paths: ["a", "missing", "b.c", ""],
                defaultValue: 0,
            }),
        ).toEqual([1, 0, 2, object]);
    });

    it("uses the default for an illegal path and a sparse hole", () => {
        const sparse = sparseTriple();
        expect(
            getPaths({
                object: sparse,
                paths: [0, 1, "bad..path", 2],
                defaultValue: "gap",
            }),
        ).toEqual([1, "gap", "gap", 3]);
        expect(Object.hasOwn(sparse, 1)).toBe(false);
    });

    it("returns undefined when the object or the path list is invalid", () => {
        expect(getPaths({ object: null, paths: ["a"] })).toBeUndefined();
        expect(getPaths({ object: "ada", paths: [] })).toBeUndefined();
        expect(
            getPaths({
                object: { a: 1 },
                paths: "a" as unknown as GetPathsParams["paths"],
            }),
        ).toBeUndefined();
    });

    it("throws when a path option is invalid", () => {
        expect(() =>
            getPaths({
                object: { a: 1 },
                paths: ["a"],
                pathStyle: "bad",
            } as unknown as GetPathsParams),
        ).toThrow(
            '`pathStyle` must be "dot" or "json-pointer"; received "bad".',
        );
    });

    it("does not read a dangerous path into Object.prototype", () => {
        const payload = JSON.parse(
            '{"__proto__": {"polluted": true}, "ok": 1}',
        );
        expect(
            getPaths({
                object: payload,
                paths: ["ok", "__proto__.polluted"],
                defaultValue: "hidden",
            }),
        ).toEqual([1, "hidden"]);
        expect(
            getPaths({
                object: {},
                paths: ["__proto__.polluted"],
            }),
        ).toEqual([undefined]);
        expect(({} as { polluted?: unknown }).polluted).toBeUndefined();
    });
});
