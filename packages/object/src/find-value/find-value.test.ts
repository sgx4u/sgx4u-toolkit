import { describe, expect, it } from "vitest";
import { findValue } from "./find-value.js";
import type { FindValueParams } from "./find-value.types.js";

describe("findValue", () => {
    it("returns the first matching value", () => {
        expect(
            findValue({
                object: { user: { id: 1 } },
                predicate: (value) => value === 1,
            }),
        ).toBe(1);
    });

    it("returns the root when it matches", () => {
        const object = { id: 1 };
        expect(
            findValue({
                object,
                predicate: (value) => value === object,
            }),
        ).toBe(object);
    });

    it("stops when the match is undefined", () => {
        let calls = 0;
        const found = findValue({
            object: { a: undefined, b: 1 },
            predicate: (_value, path) => {
                calls += 1;
                return path.length === 1 && path[0] === "a";
            },
        });
        expect(found).toBeUndefined();
        expect(calls).toBe(2);
    });

    it("searches array elements", () => {
        expect(
            findValue({
                object: [1, 2, 3],
                predicate: (value) => value === 2,
            }),
        ).toBe(2);
    });

    it("returns undefined when nothing matches", () => {
        expect(
            findValue({
                object: { id: 1 },
                predicate: () => false,
            }),
        ).toBeUndefined();
    });

    it("throws when predicate is not a function", () => {
        const params = {
            object: {},
            predicate: false,
        } as unknown as FindValueParams;
        expect(() => findValue(params)).toThrow(TypeError);
    });
});
