import { describe, expect, it } from "vitest";
import type { IsDisjointParams } from "./is-disjoint.types.js";
import { isDisjoint } from "./is-disjoint.js";

function* generate(): Generator<number, void, unknown> {
    yield 1;
}

describe("isDisjoint", () => {
    it("is true when the arrays share no item", () => {
        const params: IsDisjointParams<number> = {
            first: [1, 2],
            second: [3, 4],
        };
        expect(isDisjoint(params)).toBe(true);
        expect(isDisjoint({ first: [1, 2], second: [2, 3] })).toBe(false);
    });

    it("treats empty arrays as disjoint", () => {
        expect(isDisjoint({ first: [], second: [1] })).toBe(true);
        expect(isDisjoint({ first: [], second: [] })).toBe(true);
    });

    it("treats NaN as equal to NaN and -0 as equal to 0", () => {
        expect(isDisjoint({ first: [Number.NaN], second: [Number.NaN] })).toBe(
            false,
        );
        expect(isDisjoint({ first: [0], second: [-0] })).toBe(false);
        expect(isDisjoint({ first: [1], second: [Number.NaN] })).toBe(true);
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
            expect(isDisjoint(value)).toBe(false);
        }
        expect(isDisjoint({ first: "no" as never, second: [1] })).toBe(false);
        expect(
            isDisjoint({ first: [1], second: [2], equals: "nope" as never }),
        ).toBe(false);
    });

    it("does not mutate a frozen input", () => {
        const first = Object.freeze([1]);
        const second = Object.freeze([2]);
        expect(isDisjoint({ first, second })).toBe(true);
        expect(first).toEqual([1]);
    });

    it("treats holes as undefined", () => {
        const sparse: number[] = [];
        sparse[1] = 2;
        expect(isDisjoint({ first: sparse, second: [undefined] })).toBe(false);
        expect(isDisjoint({ first: sparse, second: [1] })).toBe(true);
    });
});
