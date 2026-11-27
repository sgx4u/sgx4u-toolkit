import { describe, expect, it } from "vitest";
import { walkObject } from "./walk-object.js";
import type { WalkObjectParams, WalkObjectVisit } from "./walk-object.types.js";

interface Seen {
    key?: PropertyKey;
    path: readonly (string | number)[];
    value: unknown;
}

function visitAll(
    object: unknown,
    options: Partial<Omit<WalkObjectParams, "object" | "visitor">> = {},
): Seen[] {
    const seen: Seen[] = [];
    const params: WalkObjectParams = {
        object,
        visitor: (visit: WalkObjectVisit) => {
            const entry: Seen = { path: [...visit.path], value: visit.value };
            if (visit.key !== undefined) {
                entry.key = visit.key;
            }
            seen.push(entry);
        },
    };
    if (options.includeArrays !== undefined) {
        params.includeArrays = options.includeArrays;
    }
    if (options.leafOnly !== undefined) {
        params.leafOnly = options.leafOnly;
    }
    if (options.maxDepth !== undefined) {
        params.maxDepth = options.maxDepth;
    }
    walkObject(params);
    return seen;
}

describe("walkObject", () => {
    it("visits a primitive root once with an empty path", () => {
        expect(visitAll(1)).toEqual([{ path: [], value: 1 }]);
        expect(visitAll(null)).toEqual([{ path: [], value: null }]);
        expect(visitAll("ada")).toEqual([{ path: [], value: "ada" }]);
    });

    it("walks depth-first and reports keys, paths, and parents", () => {
        const parents: unknown[] = [];
        const seen: Seen[] = [];
        walkObject({
            object: { a: { b: 1 }, c: 2 },
            visitor: (visit) => {
                const entry: Seen = {
                    path: [...visit.path],
                    value: visit.value,
                };
                if (visit.key !== undefined) {
                    entry.key = visit.key;
                }
                seen.push(entry);
                if (visit.parent !== undefined) {
                    parents.push(visit.parent);
                }
            },
        });
        expect(seen.map((entry) => entry.path)).toEqual([
            [],
            ["a"],
            ["a", "b"],
            ["c"],
        ]);
        expect(seen.map((entry) => entry.value)).toEqual([
            { a: { b: 1 }, c: 2 },
            { b: 1 },
            1,
            2,
        ]);
        expect(seen[1]?.key).toBe("a");
        expect(seen[0]?.key).toBeUndefined();
        expect(parents).toHaveLength(3);
    });

    it("skips children without skipping siblings", () => {
        const paths: string[] = [];
        walkObject({
            object: { a: { b: 1 }, c: 2 },
            visitor: ({ path, value, skip }) => {
                paths.push(path.join("."));
                if (
                    typeof value === "object" &&
                    value !== null &&
                    Object.hasOwn(value, "b")
                ) {
                    skip();
                }
            },
        });
        expect(paths).toEqual(["", "a", "c"]);
    });

    it("does not revisit a cycle", () => {
        const box: { name: string; self?: object } = { name: "box" };
        box.self = box;
        const keys: Array<PropertyKey | undefined> = [];
        walkObject({
            object: box,
            visitor: ({ key }) => {
                keys.push(key);
            },
        });
        expect(keys).toEqual([undefined, "name"]);
    });

    it("visits a shared reference that is not a cycle", () => {
        const shared = { id: 1 };
        const values: unknown[] = [];
        walkObject({
            object: { left: shared, right: shared },
            visitor: ({ value }) => {
                values.push(value);
            },
        });
        expect(values.filter((value) => value === shared)).toHaveLength(2);
    });

    it("visits only leaves when leafOnly is set", () => {
        expect(
            visitAll({ a: 1, b: { c: 2 } }, { leafOnly: true }).map(
                (entry) => entry.value,
            ),
        ).toEqual([1, 2]);
    });

    it("does not walk array elements when includeArrays is false", () => {
        const seen = visitAll(
            { items: [1, { n: 2 }] },
            { includeArrays: false },
        );
        expect(seen.map((entry) => entry.value)).toEqual([
            { items: [1, { n: 2 }] },
            [1, { n: 2 }],
        ]);
        const leaves = visitAll(
            { items: [1] },
            { includeArrays: false, leafOnly: true },
        );
        expect(leaves.map((entry) => entry.value)).toEqual([[1]]);
    });

    it("visits array indexes as numbers", () => {
        const seen = visitAll(["a", "b"]);
        expect(seen.map((entry) => entry.path)).toEqual([[], [0], [1]]);
        expect(seen[1]?.key).toBe(0);
    });

    it("limits the walk with maxDepth", () => {
        expect(visitAll({ a: { b: 1 } }, { maxDepth: 0 })).toEqual([
            { path: [], value: { a: { b: 1 } } },
        ]);
        expect(
            visitAll({ a: { b: 1 } }, { maxDepth: 1 }).map(
                (entry) => entry.path,
            ),
        ).toEqual([[], ["a"]]);
        expect(visitAll({ a: 1 }, { maxDepth: -1 })).toEqual([]);
    });

    it("throws when visitor is not a function", () => {
        const params = {
            object: {},
            visitor: 1,
        } as unknown as WalkObjectParams;
        expect(() => walkObject(params)).toThrow(TypeError);
    });
});
