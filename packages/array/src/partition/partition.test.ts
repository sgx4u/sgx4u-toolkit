import { describe, expect, it } from "vitest";
import type { PartitionParams } from "./partition.types.js";
import { partition } from "./partition.js";

function* generate(): Generator<number, void, unknown> {
    yield 1;
}

function sparse(): number[] {
    const array: number[] = [];
    array[0] = 1;
    array[2] = 2;
    return array;
}

describe("partition", () => {
    it("splits matches and the rest in original order", () => {
        const params: PartitionParams<number> = {
            array: [1, 2, 3, 4],
            predicate: (item) => item % 2 === 0,
        };
        const result = partition(params);
        expect(result).toEqual([
            [2, 4],
            [1, 3],
        ]);
        expect(result).not.toBe(params.array);
    });

    it("returns two empty buckets for an empty array", () => {
        const array: number[] = [];
        const result = partition({
            array,
            predicate: () => true,
        });
        expect(result).toEqual([[], []]);
        expect(result).not.toBe(array);
    });

    it("returns undefined for a non-object and for a non-array field", () => {
        expect(partition(null)).toBeUndefined();
        expect(partition("text")).toBeUndefined();
        expect(partition(generate)).toBeUndefined();
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
                partition({
                    array: array as never,
                    predicate: () => true,
                }),
            ).toBeUndefined();
        }
    });

    it("does not mutate a frozen array and passes index and array", () => {
        const array = Object.freeze([1, 2, 3]);
        const seen: number[] = [];
        const result = partition({
            array,
            predicate: (item, index, source) => {
                seen.push(index);
                expect(source).toBe(array);
                return item > 1;
            },
        });
        expect(result).toEqual([[2, 3], [1]]);
        expect(seen).toEqual([0, 1, 2]);
        expect(array).toEqual([1, 2, 3]);
    });

    it("copies holes as undefined", () => {
        expect(
            partition({
                array: sparse(),
                predicate: (item) => item === undefined,
            }),
        ).toEqual([[undefined], [1, 2]]);
    });

    it("throws when predicate is missing or not a function", () => {
        expect(() => partition({ array: [1] } as never)).toThrow(TypeError);
        expect(() =>
            partition({ array: [1], predicate: "nope" as never }),
        ).toThrow(TypeError);
        expect(() =>
            partition({ array: "text" as never, predicate: null as never }),
        ).toThrow(TypeError);
    });
});
