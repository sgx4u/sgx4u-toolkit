import { describe, expect, it } from "vitest";
import type { ChunkByParams } from "./chunk-by.types.js";
import { chunkBy } from "./chunk-by.js";

function* generate(): Generator<number, void, unknown> {
    yield 1;
}

function sparse(): number[] {
    const array: number[] = [];
    array[0] = 1;
    array[2] = 1;
    return array;
}

describe("chunkBy", () => {
    it("starts a new group when the key changes", () => {
        const params: ChunkByParams<number> = {
            array: [1, 1, 2, 2, 1],
            by: (item) => item,
        };
        expect(chunkBy(params)).toEqual([[1, 1], [2, 2], [1]]);
    });

    it("groups a property and treats NaN and -0 as equal", () => {
        expect(
            chunkBy({
                array: [{ kind: "a" }, { kind: "a" }, { kind: "b" }],
                by: "kind",
            }),
        ).toEqual([[{ kind: "a" }, { kind: "a" }], [{ kind: "b" }]]);
        expect(
            chunkBy({
                array: [Number.NaN, Number.NaN, 1, 0, -0],
                by: (item: number) => item,
            }),
        ).toEqual([[Number.NaN, Number.NaN], [1], [0, -0]]);
    });

    it("returns an empty array for an empty array", () => {
        const array: number[] = [];
        const result = chunkBy({ array, by: (item) => item });
        expect(result).toEqual([]);
        expect(result).not.toBe(array);
    });

    it("returns undefined for a non-object and for a non-array field", () => {
        expect(chunkBy(null)).toBeUndefined();
        expect(chunkBy("text")).toBeUndefined();
        expect(chunkBy(generate)).toBeUndefined();
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
                chunkBy({ array: array as never, by: (item: unknown) => item }),
            ).toBeUndefined();
        }
    });

    it("does not mutate a frozen array and passes index and array", () => {
        const array = Object.freeze([1, 1, 2]);
        const seen: Array<{ index: number; length: number }> = [];
        const result = chunkBy({
            array,
            by: (item, index, source) => {
                seen.push({ index, length: source.length });
                return item;
            },
        });
        expect(result).toEqual([[1, 1], [2]]);
        expect(result).not.toBe(array);
        expect(seen).toEqual([
            { index: 0, length: 3 },
            { index: 1, length: 3 },
            { index: 2, length: 3 },
        ]);
        expect(array).toEqual([1, 1, 2]);
    });

    it("copies holes as undefined", () => {
        expect(chunkBy({ array: sparse(), by: (item) => item })).toEqual([
            [1],
            [undefined],
            [1],
        ]);
    });

    it("throws when by is missing or not an iteratee", () => {
        expect(() => chunkBy({ array: [1] } as never)).toThrow(TypeError);
        expect(() => chunkBy({ array: [1], by: {} as never })).toThrow(
            TypeError,
        );
        expect(() =>
            chunkBy({ array: "text" as never, by: null as never }),
        ).toThrow(TypeError);
    });
});
