import { describe, expect, it } from "vitest";
import { transformObject } from "./transform-object.js";
import type { TransformObjectParams } from "./transform-object.types.js";

describe("transformObject", () => {
    it("reduces own enumerable string keys in insertion order", () => {
        const keys: string[] = [];
        const total = transformObject({
            initial: 0,
            object: { b: 2, a: 1 },
            transformer: (sum, value, key, object) => {
                keys.push(key);
                expect(object).toEqual({ b: 2, a: 1 });
                return sum + Number(value);
            },
        });
        expect(total).toBe(3);
        expect(keys).toEqual(["b", "a"]);
    });

    it("returns the initial accumulator for an empty object", () => {
        expect(
            transformObject({
                initial: "start",
                object: {},
                transformer: () => "next",
            }),
        ).toBe("start");
    });

    it("lets the caller keep the accumulator", () => {
        const initial = { total: 0 };
        const result = transformObject({
            initial,
            object: { a: 1, b: 2 },
            transformer: (accumulator, value) => {
                accumulator.total += Number(value);
                return accumulator;
            },
        });
        expect(result).toBe(initial);
        expect(initial.total).toBe(3);
    });

    it("returns undefined when the value is not a plain object", () => {
        const transformer = (accumulator: number): number => accumulator;
        expect(
            transformObject({ initial: 0, object: [], transformer }),
        ).toBeUndefined();
        expect(
            transformObject({ initial: 0, object: null, transformer }),
        ).toBeUndefined();
    });

    it("throws when transformer is not a function", () => {
        const params = {
            initial: 0,
            object: {},
            transformer: "no",
        } as unknown as TransformObjectParams<number>;
        expect(() => transformObject(params)).toThrow(TypeError);
    });
});
