import { describe, expect, it } from "vitest";
import { findLastKey } from "./find-last-key.js";
import type { FindLastKeyParams } from "./find-last-key.types.js";

describe("findLastKey", () => {
    it("returns the last matching key", () => {
        expect(
            findLastKey({
                object: { a: 1, b: 1, c: 2 },
                predicate: (value) => value === 1,
            }),
        ).toBe("b");
    });

    it("returns the only match", () => {
        expect(
            findLastKey({
                object: { a: 0, b: 1 },
                predicate: (value) => value === 1,
            }),
        ).toBe("b");
    });

    it("returns undefined when nothing matches or the value is not plain", () => {
        expect(
            findLastKey({
                object: { a: 1 },
                predicate: () => false,
            }),
        ).toBeUndefined();
        expect(
            findLastKey({
                object: null,
                predicate: () => true,
            }),
        ).toBeUndefined();
        expect(
            findLastKey({
                object: [],
                predicate: () => true,
            }),
        ).toBeUndefined();
    });

    it("throws when predicate is not a function", () => {
        const params = {
            object: {},
            predicate: null,
        } as unknown as FindLastKeyParams;
        expect(() => findLastKey(params)).toThrow(TypeError);
    });
});
