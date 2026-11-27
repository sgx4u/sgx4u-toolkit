import { describe, expect, it } from "vitest";
import { createRange } from "./create-range.js";

describe("createRange", () => {
    it("counts from 0 up to but not including end", () => {
        expect(createRange(3)).toEqual([0, 1, 2]);
        expect(createRange(0)).toEqual([]);
        expect(createRange(1)).toEqual([0]);
    });

    it("uses start, step, and an exclusive end", () => {
        expect(createRange({ start: 1, end: 4 })).toEqual([1, 2, 3]);
        expect(createRange({ start: 0, end: 1, step: 0.5 })).toEqual([0, 0.5]);
        expect(createRange({ start: 5, end: 1, step: -1 })).toEqual([
            5, 4, 3, 2,
        ]);
    });

    it("includes the end when it lands on a step", () => {
        expect(createRange({ start: 0, end: 3, inclusive: true })).toEqual([
            0, 1, 2, 3,
        ]);
        expect(
            createRange({ start: 0, end: 1, step: 0.5, inclusive: true }),
        ).toEqual([0, 0.5, 1]);
        expect(
            createRange({ start: 5, end: 1, step: -1, inclusive: true }),
        ).toEqual([5, 4, 3, 2, 1]);
        expect(createRange({ start: 3, end: 3, inclusive: true })).toEqual([3]);
        expect(createRange({ start: 3, end: 3 })).toEqual([]);
    });

    it("includes a fractional end that lands on a step", () => {
        const values = createRange({
            start: 0,
            end: 0.6,
            step: 0.2,
        });
        expect(values).toHaveLength(3);
        expect(values[0]).toBe(0);
        expect(values[2]).toBeCloseTo(0.4);

        const inclusive = createRange({
            start: 0,
            end: 1,
            step: 0.1,
            inclusive: true,
        });
        expect(inclusive).toHaveLength(11);
        expect(inclusive[0]).toBe(0);
        expect(inclusive[10]).toBeCloseTo(1);
    });

    it("returns an empty array when the step points the wrong way", () => {
        expect(createRange(-3)).toEqual([]);
        expect(createRange({ start: 0, end: 5, step: -1 })).toEqual([]);
        expect(createRange({ start: 5, end: 0, step: 1 })).toEqual([]);
    });

    it("stops before an end that does not land on a step", () => {
        expect(createRange(1.5)).toEqual([0, 1]);
        const thirds = createRange({ start: 0, end: 1, step: 0.3 });
        expect(thirds).toHaveLength(4);
        expect(thirds[0]).toBe(0);
        expect(thirds[1]).toBeCloseTo(0.3);
        expect(thirds[3]).toBeCloseTo(0.9);
        const inclusiveThirds = createRange({
            start: 0,
            end: 1,
            step: 0.3,
            inclusive: true,
        });
        expect(inclusiveThirds).toEqual(thirds);
    });

    it("throws when a bound is not a finite number", () => {
        expect(() => createRange(Number.POSITIVE_INFINITY)).toThrow(RangeError);
        expect(() => createRange(Number.NaN)).toThrow(RangeError);
        expect(() => createRange("3" as never)).toThrow(TypeError);
        expect(() => createRange(null as never)).toThrow(TypeError);
        expect(() => createRange({} as never)).toThrow(TypeError);
        expect(() => createRange({ start: "0", end: 3 } as never)).toThrow(
            TypeError,
        );
        expect(() => createRange({ end: Number.NEGATIVE_INFINITY })).toThrow(
            RangeError,
        );
    });

    it("throws when step is 0", () => {
        expect(() => createRange({ end: 3, step: 0 })).toThrow(RangeError);
        expect(() => createRange({ start: 1, end: 1, step: 0 })).toThrow(
            "`step` must be a non-zero finite number; received 0.",
        );
    });

    it("throws when the range is longer than one million values", () => {
        expect(() => createRange(1_000_001)).toThrow(
            "`end` must produce a finite range; received 1000001.",
        );
        expect(createRange(3)).toHaveLength(3);
    });
});
