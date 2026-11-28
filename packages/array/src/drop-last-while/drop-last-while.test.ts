import { describe, expect, it } from "vitest";
import { dropLastWhile } from "./drop-last-while.js";
import type { DropLastWhileParams } from "./drop-last-while.types.js";

function* oneNumber(): Generator<number> {
    yield 1;
}

describe("dropLastWhile", () => {
    it("drops the trailing run", () => {
        const input = Object.freeze([1, 2, 3, 4]);
        const params: DropLastWhileParams<number> = {
            array: input,
            predicate: (item) => item > 2,
        };
        const result = dropLastWhile(params);

        expect(result).toEqual([1, 2]);
        expect(result).not.toBe(input);
        expect(
            dropLastWhile({ array: [4, 1, 3], predicate: (item) => item > 2 }),
        ).toEqual([4, 1]);
        expect(dropLastWhile({ array: [1, 2], predicate: () => true })).toEqual(
            [],
        );
        expect(dropLastWhile({ array: [], predicate: () => true })).toEqual([]);
        expect(dropLastWhile({ array: [1], predicate: () => false })).toEqual([
            1,
        ]);
        expect(input).toEqual([1, 2, 3, 4]);
    });

    it("returns undefined for a non-object or a non-array", () => {
        expect(dropLastWhile(null)).toBeUndefined();
        expect(dropLastWhile("text")).toBeUndefined();
    });

    it("throws when predicate is not a function", () => {
        expect(() => dropLastWhile({})).toThrow(TypeError);
        expect(() => dropLastWhile(new Uint8Array([1]))).toThrow(TypeError);
        expect(() => dropLastWhile(new Set([1]))).toThrow(TypeError);
        expect(() => dropLastWhile(oneNumber())).toThrow(TypeError);
        expect(() =>
            dropLastWhile({
                array: "no",
                predicate: "no" as unknown as () => boolean,
            }),
        ).toThrow(TypeError);
    });
});
