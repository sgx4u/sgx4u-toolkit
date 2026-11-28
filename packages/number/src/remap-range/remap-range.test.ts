import { describe, expect, it } from "vitest";
import { remapRange } from "../index.js";

describe("remapRange", () => {
    it("covers the documented behavior", () => {
        expect(
            remapRange({
                value: 5,
                fromStart: 0,
                fromEnd: 10,
                toStart: 0,
                toEnd: 100,
            }),
        ).toBe(50);
        expect(
            remapRange({
                value: 15,
                fromStart: 0,
                fromEnd: 10,
                toStart: 0,
                toEnd: 100,
                clamp: true,
            }),
        ).toBe(100);
        expect(
            remapRange({
                value: 0,
                fromStart: 0,
                fromEnd: 0,
                toStart: 4,
                toEnd: 9,
            }),
        ).toBe(4);
        expect(
            remapRange({
                value: 1,
                fromStart: 0,
                fromEnd: 0,
                toStart: 4,
                toEnd: 9,
            }),
        ).toBeUndefined();
        expect(
            remapRange({
                value: Number.NaN,
                fromStart: 0,
                fromEnd: 1,
                toStart: 0,
                toEnd: 1,
            }),
        ).toBeUndefined();
    });
});
