import { afterEach, describe, expect, it } from "vitest";
import { splitObject } from "./split-object.js";

function sparseTriple(): number[] {
    const values: number[] = [];
    values[0] = 1;
    values[2] = 3;
    return values;
}

afterEach(() => {
    delete (Object.prototype as { polluted?: unknown }).polluted;
});

describe("splitObject", () => {
    it("visits each enumerable string key once", () => {
        const nested = { city: "London" };
        const object = { id: 1, name: "Ada", nested };
        const result = splitObject({ object, keys: ["id", "missing", 0] });

        expect(result?.picked).toEqual({ id: 1 });
        expect(result?.omitted).toEqual({ name: "Ada", nested });
        expect(result?.omitted.nested).toBe(nested);
        expect(result?.picked).not.toBe(object);
        expect(result?.omitted).not.toBe(object);
        expect(object).toEqual({ id: 1, name: "Ada", nested });
    });

    it("matches a number key and puts every other key on the omitted side", () => {
        const result = splitObject({
            object: { 1: "one", name: "Ada" },
            keys: [1],
        });

        expect(result?.picked).toEqual({ 1: "one" });
        expect(result?.omitted).toEqual({ name: "Ada" });
    });

    it("returns two new objects when the key list is empty", () => {
        const nested = { n: 1 };
        const object = { nested };
        const result = splitObject({ object, keys: [] });

        expect(result?.picked).toEqual({});
        expect(result?.omitted).toEqual({ nested });
        expect(result?.omitted.nested).toBe(nested);
        expect(result?.omitted).not.toBe(object);
    });

    it("keeps a null prototype on both sides", () => {
        const object = Object.create(null) as Record<string, unknown>;
        object.a = 1;
        object.b = 2;
        const result = splitObject({ object, keys: ["a"] });

        expect(Object.getPrototypeOf(result?.picked)).toBeNull();
        expect(Object.getPrototypeOf(result?.omitted)).toBeNull();
    });

    it("shares a sparse array", () => {
        const sparse = sparseTriple();
        const result = splitObject({
            object: { sparse, name: "Ada" },
            keys: ["name"],
        });

        expect(result?.omitted.sparse).toBe(sparse);
        expect(Object.hasOwn(sparse, 1)).toBe(false);
    });

    it("returns undefined for arrays, primitives, and null", () => {
        expect(
            splitObject({ object: sparseTriple(), keys: [0] }),
        ).toBeUndefined();
        expect(splitObject({ object: null, keys: ["a"] })).toBeUndefined();
        expect(splitObject({ object: 1, keys: [] })).toBeUndefined();
        expect(
            splitObject({
                object: { a: 1 },
                keys: "a" as unknown as readonly string[],
            }),
        ).toBeUndefined();
    });

    it("does not throw for invalid input", () => {
        expect(() =>
            splitObject({ object: undefined, keys: ["a"] }),
        ).not.toThrow();
    });

    it("places an own __proto__ key without polluting Object.prototype", () => {
        const payload = JSON.parse(
            '{"__proto__": {"polluted": true}, "ok": 1}',
        ) as Record<string, unknown>;
        const picked = splitObject({ object: payload, keys: ["__proto__"] });
        const omitted = splitObject({ object: payload, keys: ["ok"] });

        expect(
            Object.getOwnPropertyDescriptor(picked?.picked ?? {}, "__proto__")
                ?.value,
        ).toEqual({ polluted: true });
        expect(
            Object.getOwnPropertyDescriptor(omitted?.omitted ?? {}, "__proto__")
                ?.value,
        ).toEqual({ polluted: true });
        expect(({} as { polluted?: unknown }).polluted).toBeUndefined();
    });
});
