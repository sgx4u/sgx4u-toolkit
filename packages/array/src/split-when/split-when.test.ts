import { describe, expect, it } from "vitest";
import { splitWhen } from "./split-when.js";
import type { SplitWhenParams } from "./split-when.types.js";

function* oneNumber(): Generator<number> {
    yield 1;
}

describe("splitWhen", () => {
    it("splits at the first match", () => {
        const input = Object.freeze([1, 2, 3, 4]);
        const params: SplitWhenParams<number> = {
            array: input,
            predicate: (item) => item > 2,
        };
        const result = splitWhen(params);

        expect(result).toEqual([
            [1, 2],
            [3, 4],
        ]);
        expect(result?.[0]).not.toBe(input);
        expect(result?.[1]).not.toBe(input);
        expect(splitWhen({ array: input, predicate: () => false })).toEqual([
            [1, 2, 3, 4],
            [],
        ]);
        expect(splitWhen({ array: input, predicate: () => true })).toEqual([
            [],
            [1, 2, 3, 4],
        ]);
        expect(splitWhen({ array: [], predicate: () => true })).toEqual([
            [],
            [],
        ]);
        expect(splitWhen({ array: [1], predicate: () => false })).toEqual([
            [1],
            [],
        ]);
        expect(input).toEqual([1, 2, 3, 4]);
    });

    it("treats a hole as undefined", () => {
        const sparse: number[] = [];
        sparse[0] = 1;
        sparse[2] = 3;
        expect(
            splitWhen({
                array: sparse,
                predicate: (item) => item === undefined,
            }),
        ).toEqual([[1], [undefined, 3]]);
    });

    it("returns undefined for a non-object or a non-array", () => {
        expect(splitWhen(null)).toBeUndefined();
        expect(splitWhen("text")).toBeUndefined();
        expect(
            splitWhen({
                array: "text" as unknown as number[],
                predicate: () => true,
            }),
        ).toBeUndefined();
    });

    it("throws when predicate is not a function", () => {
        expect(() => splitWhen({})).toThrow(TypeError);
        expect(() => splitWhen(new Uint8Array([1]))).toThrow(TypeError);
        expect(() => splitWhen(new Set([1]))).toThrow(TypeError);
        expect(() => splitWhen(oneNumber())).toThrow(TypeError);
        expect(() =>
            splitWhen({
                array: [1],
                predicate: "no" as unknown as () => boolean,
            }),
        ).toThrow(TypeError);
    });
});
