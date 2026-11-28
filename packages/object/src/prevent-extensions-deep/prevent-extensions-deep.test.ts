import { describe, expect, it } from "vitest";
import { preventExtensionsDeep } from "./prevent-extensions-deep.js";
import type { PreventExtensionsDeepParams } from "./prevent-extensions-deep.types.js";

describe("preventExtensionsDeep", () => {
    it("prevents extensions and leaves properties configurable", () => {
        const value = { a: { b: 1 } };
        const locked = preventExtensionsDeep(value);

        expect(locked).toBe(value);
        expect(Object.isExtensible(value)).toBe(false);
        expect(Object.isExtensible(value.a)).toBe(false);
        expect(Object.isSealed(value)).toBe(false);
        value.a.b = 2;
        expect(value.a.b).toBe(2);
    });

    it("includes set contents and returns primitives as-is", () => {
        const entry = { n: 1 };
        const set = new Set([entry]);

        expect(preventExtensionsDeep(null)).toBeNull();
        expect(preventExtensionsDeep(set)).toBe(set);
        expect(Object.isExtensible(set)).toBe(false);
        expect(Object.isExtensible(entry)).toBe(false);
    });

    it("locks the inner value when circular is present", () => {
        const inner = { a: 1 };
        const options = { circular: "preserve" as const, value: inner };

        expect(preventExtensionsDeep(options)).toBe(inner);
        expect(Object.isExtensible(inner)).toBe(false);
        expect(Object.isExtensible(options)).toBe(true);
    });

    it("throws on a cycle when circular is throw", () => {
        const box: { self?: object } = {};
        box.self = box;

        expect(() =>
            preventExtensionsDeep({ circular: "throw", value: box }),
        ).toThrow(RangeError);
        expect(Object.isExtensible(box)).toBe(true);
    });

    it("throws RangeError for an unknown circular value", () => {
        const inner = { a: 1 };

        expect(() =>
            preventExtensionsDeep({
                circular: "nope",
                value: inner,
            } as unknown as PreventExtensionsDeepParams),
        ).toThrow(RangeError);
        expect(Object.isExtensible(inner)).toBe(true);
    });
});
