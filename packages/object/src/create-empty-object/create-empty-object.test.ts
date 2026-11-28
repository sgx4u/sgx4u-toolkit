import { describe, expect, it } from "vitest";
import { createEmptyObject } from "./create-empty-object.js";
import type { CreateEmptyObjectParams } from "./create-empty-object.types.js";

describe("createEmptyObject", () => {
    it("creates a null-prototype object when called with no argument", () => {
        const object = createEmptyObject();
        expect(Object.getPrototypeOf(object)).toBeNull();
        expect(Object.keys(object)).toEqual([]);
    });

    it("uses an explicit null prototype", () => {
        expect(
            Object.getPrototypeOf(createEmptyObject({ prototype: null })),
        ).toBe(null);
    });

    it("uses an object prototype", () => {
        const prototype = { kind: "base" };
        const object = createEmptyObject({ prototype });
        expect(Object.getPrototypeOf(object)).toBe(prototype);
        expect(Object.keys(object)).toEqual([]);
    });

    it("accepts a function prototype", () => {
        function Base(): void {}
        const object = createEmptyObject({ prototype: Base });
        expect(Object.getPrototypeOf(object)).toBe(Base);
    });

    it("throws when prototype is a primitive", () => {
        const params = {
            prototype: "no",
        } as unknown as CreateEmptyObjectParams;
        expect(() => createEmptyObject(params)).toThrow(TypeError);
        expect(() => createEmptyObject(params)).toThrow(/prototype/);
    });

    it("throws when the argument is not the options object", () => {
        const params = {
            prototype: null,
            extra: 1,
        } as unknown as CreateEmptyObjectParams;
        expect(() => createEmptyObject(params)).toThrow(TypeError);
        expect(() =>
            createEmptyObject(1 as unknown as CreateEmptyObjectParams),
        ).toThrow(TypeError);
    });
});
