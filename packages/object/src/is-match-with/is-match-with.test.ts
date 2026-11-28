import { describe, expect, it } from "vitest";
import { isMatchWith } from "./is-match-with.js";
import type { IsMatchWithParams } from "./is-match-with.types.js";

describe("isMatchWith", () => {
    it("uses the default partial rule when the comparator returns undefined", () => {
        const keys: PropertyKey[] = [];

        expect(
            isMatchWith({
                comparator: ({ key }) => {
                    if (key !== undefined) {
                        keys.push(key);
                    }
                    return undefined;
                },
                object: { a: { b: 1 }, extra: true },
                specification: { a: { b: 1 } },
            }),
        ).toBe(true);
        expect(keys).toEqual(["a", "b"]);
    });

    it("accepts a boolean from the comparator", () => {
        expect(
            isMatchWith({
                comparator: ({ object, specification }) =>
                    typeof object === "number" &&
                    typeof specification === "number"
                        ? object > specification
                        : undefined,
                object: { a: 2, b: 0 },
                specification: { a: 1 },
            }),
        ).toBe(true);
        expect(
            isMatchWith({
                comparator: () => false,
                object: { a: 1 },
                specification: { a: 1 },
            }),
        ).toBe(false);
    });

    it("throws TypeError when comparator is not a function", () => {
        expect(() =>
            isMatchWith({
                comparator: null as unknown as IsMatchWithParams["comparator"],
                object: {},
                specification: {},
            }),
        ).toThrow(TypeError);
        expect(() => isMatchWith(null as unknown as IsMatchWithParams)).toThrow(
            TypeError,
        );
    });
});
