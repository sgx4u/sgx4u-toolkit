import { describe, expect, it } from "vitest";
import { isEqualWith } from "./is-equal-with.js";
import type { IsEqualWithParams } from "./is-equal-with.types.js";

describe("isEqualWith", () => {
    it("uses the default rule when the comparator returns undefined", () => {
        expect(
            isEqualWith({
                comparator: ({ first, second }) =>
                    typeof first === "number" && typeof second === "string"
                        ? first === Number(second)
                        : undefined,
                first: { a: 1, b: Number.NaN },
                second: { a: "1", b: Number.NaN },
            }),
        ).toBe(true);
    });

    it("accepts a boolean from the comparator", () => {
        expect(
            isEqualWith({
                comparator: () => false,
                first: 1,
                second: 1,
            }),
        ).toBe(false);
    });

    it("compares symbol keys only when includeSymbols is true", () => {
        const id = Symbol("id");

        expect(
            isEqualWith({
                comparator: () => undefined,
                first: { [id]: 1, a: 1 },
                second: { a: 1 },
            }),
        ).toBe(true);
        expect(
            isEqualWith({
                comparator: () => undefined,
                first: { [id]: 1, a: 1 },
                includeSymbols: true,
                second: { a: 1 },
            }),
        ).toBe(false);
    });

    it("throws TypeError when comparator is not a function", () => {
        expect(() =>
            isEqualWith({
                comparator: null as unknown as IsEqualWithParams["comparator"],
                first: 1,
                second: 1,
            }),
        ).toThrow(TypeError);
        expect(() => isEqualWith(null as unknown as IsEqualWithParams)).toThrow(
            TypeError,
        );
    });
});
