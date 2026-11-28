import { describe, expect, it } from "vitest";
import type { GroupByKeysParams } from "./group-by-keys.types.js";
import { groupByKeys } from "./group-by-keys.js";

interface Row {
    city: string;
    kind: string;
}

function* generate(): Generator<Row, void, unknown> {
    yield { city: "Paris", kind: "a" };
}

function sparse(): string[] {
    const array: string[] = [];
    array[0] = "a";
    array[2] = "b";
    return array;
}

describe("groupByKeys", () => {
    it("nests one object per key and keeps items at the deepest level", () => {
        const rows: Row[] = [
            { city: "Paris", kind: "a" },
            { city: "Paris", kind: "b" },
            { city: "Lima", kind: "a" },
        ];
        const params: GroupByKeysParams<Row> = {
            array: rows,
            keys: ["city", "kind"],
        };
        expect(groupByKeys(params)).toEqual({
            Paris: {
                a: [{ city: "Paris", kind: "a" }],
                b: [{ city: "Paris", kind: "b" }],
            },
            Lima: {
                a: [{ city: "Lima", kind: "a" }],
            },
        });
    });

    it("returns a shallow copy when keys is empty", () => {
        const array = [1, 2, 3];
        const result = groupByKeys({ array, keys: [] });
        expect(result).toEqual([1, 2, 3]);
        expect(result).not.toBe(array);
    });

    it("returns an empty array for an empty array and empty keys", () => {
        const array: number[] = [];
        const result = groupByKeys({ array, keys: [] });
        expect(result).toEqual([]);
        expect(result).not.toBe(array);
        expect(groupByKeys({ array, keys: ["id"] })).toEqual({});
    });

    it("documents that distinct objects collide as [object Object]", () => {
        const left = { id: 1 };
        const right = { id: 2 };
        expect(
            groupByKeys({
                array: [left, right],
                keys: [(item: { id: number }) => item],
            }),
        ).toEqual({ "[object Object]": [left, right] });
    });

    it("returns undefined for a non-object and for a non-array field", () => {
        expect(groupByKeys(null)).toBeUndefined();
        expect(groupByKeys("text")).toBeUndefined();
        expect(groupByKeys(generate)).toBeUndefined();
        const invalidArrays = [
            null,
            {},
            "text",
            new Uint8Array([1]),
            new Set([1]),
            generate(),
        ];
        for (const array of invalidArrays) {
            expect(
                groupByKeys({ array: array as never, keys: ["id"] }),
            ).toBeUndefined();
        }
    });

    it("does not mutate a frozen array", () => {
        const array = Object.freeze([{ city: "Paris", kind: "a" }]);
        const result = groupByKeys({ array, keys: ["city"] });
        expect(result).toEqual({
            Paris: [{ city: "Paris", kind: "a" }],
        });
        expect(array).toEqual([{ city: "Paris", kind: "a" }]);
    });

    it("copies holes as undefined", () => {
        expect(
            groupByKeys({ array: sparse(), keys: [(item) => item] }),
        ).toEqual({
            a: ["a"],
            undefined: [undefined],
            b: ["b"],
        });
    });

    it("throws when keys is not an array or an entry is not an iteratee", () => {
        expect(() =>
            groupByKeys({ array: [1], keys: "city" as never }),
        ).toThrow(TypeError);
        expect(() => groupByKeys({ array: [1], keys: [{}] as never })).toThrow(
            TypeError,
        );
        expect(() =>
            groupByKeys({ array: "text" as never, keys: null as never }),
        ).toThrow(TypeError);
        expect(() => groupByKeys({ array: [1] } as never)).toThrow(TypeError);
    });
});
