import { describe, expect, it } from "vitest";
import { zipToObject } from "./zip-to-object.js";

function* generate(): Generator<number, void, unknown> {
    yield 1;
}

describe("zipToObject", () => {
    it("pairs keys with values", () => {
        expect(zipToObject({ keys: ["a", "b"], values: [1, 2] })).toEqual({
            a: 1,
            b: 2,
        });
    });

    it("stringifies keys, including symbols", () => {
        const key = Symbol("id");
        expect(
            zipToObject({ keys: [key, 1, true], values: ["s", "n", "b"] }),
        ).toEqual({
            [String(key)]: "s",
            1: "n",
            true: "b",
        });
    });

    it("uses a function for values", () => {
        expect(
            zipToObject({
                keys: ["a", "b"],
                values: (key, index) => `${String(key)}:${index}`,
            }),
        ).toEqual({ a: "a:0", b: "b:1" });
    });

    it("uses undefined for a missing value and lets a later key win", () => {
        expect(zipToObject({ keys: ["a", "b"], values: [1] })).toEqual({
            a: 1,
            b: undefined,
        });
        expect(
            zipToObject({ keys: ["a", "b", "a"], values: [1, 2, 3] }),
        ).toEqual({
            a: 3,
            b: 2,
        });
    });

    it("returns an empty record for empty keys", () => {
        expect(zipToObject({ keys: [], values: [1] })).toEqual({});
        expect(zipToObject({ keys: [], values: () => 1 })).toEqual({});
    });

    it("returns undefined for a non-object", () => {
        expect(zipToObject(null as never)).toBeUndefined();
        expect(zipToObject("text" as never)).toBeUndefined();
        expect(zipToObject(generate as never)).toBeUndefined();
    });

    it("throws when keys is not an array", () => {
        expect(() => zipToObject({} as never)).toThrow(TypeError);
        expect(() => zipToObject({ keys: "a", values: [1] } as never)).toThrow(
            '`keys` must be an array; received "a".',
        );
        expect(() => zipToObject({ values: [1] } as never)).toThrow(TypeError);
        expect(() => zipToObject(new Uint8Array() as never)).toThrow(TypeError);
        expect(() => zipToObject(new Set() as never)).toThrow(TypeError);
        expect(() => zipToObject(generate() as never)).toThrow(TypeError);
    });

    it("throws when values is neither an array nor a function", () => {
        expect(() =>
            zipToObject({ keys: ["a"], values: "no" as never }),
        ).toThrow('`values` must be an array or a function; received "no".');
        expect(() => zipToObject({ keys: ["a"] } as never)).toThrow(TypeError);
    });

    it("does not mutate the keys or values", () => {
        const keys = Object.freeze(["a"]);
        const values = Object.freeze([1]);
        const result = zipToObject({ keys, values });

        expect(result).toEqual({ a: 1 });
        expect(result).not.toBe(keys);
        expect(keys).toEqual(["a"]);
        expect(values).toEqual([1]);
    });

    it("treats a sparse hole as undefined", () => {
        // eslint-disable-next-line no-sparse-arrays -- hole under test
        const values = [1, , 3] as number[];
        expect(zipToObject({ keys: ["a", "b", "c"], values })).toEqual({
            a: 1,
            b: undefined,
            c: 3,
        });
        expect(1 in values).toBe(false);
    });
});
