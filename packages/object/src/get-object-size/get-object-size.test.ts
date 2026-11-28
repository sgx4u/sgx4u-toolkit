import { describe, expect, it } from "vitest";
import { getObjectSize } from "./get-object-size.js";

describe("getObjectSize", () => {
    it("counts keys and nested keys once", () => {
        expect(getObjectSize({ a: { b: 1 }, c: 2 })).toBe(2);
        expect(
            getObjectSize({ object: { a: { b: 1 }, c: 2 }, deep: true }),
        ).toBe(3);
        expect(getObjectSize(null)).toBeUndefined();
        const cycle: { a: number; self?: object } = { a: 1 };
        cycle.self = cycle;
        expect(getObjectSize({ object: cycle, deep: true })).toBe(2);
        const symbol = Symbol("id");
        expect(
            getObjectSize({ object: { [symbol]: 1 }, includeSymbols: true }),
        ).toBe(1);
        expect(getObjectSize({ object: [1, { a: 1 }], deep: true })).toBe(3);
    });
});
