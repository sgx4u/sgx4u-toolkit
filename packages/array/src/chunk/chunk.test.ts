import { describe, expect, it } from "vitest";
import type { ChunkParams } from "./chunk.types.js";
import { chunk } from "./chunk.js";

function* generate(): Generator<number, void, unknown> {
    yield 1;
}

function sparse(): number[] {
    const array: number[] = [];
    array[0] = 1;
    array[2] = 3;
    return array;
}

describe("chunk", () => {
    it("splits consecutive groups and keeps a short tail", () => {
        const params: ChunkParams<number> = {
            array: [1, 2, 3, 4, 5],
            size: 2,
        };
        const result = chunk(params);
        expect(result).toEqual([[1, 2], [3, 4], [5]]);
        expect(result).not.toBe(params.array);
    });

    it("returns one group when size is at least the length", () => {
        const array = [1, 2, 3];
        const result = chunk({ array, size: 10 });
        expect(result).toEqual([[1, 2, 3]]);
        expect(result?.[0]).not.toBe(array);
    });

    it("returns an empty array for an empty array", () => {
        const array: number[] = [];
        const result = chunk({ array, size: 2 });
        expect(result).toEqual([]);
        expect(result).not.toBe(array);
    });

    it("returns undefined for a non-object and for a non-array field", () => {
        expect(chunk(null)).toBeUndefined();
        expect(chunk("text")).toBeUndefined();
        expect(chunk(generate)).toBeUndefined();
        const invalidArrays = [
            null,
            {},
            "text",
            new Uint8Array([1]),
            new Set([1]),
            generate(),
        ];
        for (const array of invalidArrays) {
            expect(chunk({ array: array as never, size: 1 })).toBeUndefined();
        }
    });

    it("does not mutate a frozen array", () => {
        const array = Object.freeze([1, 2, 3, 4]);
        const result = chunk({ array, size: 3 });
        expect(result).toEqual([[1, 2, 3], [4]]);
        expect(result).not.toBe(array);
        expect(array).toEqual([1, 2, 3, 4]);
    });

    it("copies holes as undefined", () => {
        expect(chunk({ array: sparse(), size: 2 })).toEqual([
            [1, undefined],
            [3],
        ]);
    });

    it("throws when size is missing or not a positive finite integer", () => {
        expect(() => chunk({})).toThrow(TypeError);
        expect(() => chunk({ array: [1], size: "2" as never })).toThrow(
            TypeError,
        );
        expect(() => chunk({ array: [1], size: 0 })).toThrow(RangeError);
        expect(() => chunk({ array: [1], size: -1 })).toThrow(RangeError);
        expect(() => chunk({ array: [1], size: 1.5 })).toThrow(RangeError);
        expect(() =>
            chunk({ array: [1], size: Number.POSITIVE_INFINITY }),
        ).toThrow(RangeError);
        expect(() => chunk({ array: [1], size: Number.NaN })).toThrow(
            RangeError,
        );
        expect(() => chunk({ array: "text" as never, size: 0 })).toThrow(
            RangeError,
        );
    });
});
