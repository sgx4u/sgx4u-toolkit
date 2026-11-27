import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { shuffleItems } from "./shuffle-items.js";

describe("shuffleItems", () => {
    it("returns an empty array for an empty array", () => {
        expect(shuffleItems([])).toEqual([]);
        expect(shuffleItems({ array: [] })).toEqual([]);
    });

    it("returns undefined when the input is not an array", () => {
        expect(shuffleItems(undefined as never)).toBeUndefined();
        expect(shuffleItems(null as never)).toBeUndefined();
        expect(shuffleItems("no" as never)).toBeUndefined();
        expect(shuffleItems({ array: "no" } as never)).toBeUndefined();
    });

    it("does not mutate a frozen array and returns a new array", () => {
        const values = Object.freeze([1, 2, 3, 4]);
        const shuffled = shuffleItems(values);
        expect(shuffled).not.toBe(values);
        expect(values).toEqual([1, 2, 3, 4]);
        expect(shuffled).toHaveLength(4);
    });

    it("treats a sparse hole as undefined", () => {
        const values: number[] = [];
        values[0] = 1;
        values[2] = 3;
        const shuffled = shuffleItems({ array: values, seed: 2 });
        expect(shuffled).toHaveLength(3);
        expect(shuffled?.filter((item) => item === undefined)).toHaveLength(1);
        expect(shuffled?.filter((item) => item === 1)).toHaveLength(1);
        expect(shuffled?.filter((item) => item === 3)).toHaveLength(1);
        expect(1 in (values as number[])).toBe(false);
    });

    it("repeats the same permutation for the same seed", () => {
        const values = [1, 2, 3, 4, 5, 6];
        const first = shuffleItems({ array: values, seed: 11 });
        const second = shuffleItems({ array: values, seed: 11 });
        expect(second).toEqual(first);
        expect(first).not.toEqual(values);
    });

    it("uses a finite seed instead of random", () => {
        const values = [1, 2, 3, 4];
        const seeded = shuffleItems({
            array: values,
            seed: 4,
            random: () => 0,
        });
        expect(seeded).toEqual(shuffleItems({ array: values, seed: 4 }));
    });

    it("throws when seed or random is unusable", () => {
        expect(() =>
            shuffleItems({ array: [1], seed: Number.POSITIVE_INFINITY }),
        ).toThrow(RangeError);
        expect(() =>
            shuffleItems({ array: [1], random: "no" as never }),
        ).toThrow(TypeError);
        expect(() =>
            shuffleItems({
                array: [1, 2],
                random: () => 1,
            }),
        ).toThrow(RangeError);
    });

    it("is a permutation and does not change the input", () => {
        fc.assert(
            fc.property(
                fc.array(fc.integer()),
                fc.integer(),
                (values, seed) => {
                    const original = values.slice();
                    const first = shuffleItems({ array: values, seed });
                    const second = shuffleItems({ array: values, seed });
                    expect(second).toEqual(first);
                    expect(values).toEqual(values.slice());
                    expect(values).toEqual(original);
                    expect(
                        [...(first ?? [])].sort((left, right) => left - right),
                    ).toEqual([...values].sort((left, right) => left - right));
                },
            ),
        );
    });
});
