import { describe, expect, it } from "vitest";
import { isMatch } from "./is-match.js";
import type { IsMatchParams } from "./is-match.types.js";

/**
 * `[1, empty, 3]`. The hole is a missing index, not a stored `undefined`.
 *
 * @returns A sparse array of length 3.
 */
function arrayWithHole(): unknown[] {
    const value: unknown[] = [];
    value.length = 3;
    value[0] = 1;
    value[2] = 3;
    return value;
}

describe("isMatch", () => {
    it("allows extra keys and recurses through plain objects", () => {
        expect(
            isMatch({ object: { a: 1, b: 2 }, specification: { b: 2 } }),
        ).toBe(true);
        expect(isMatch({ object: { a: 1 }, specification: { b: 2 } })).toBe(
            false,
        );
        expect(
            isMatch({
                object: { a: { b: 1, c: 2 } },
                specification: { a: { b: 1 } },
            }),
        ).toBe(true);
    });

    it("matches arrays by index and allows a longer object", () => {
        expect(isMatch({ object: [1, 2, 3], specification: [1, 2] })).toBe(
            true,
        );
        expect(isMatch({ object: [1], specification: [1, 2] })).toBe(false);
        expect(
            isMatch({
                object: [{ a: 1, b: 2 }, 3],
                specification: [{ a: 1 }],
            }),
        ).toBe(true);
        expect(isMatch({ object: { 0: 1 }, specification: [1] })).toBe(false);
    });

    it("skips holes in the specification array", () => {
        const specification = arrayWithHole();

        expect(isMatch({ object: [1, 9, 3, 4], specification })).toBe(true);
        expect(isMatch({ object: [1, 9, 4], specification })).toBe(false);
    });

    it("matches null only to null and uses deep equality otherwise", () => {
        expect(isMatch({ object: null, specification: null })).toBe(true);
        expect(isMatch({ object: {}, specification: null })).toBe(false);
        expect(isMatch({ object: undefined, specification: null })).toBe(false);
        expect(isMatch({ object: 1, specification: 1 })).toBe(true);
        expect(isMatch({ object: 1, specification: 2 })).toBe(false);
        expect(isMatch({ object: Number.NaN, specification: Number.NaN })).toBe(
            true,
        );
        expect(
            isMatch({
                object: new Date(Number.NaN),
                specification: new Date(Number.NaN),
            }),
        ).toBe(true);
    });

    it("treats an empty plain specification as a match", () => {
        expect(isMatch({ object: { a: 1 }, specification: {} })).toBe(true);
        expect(isMatch({ object: null, specification: {} })).toBe(true);
        expect(isMatch({ object: 1, specification: {} })).toBe(true);
    });

    it("ends a cyclic specification", () => {
        const specification: { a?: number; self?: object } = { a: 1 };
        const object: { a?: number; extra?: boolean; self?: object } = {
            a: 1,
            extra: true,
        };
        specification.self = specification;
        object.self = object;

        expect(isMatch({ object, specification })).toBe(true);
        expect(isMatch({ object: { ...object, a: 2 }, specification })).toBe(
            false,
        );
    });

    it("returns false for a non-object argument and does not throw", () => {
        expect(isMatch(null as unknown as IsMatchParams)).toBe(false);
    });
});
