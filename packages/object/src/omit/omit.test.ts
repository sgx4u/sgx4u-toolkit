import { afterEach, describe, expect, it } from "vitest";
import { omit } from "./omit.js";

function sparseTriple(): number[] {
    const values: number[] = [];
    values[0] = 1;
    values[2] = 3;
    return values;
}

afterEach(() => {
    delete (Object.prototype as { polluted?: unknown }).polluted;
});

describe("omit", () => {
    it("returns a new object without the named keys", () => {
        const nested = { city: "London" };
        const object = { id: 1, name: "Ada", nested };
        const result = omit({ object, keys: ["name", "missing"] });

        expect(result).toEqual({ id: 1, nested });
        expect(result).not.toBe(object);
        expect(result?.nested).toBe(nested);
        expect(object).toEqual({ id: 1, name: "Ada", nested });
    });

    it("returns the same object when no enumerable string key is removed", () => {
        const object = { id: 1 };
        expect(omit({ object, keys: ["missing"] })).toBe(object);
        expect(omit({ object, keys: [] })).toBe(object);
    });

    it("matches a number key to its string property", () => {
        expect(omit({ object: { 1: "one", name: "Ada" }, keys: [1] })).toEqual({
            name: "Ada",
        });
    });

    it("keeps a null prototype on the copy and on an unchanged object", () => {
        const object = Object.create(null) as Record<string, unknown>;
        object.a = 1;
        object.b = 2;

        expect(omit({ object, keys: ["missing"] })).toBe(object);
        const result = omit({ object, keys: ["a"] });
        expect(result).toEqual({ b: 2 });
        expect(Object.getPrototypeOf(result)).toBeNull();
    });

    it("shares a sparse array value", () => {
        const sparse = sparseTriple();
        const object = { sparse, name: "Ada" };
        const result = omit({ object, keys: ["name"] });

        expect(result?.sparse).toBe(sparse);
        expect(Object.hasOwn(sparse, 1)).toBe(false);
    });

    it("returns undefined for arrays, primitives, and null", () => {
        expect(omit({ object: sparseTriple(), keys: [0] })).toBeUndefined();
        expect(omit({ object: null, keys: ["a"] })).toBeUndefined();
        expect(omit({ object: "ada", keys: [] })).toBeUndefined();
        expect(omit({ object: new Date(), keys: [] })).toBeUndefined();
        expect(
            omit({
                object: { a: 1 },
                keys: "a" as unknown as readonly string[],
            }),
        ).toBeUndefined();
    });

    it("does not throw for invalid input", () => {
        expect(() => omit({ object: undefined, keys: ["a"] })).not.toThrow();
    });

    it("keeps an own __proto__ value without polluting Object.prototype", () => {
        const payload = JSON.parse(
            '{"__proto__": {"polluted": true}, "ok": 1}',
        ) as Record<string, unknown>;
        const result = omit({ object: payload, keys: ["ok"] });

        expect(
            Object.getOwnPropertyDescriptor(result ?? {}, "__proto__")?.value,
        ).toEqual({ polluted: true });
        expect(Object.getPrototypeOf(result)).toBe(Object.prototype);
        expect(({} as { polluted?: unknown }).polluted).toBeUndefined();
        expect(omit({ object: payload, keys: ["__proto__"] })).toEqual({
            ok: 1,
        });
        expect(({} as { polluted?: unknown }).polluted).toBeUndefined();
    });
});
