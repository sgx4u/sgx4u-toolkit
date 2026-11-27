import { afterEach, describe, expect, it } from "vitest";
import type { PickByParams } from "./pick-by.types.js";
import { pickBy } from "./pick-by.js";

function sparseTriple(): number[] {
    const values: number[] = [];
    values[0] = 1;
    values[2] = 3;
    return values;
}

afterEach(() => {
    delete (Object.prototype as { polluted?: unknown }).polluted;
});

describe("pickBy", () => {
    it("copies keys the predicate accepts and passes value, key, and object", () => {
        const object = { id: 1, name: "Ada" };
        const calls: Array<[unknown, string]> = [];
        const result = pickBy({
            object,
            predicate: (value, key, source) => {
                calls.push([value, key]);
                expect(source).toBe(object);
                return typeof value === "number";
            },
        });

        expect(result).toEqual({ id: 1 });
        expect(result).not.toBe(object);
        expect(calls).toEqual([
            [1, "id"],
            ["Ada", "name"],
        ]);
        expect(object).toEqual({ id: 1, name: "Ada" });
    });

    it("returns a new empty object when nothing matches", () => {
        const object = { name: "Ada" };
        const result = pickBy({
            object,
            predicate: () => false,
        });

        expect(result).toEqual({});
        expect(result).not.toBe(object);
    });

    it("keeps an explicit undefined value when the predicate accepts it", () => {
        const result = pickBy({
            object: { a: undefined, b: 1 },
            predicate: (value) => value === undefined,
        });

        expect(result).not.toBeUndefined();
        expect(Object.hasOwn(result ?? {}, "a")).toBe(true);
        expect(result?.a).toBeUndefined();
        expect(Object.hasOwn(result ?? {}, "b")).toBe(false);
    });

    it("shares a sparse array value", () => {
        const sparse = sparseTriple();
        const result = pickBy({
            object: { sparse, name: "Ada" },
            predicate: (_value, key) => key === "sparse",
        });

        expect(result?.sparse).toBe(sparse);
        expect(Object.hasOwn(sparse, 1)).toBe(false);
    });

    it("returns undefined for invalid objects and does not call the predicate", () => {
        let calls = 0;
        const predicate = (): boolean => {
            calls += 1;
            return true;
        };

        expect(pickBy({ object: sparseTriple(), predicate })).toBeUndefined();
        expect(pickBy({ object: null, predicate })).toBeUndefined();
        expect(pickBy({ object: "ada", predicate })).toBeUndefined();
        expect(calls).toBe(0);
    });

    it("throws TypeError when predicate is not a function", () => {
        expect(() =>
            pickBy({
                object: null,
                predicate: "no",
            } as unknown as PickByParams),
        ).toThrow('`predicate` must be a function; received "no".');
    });

    it("copies a JSON __proto__ key without polluting Object.prototype", () => {
        const payload = JSON.parse(
            '{"__proto__": {"polluted": true}, "ok": 1}',
        ) as Record<string, unknown>;
        const result = pickBy({
            object: payload,
            predicate: () => true,
        });

        expect(
            Object.getOwnPropertyDescriptor(result ?? {}, "__proto__")?.value,
        ).toEqual({ polluted: true });
        expect(({} as { polluted?: unknown }).polluted).toBeUndefined();
    });
});
