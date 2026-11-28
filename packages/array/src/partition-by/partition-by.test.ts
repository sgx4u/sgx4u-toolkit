import { describe, expect, it } from "vitest";
import type { PartitionByParams } from "./partition-by.types.js";
import { partitionBy } from "./partition-by.js";

function* generate(): Generator<number, void, unknown> {
    yield 1;
}

function sparse(): number[] {
    const array: number[] = [];
    array[0] = 1;
    array[2] = 4;
    return array;
}

describe("partitionBy", () => {
    it("places each item in the first matching bucket", () => {
        const params: PartitionByParams<number> = {
            array: [1, 2, 3, 4],
            predicates: [(item) => item % 2 === 0, (item) => item > 2],
        };
        const result = partitionBy(params);
        expect(result).toEqual([[2, 4], [3], [1]]);
        expect(result).not.toBe(params.array);
    });

    it("returns one remainder bucket when predicates is empty", () => {
        const array = [1, 2];
        const result = partitionBy({ array, predicates: [] });
        expect(result).toEqual([[1, 2]]);
        expect(result?.[0]).not.toBe(array);
    });

    it("returns one empty remainder for an empty array", () => {
        const array: number[] = [];
        const result = partitionBy({ array, predicates: [] });
        expect(result).toEqual([[]]);
        expect(result).not.toBe(array);
    });

    it("returns undefined for a non-object and for a non-array field", () => {
        expect(partitionBy(null)).toBeUndefined();
        expect(partitionBy("text")).toBeUndefined();
        expect(partitionBy(generate)).toBeUndefined();
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
                partitionBy({ array: array as never, predicates: [] }),
            ).toBeUndefined();
        }
    });

    it("does not mutate a frozen array", () => {
        const array = Object.freeze([1, 2, 3]);
        const result = partitionBy({
            array,
            predicates: [(item) => item === 2],
        });
        expect(result).toEqual([[2], [1, 3]]);
        expect(array).toEqual([1, 2, 3]);
    });

    it("copies holes as undefined", () => {
        expect(
            partitionBy({
                array: sparse(),
                predicates: [(item) => item === undefined],
            }),
        ).toEqual([[undefined], [1, 4]]);
    });

    it("throws when predicates is not an array of functions", () => {
        expect(() =>
            partitionBy({ array: [1], predicates: "nope" as never }),
        ).toThrow(TypeError);
        expect(() =>
            partitionBy({
                array: [1],
                predicates: [(() => true) as never, "nope" as never],
            }),
        ).toThrow(TypeError);
        expect(() =>
            partitionBy({ array: "text" as never, predicates: null as never }),
        ).toThrow(TypeError);
        expect(() => partitionBy({ array: [1] } as never)).toThrow(TypeError);
    });
});
