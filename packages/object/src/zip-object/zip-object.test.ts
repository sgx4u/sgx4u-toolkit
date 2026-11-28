import { afterEach, describe, expect, it } from "vitest";
import { zipObject } from "./zip-object.js";
import type { ZipObjectParams } from "./zip-object.types.js";

afterEach(() => {
    Reflect.deleteProperty(Object.prototype, "polluted");
});

describe("zipObject", () => {
    it("pairs keys and values by index", () => {
        expect(zipObject({ keys: ["a", "b"], values: [1, 2] })).toEqual({
            a: 1,
            b: 2,
        });
    });

    it("sets extra keys to undefined and ignores extra values", () => {
        const extraKey = zipObject({ keys: ["a", "b"], values: [1] });
        const extraValue = zipObject({ keys: ["a"], values: [1, 2] });

        expect(extraKey).toEqual({ a: 1, b: undefined });
        expect(Object.hasOwn(extraKey ?? {}, "b")).toBe(true);
        expect(extraValue).toEqual({ a: 1 });
    });

    it("sets every key to undefined when values is not an array", () => {
        const result = zipObject({
            keys: ["a", "b"],
            values: "no" as unknown as readonly unknown[],
        });

        expect(result).toEqual({ a: undefined, b: undefined });
        expect(Object.hasOwn(result ?? {}, "a")).toBe(true);
        expect(zipObject({ keys: ["a"] })).toEqual({ a: undefined });
    });

    it("returns undefined when keys is not an array", () => {
        expect(
            zipObject({ keys: "ab" as unknown as readonly unknown[] }),
        ).toBeUndefined();
        expect(zipObject(null as unknown as ZipObjectParams)).toBeUndefined();
    });

    it("skips dangerous keys and non-property entries", () => {
        const result = zipObject({
            keys: ["__proto__", "a", {}],
            values: [{ polluted: true }, 1, 2],
        }) as { a?: number; polluted?: boolean };

        expect(result).toEqual({ a: 1 });
        expect(result.polluted).toBeFalsy();
        expectCleanPrototype();
    });

    it("keeps symbol keys and stores number keys as strings", () => {
        const id = Symbol("id");
        const result = zipObject({ keys: [id, 1], values: [true, "n"] });

        expect(result?.[id]).toBe(true);
        expect(result?.[1]).toBe("n");
    });

    it("treats a hole in values as undefined", () => {
        const values: unknown[] = [];
        values[0] = 1;
        values.length = 2;
        const result = zipObject({ keys: ["a", "b"], values });

        expect(result?.a).toBe(1);
        expect(result?.b).toBeUndefined();
        expect(Object.hasOwn(result ?? {}, "b")).toBe(true);
    });
});

/**
 * Asserts that prototype pollution did not land on `Object.prototype`.
 */
function expectCleanPrototype(): void {
    const carrier = {} as { polluted?: boolean };
    expect(carrier.polluted).toBeFalsy();
    expect(Object.hasOwn(Object.prototype, "polluted")).toBe(false);
}
