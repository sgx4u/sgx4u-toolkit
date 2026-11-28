import { describe, expect, it } from "vitest";
import type { IndexByParams } from "./index-by.types.js";
import { indexBy } from "./index-by.js";

interface Row {
    id: string;
    name: string;
}

function* generate(): Generator<Row, void, unknown> {
    yield { id: "a", name: "one" };
}

function sparse(): Row[] {
    const array: Row[] = [];
    array[0] = { id: "a", name: "one" };
    array[2] = { id: "a", name: "three" };
    return array;
}

describe("indexBy", () => {
    it("keeps the last item for a key by default", () => {
        const rows: Row[] = [
            { id: "a", name: "one" },
            { id: "b", name: "two" },
            { id: "a", name: "three" },
        ];
        const params: IndexByParams<Row> = { array: rows, by: "id" };
        const result = indexBy(params);
        expect(result).toEqual({
            a: { id: "a", name: "three" },
            b: { id: "b", name: "two" },
        });
        expect(Object.keys(result ?? {})).toEqual(["a", "b"]);
        expect(result).not.toBe(rows);
    });

    it("keeps the first item when onConflict is first", () => {
        expect(
            indexBy({
                array: [
                    { id: "a", name: "one" },
                    { id: "a", name: "two" },
                ],
                by: "id",
                onConflict: "first",
            }),
        ).toEqual({ a: { id: "a", name: "one" } });
    });

    it("throws a RangeError when onConflict is throw and a key repeats", () => {
        expect(() =>
            indexBy({
                array: ["a", "a"],
                by: (item: string) => item,
                onConflict: "throw",
            }),
        ).toThrow(
            new RangeError(
                '`by` produced a duplicate key "a" while `onConflict` is "throw".',
            ),
        );
    });

    it("returns an empty record for an empty array", () => {
        const array: Row[] = [];
        const result = indexBy({ array, by: "id" });
        expect(result).toEqual({});
        expect(result).not.toBe(array);
    });

    it("returns undefined for a non-object and for a non-array field", () => {
        expect(indexBy(null)).toBeUndefined();
        expect(indexBy("text")).toBeUndefined();
        expect(indexBy(generate)).toBeUndefined();
        const invalidArrays = [
            null,
            {},
            "text",
            new Uint8Array([1]),
            new Set(["a"]),
            generate(),
        ];
        for (const array of invalidArrays) {
            expect(
                indexBy({ array: array as never, by: (item: unknown) => item }),
            ).toBeUndefined();
        }
    });

    it("does not mutate a frozen array", () => {
        const array = Object.freeze([{ id: "a", name: "one" }]);
        expect(indexBy({ array, by: "id" })).toEqual({
            a: { id: "a", name: "one" },
        });
        expect(array).toEqual([{ id: "a", name: "one" }]);
    });

    it("copies holes as undefined", () => {
        expect(
            indexBy({
                array: sparse(),
                by: (item) => item?.id ?? "hole",
                onConflict: "first",
            }),
        ).toEqual({
            a: { id: "a", name: "one" },
            hole: undefined,
        });
    });

    it("throws when by or onConflict is invalid", () => {
        expect(() => indexBy({ array: [{ id: "a" }] } as never)).toThrow(
            TypeError,
        );
        expect(() =>
            indexBy({ array: [{ id: "a" }], by: {} as never }),
        ).toThrow(TypeError);
        expect(() =>
            indexBy({
                array: [{ id: "a", name: "one" }],
                by: "id",
                onConflict: "middle" as never,
            }),
        ).toThrow(RangeError);
        expect(() =>
            indexBy({
                array: "text" as never,
                by: "id",
                onConflict: "nope" as never,
            }),
        ).toThrow(RangeError);
    });
});
