import { afterEach, describe, expect, it } from "vitest";
import { pick } from "./pick.js";

function sparseTriple(): number[] {
    const values: number[] = [];
    values[0] = 1;
    values[2] = 3;
    return values;
}

afterEach(() => {
    delete (Object.prototype as { polluted?: unknown }).polluted;
});

describe("pick", () => {
    it("copies named own keys in the requested order", () => {
        const nested = { city: "London" };
        const object = { id: 1, name: "Ada", nested };
        const result = pick({ object, keys: ["nested", "id", "missing"] });

        expect(result).toEqual({ nested, id: 1 });
        expect(Object.keys(result ?? {})).toEqual(["nested", "id"]);
        expect(result?.nested).toBe(nested);
        expect(object).toEqual({ id: 1, name: "Ada", nested });
    });

    it("writes a repeated key once", () => {
        const result = pick({ object: { a: 1, b: 2 }, keys: ["b", "a", "b"] });

        expect(Object.keys(result ?? {})).toEqual(["b", "a"]);
    });

    it("matches a number key to its string property", () => {
        expect(pick({ object: { 1: "one" }, keys: [1] })).toEqual({
            1: "one",
        });
    });

    it("copies a named symbol key", () => {
        const symbol = Symbol("id");
        const object = { [symbol]: 1, name: "Ada" };
        const result = pick({ object, keys: [symbol] });

        expect(Object.getOwnPropertySymbols(result ?? {})).toEqual([symbol]);
        expect((result as Record<symbol, unknown>)[symbol]).toBe(1);
    });

    it("copies a non-enumerable key as an enumerable property", () => {
        const object = {};
        Object.defineProperty(object, "hidden", {
            value: 1,
            enumerable: false,
        });
        const result = pick({ object, keys: ["hidden"] });

        expect(result).toEqual({ hidden: 1 });
        expect(
            Object.getOwnPropertyDescriptor(result ?? {}, "hidden")?.enumerable,
        ).toBe(true);
    });

    it("keeps a null prototype", () => {
        const object = Object.create(null) as Record<string, unknown>;
        object.a = 1;
        object.b = 2;
        const result = pick({ object, keys: ["b", "missing"] });

        expect(result).toEqual({ b: 2 });
        expect(Object.getPrototypeOf(result)).toBeNull();
    });

    it("shares a sparse array value and does not fill its hole", () => {
        const sparse = sparseTriple();
        const result = pick({ object: { sparse }, keys: ["sparse"] });

        expect(result?.sparse).toBe(sparse);
        expect(Object.hasOwn(sparse, 1)).toBe(false);
    });

    it("returns undefined for arrays, primitives, and null", () => {
        expect(pick({ object: sparseTriple(), keys: [0, 2] })).toBeUndefined();
        expect(pick({ object: null, keys: ["a"] })).toBeUndefined();
        expect(pick({ object: undefined, keys: ["a"] })).toBeUndefined();
        expect(pick({ object: "ada", keys: [0] })).toBeUndefined();
        expect(pick({ object: 1, keys: ["a"] })).toBeUndefined();
        expect(pick({ object: new Date(), keys: [] })).toBeUndefined();
        expect(
            pick({
                object: { a: 1 },
                keys: "a" as unknown as readonly string[],
            }),
        ).toBeUndefined();
    });

    it("does not throw for invalid input", () => {
        expect(() => pick({ object: null, keys: ["a"] })).not.toThrow();
    });

    it("copies a JSON __proto__ payload without polluting Object.prototype", () => {
        const payload = JSON.parse(
            '{"__proto__": {"polluted": true}, "ok": 1}',
        ) as Record<string, unknown>;
        const result = pick({ object: payload, keys: ["__proto__", "ok"] });

        expect(
            Object.getOwnPropertyDescriptor(result ?? {}, "__proto__")?.value,
        ).toEqual({ polluted: true });
        expect(result?.ok).toBe(1);
        expect(Object.getPrototypeOf(result)).toBe(Object.prototype);
        expect(({} as { polluted?: unknown }).polluted).toBeUndefined();
        expect(payload.ok).toBe(1);
    });
});
