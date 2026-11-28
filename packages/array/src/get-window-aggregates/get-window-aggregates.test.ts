import { describe, expect, it } from "vitest";
import { getWindowAggregates } from "./get-window-aggregates.js";

describe("getWindowAggregates", () => {
    it("returns undefined for an empty array or a non-array", () => {
        expect(
            getWindowAggregates({ array: [], size: 2, aggregate: "sum" }),
        ).toBeUndefined();
        expect(
            getWindowAggregates({
                array: "no",
                size: 1,
                aggregate: "sum",
            } as never),
        ).toBeUndefined();
    });

    it("slides full and partial windows", () => {
        const values = Object.freeze([1, 2, 3, 4]);
        const windows = getWindowAggregates({
            array: values,
            size: 3,
            step: 2,
            aggregate: "sum",
        });
        expect(windows).toEqual([
            { start: 0, end: 3, items: [1, 2, 3], value: 6 },
            { start: 2, end: 4, items: [3, 4], value: 7 },
        ]);
        expect(windows?.[0]?.items).not.toBe(values);
        expect(
            getWindowAggregates({
                array: values,
                size: 3,
                step: 2,
                aggregate: "sum",
                partial: false,
            }),
        ).toEqual([{ start: 0, end: 3, items: [1, 2, 3], value: 6 }]);
        expect(values).toEqual([1, 2, 3, 4]);
    });

    it("returns an empty array when no full window fits", () => {
        expect(
            getWindowAggregates({
                array: [1, 2],
                size: 3,
                aggregate: "mean",
                partial: false,
            }),
        ).toEqual([]);
    });

    it("computes named aggregates and accepts a function", () => {
        expect(
            getWindowAggregates({
                array: [3, 1, 2],
                size: 3,
                step: 3,
                aggregate: "min",
            }),
        ).toEqual([{ start: 0, end: 3, items: [3, 1, 2], value: 1 }]);
        expect(
            getWindowAggregates({
                array: [3, 1, 2],
                size: 3,
                aggregate: "max",
            })?.[0]?.value,
        ).toBe(3);
        expect(
            getWindowAggregates({
                array: [1, 3],
                size: 2,
                aggregate: "mean",
            })?.[0]?.value,
        ).toBe(2);
        expect(
            getWindowAggregates({
                array: ["a", "bb"],
                size: 1,
                aggregate: (items) => items[0]?.length,
            }),
        ).toEqual([
            { start: 0, end: 1, items: ["a"], value: 1 },
            { start: 1, end: 2, items: ["bb"], value: 2 },
        ]);
    });

    it("throws for a bad size, step, aggregate, or non-numeric item", () => {
        expect(() =>
            getWindowAggregates({ array: [1], size: 0, aggregate: "sum" }),
        ).toThrow(RangeError);
        expect(() =>
            getWindowAggregates({
                array: [1],
                size: 1,
                step: 0,
                aggregate: "sum",
            }),
        ).toThrow(RangeError);
        expect(() =>
            getWindowAggregates({
                array: [1],
                size: 1,
                aggregate: "median" as never,
            }),
        ).toThrow(RangeError);
        expect(() =>
            getWindowAggregates({ array: ["a"], size: 1, aggregate: "sum" }),
        ).toThrow(TypeError);
    });
});
