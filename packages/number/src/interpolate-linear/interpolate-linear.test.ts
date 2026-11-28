import { describe, expect, it } from "vitest";
import { assert, integer, property } from "fast-check";
import { interpolateLinear } from "../index.js";

describe("interpolateLinear", () => {
    it("covers the documented behavior", () => {
        expect(interpolateLinear({ start: 0, end: 10, amount: 0 })).toBe(0);
        expect(interpolateLinear({ start: 0, end: 10, amount: 1 })).toBe(10);
        expect(interpolateLinear({ start: 0, end: 10, amount: 2 })).toBe(20);
        expect(
            interpolateLinear({ start: Number.NaN, end: 1, amount: 0 }),
        ).toBeUndefined();
        assert(
            property(
                integer({ min: -1000, max: 1000 }),
                integer({ min: -1000, max: 1000 }),
                (start, end) => {
                    expect(interpolateLinear({ start, end, amount: 0 })).toBe(
                        start,
                    );
                    expect(interpolateLinear({ start, end, amount: 1 })).toBe(
                        end,
                    );
                },
            ),
        );
    });
});
