import { describe, expect, it } from "vitest";
import { takeLastWhile } from "./take-last-while.js";
import type { TakeLastWhileParams } from "./take-last-while.types.js";

function* oneNumber(): Generator<number> {
    yield 1;
}

describe("takeLastWhile", () => {
    it("returns the trailing run in original order", () => {
        const input = Object.freeze([1, 2, 3, 4]);
        const params: TakeLastWhileParams<number> = {
            array: input,
            predicate: (item) => item > 2,
        };
        const result = takeLastWhile(params);

        expect(result).toEqual([3, 4]);
        expect(result).not.toBe(input);
        expect(
            takeLastWhile({ array: [4, 1, 3], predicate: (item) => item > 2 }),
        ).toEqual([3]);
        expect(
            takeLastWhile({
                array: [1, 2, 3, 4],
                predicate: (item) => item > 0,
            }),
        ).toEqual([1, 2, 3, 4]);
        expect(
            takeLastWhile({
                array: [1, 2, 3, 4],
                predicate: (item) => item > 10,
            }),
        ).toEqual([]);
        expect(takeLastWhile({ array: [], predicate: () => true })).toEqual([]);
        expect(takeLastWhile({ array: [1], predicate: () => true })).toEqual([
            1,
        ]);
        expect(input).toEqual([1, 2, 3, 4]);
    });

    it("returns undefined for a non-object or a non-array", () => {
        expect(takeLastWhile(null)).toBeUndefined();
        expect(takeLastWhile("text")).toBeUndefined();
        expect(
            takeLastWhile({
                array: "text" as unknown as number[],
                predicate: () => true,
            }),
        ).toBeUndefined();
    });

    it("throws when predicate is not a function", () => {
        expect(() => takeLastWhile({})).toThrow(TypeError);
        expect(() => takeLastWhile(new Uint8Array([1]))).toThrow(TypeError);
        expect(() => takeLastWhile(new Set([1]))).toThrow(TypeError);
        expect(() => takeLastWhile(oneNumber())).toThrow(TypeError);
        expect(() =>
            takeLastWhile({
                array: "no",
                predicate: "no" as unknown as () => boolean,
            }),
        ).toThrow(TypeError);
    });
});
