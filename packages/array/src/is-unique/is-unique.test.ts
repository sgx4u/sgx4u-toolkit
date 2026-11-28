import { describe, expect, it } from "vitest";
import type { IsUniqueParams } from "./is-unique.types.js";
import { isUnique } from "./is-unique.js";

function* generate(): Generator<number, void, unknown> {
    yield 1;
}

describe("isUnique", () => {
    it("is true when no item is repeated", () => {
        const params: IsUniqueParams<number> = { array: [1, 2, 3] };
        expect(isUnique(params)).toBe(true);
        expect(isUnique({ array: [1, 1] })).toBe(false);
    });

    it("treats an empty array as unique", () => {
        expect(isUnique({ array: [] })).toBe(true);
        expect(isUnique({ array: [], by: {} as never })).toBe(true);
        expect(isUnique({ array: [], equals: "nope" as never })).toBe(true);
    });

    it("treats NaN as a duplicate of NaN and -0 as a duplicate of 0", () => {
        expect(isUnique({ array: [Number.NaN, Number.NaN] })).toBe(false);
        expect(isUnique({ array: [0, -0] })).toBe(false);
        expect(isUnique({ array: [Number.NaN, 1] })).toBe(true);
    });

    it("lets by win over an invalid equals", () => {
        expect(
            isUnique({
                array: [{ id: 1 }, { id: 2 }],
                by: "id",
                equals: "nope" as never,
            }),
        ).toBe(true);
        expect(
            isUnique({
                array: [{ id: 1 }, { id: 1 }],
                by: "id",
            }),
        ).toBe(false);
    });

    it("returns false for invalid input and never throws", () => {
        const invalidValues = [
            null,
            {},
            "text",
            new Uint8Array([1]),
            new Set([1]),
            generate(),
        ];
        for (const value of invalidValues) {
            expect(isUnique(value)).toBe(false);
        }
        expect(isUnique({ array: [1, 2], equals: "nope" as never })).toBe(
            false,
        );
        expect(isUnique({ array: [1, 2], by: {} as never })).toBe(false);
        expect(isUnique(generate)).toBe(false);
    });

    it("does not mutate a frozen input", () => {
        const array = Object.freeze([1, 2, 3]);
        expect(isUnique({ array })).toBe(true);
        expect(array).toEqual([1, 2, 3]);
    });

    it("treats holes as undefined", () => {
        const sparse: number[] = [];
        sparse[0] = 1;
        sparse[2] = 2;
        expect(isUnique({ array: sparse })).toBe(true);
        const repeated: number[] = [];
        repeated[0] = 1;
        repeated[2] = 1;
        expect(isUnique({ array: repeated })).toBe(false);
    });
});
