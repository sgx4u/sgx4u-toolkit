import { describe, expect, it } from "vitest";
import { findKey } from "./find-key.js";
import type { FindKeyParams } from "./find-key.types.js";

describe("findKey", () => {
    it("returns the first matching key in insertion order", () => {
        expect(
            findKey({
                object: { b: 1, a: 1, c: 2 },
                predicate: (value) => value === 1,
            }),
        ).toBe("b");
    });

    it("passes the value, key, and object", () => {
        const object = { id: 1 };
        findKey({
            object,
            predicate: (value, key, received) => {
                expect(value).toBe(1);
                expect(key).toBe("id");
                expect(received).toBe(object);
                return true;
            },
        });
    });

    it("returns undefined when nothing matches", () => {
        expect(
            findKey({
                object: { id: 1 },
                predicate: () => false,
            }),
        ).toBeUndefined();
    });

    it("returns undefined for a value that is not a plain object", () => {
        const predicate = (): boolean => true;
        expect(findKey({ object: [1], predicate })).toBeUndefined();
        expect(findKey({ object: null, predicate })).toBeUndefined();
        expect(findKey({ object: new Date(0), predicate })).toBeUndefined();
    });

    it("reads an own dangerous key", () => {
        const object = Object.create(null) as Record<string, unknown>;
        Object.defineProperty(object, "__proto__", {
            configurable: true,
            enumerable: true,
            value: { admin: true },
            writable: true,
        });
        expect(
            findKey({
                object,
                predicate: (value) =>
                    typeof value === "object" &&
                    value !== null &&
                    Object.hasOwn(value, "admin"),
            }),
        ).toBe("__proto__");
    });

    it("throws when predicate is not a function", () => {
        const params = {
            object: {},
            predicate: "no",
        } as unknown as FindKeyParams;
        expect(() => findKey(params)).toThrow(TypeError);
    });
});
