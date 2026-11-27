import { describe, expect, it } from "vitest";
import { sampleItem } from "./sample-item.js";

describe("sampleItem", () => {
    it("returns undefined for an empty array or a non-array", () => {
        expect(sampleItem([])).toBeUndefined();
        expect(sampleItem({ array: [] })).toBeUndefined();
        expect(sampleItem(undefined as never)).toBeUndefined();
        expect(sampleItem(null as never)).toBeUndefined();
        expect(sampleItem({ array: "no" } as never)).toBeUndefined();
    });

    it("returns the only item", () => {
        expect(sampleItem([7])).toBe(7);
        expect(sampleItem({ array: ["a"], seed: 1 })).toBe("a");
    });

    it("does not mutate a frozen array", () => {
        const values = Object.freeze([1, 2, 3, 4]);
        const item = sampleItem({ array: values, seed: 3 });
        expect(values).toEqual([1, 2, 3, 4]);
        expect(values).toContain(item);
    });

    it("repeats the same item for the same seed", () => {
        const values = [1, 2, 3, 4, 5];
        expect(sampleItem({ array: values, seed: 8 })).toBe(
            sampleItem({ array: values, seed: 8 }),
        );
    });

    it("reads a sparse hole as undefined and can draw it", () => {
        const values: number[] = [];
        values[0] = 1;
        values[2] = 3;
        expect(
            sampleItem({
                array: values,
                random: () => 0.5,
            }),
        ).toBeUndefined();
        expect(1 in values).toBe(false);
    });

    it("throws when seed or random is unusable", () => {
        expect(() => sampleItem({ array: [1], seed: Number.NaN })).toThrow(
            RangeError,
        );
        expect(() => sampleItem({ array: [1, 2], random: () => 2 })).toThrow(
            RangeError,
        );
    });
});
