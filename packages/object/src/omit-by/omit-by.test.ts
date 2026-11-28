import { afterEach, describe, expect, it } from "vitest";
import type { OmitByParams } from "./omit-by.types.js";
import { omitBy } from "./omit-by.js";

function sparseTriple(): number[] {
    const values: number[] = [];
    values[0] = 1;
    values[2] = 3;
    return values;
}

afterEach(() => {
    delete (Object.prototype as { polluted?: unknown }).polluted;
});

describe("omitBy", () => {
    it("drops keys the predicate accepts", () => {
        const nested = { city: "London" };
        const object = { id: 1, name: "Ada", nested };
        const result = omitBy({
            object,
            predicate: (value) => typeof value === "string",
        });

        expect(result).toEqual({ id: 1, nested });
        expect(result?.nested).toBe(nested);
        expect(object.name).toBe("Ada");
    });

    it("returns the same object when every key is kept", () => {
        const object = { id: 1 };
        expect(omitBy({ object, predicate: () => false })).toBe(object);
    });

    it("shares a sparse array that is kept", () => {
        const sparse = sparseTriple();
        const object = { sparse, name: "Ada" };
        const result = omitBy({
            object,
            predicate: (_value, key) => key === "name",
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

        expect(omitBy({ object: sparseTriple(), predicate })).toBeUndefined();
        expect(omitBy({ object: null, predicate })).toBeUndefined();
        expect(calls).toBe(0);
    });

    it("throws TypeError when predicate is not a function", () => {
        expect(() =>
            omitBy({
                object: { a: 1 },
                predicate: undefined,
            } as unknown as OmitByParams),
        ).toThrow("`predicate` must be a function; received undefined.");
    });

    it("drops a safe key from a JSON payload without polluting Object.prototype", () => {
        const payload = JSON.parse(
            '{"__proto__": {"polluted": true}, "ok": 1}',
        ) as Record<string, unknown>;
        const result = omitBy({
            object: payload,
            predicate: (_value, key) => key === "ok",
        });

        expect(
            Object.getOwnPropertyDescriptor(result ?? {}, "__proto__")?.value,
        ).toEqual({ polluted: true });
        expect(({} as { polluted?: unknown }).polluted).toBeUndefined();
    });
});
