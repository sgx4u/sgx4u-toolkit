import { afterEach, describe, expect, it } from "vitest";
import { defaultsDeep } from "./defaults-deep.js";
import type { DefaultsDeepParams } from "./defaults-deep.types.js";

afterEach(() => {
    Reflect.deleteProperty(Object.prototype, "polluted");
});

describe("defaultsDeep", () => {
    it("fills nested gaps and keeps present values", () => {
        expect(
            defaultsDeep({
                defaults: { a: 9, b: { c: 3, e: 4 }, f: 5 },
                object: { a: 1, b: { c: undefined, d: 2 } },
            }),
        ).toEqual({ a: 1, b: { c: 3, d: 2, e: 4 }, f: 5 });
    });

    it("keeps null, zero, and empty string", () => {
        expect(
            defaultsDeep({
                defaults: { a: 1, b: 1, c: 1 },
                object: { a: null, b: 0, c: "" },
            }),
        ).toEqual({ a: null, b: 0, c: "" });
    });

    it("applies a list of defaults from left to right", () => {
        expect(
            defaultsDeep({
                defaults: [{ a: { b: 1 } }, { a: { c: 2 }, d: 3 }],
                object: {},
            }),
        ).toEqual({ a: { b: 1, c: 2 }, d: 3 });
    });

    it("keeps a present array when arrayMerge is replace", () => {
        const items = [1];
        const object = { items };
        const result = defaultsDeep({
            defaults: { items: [2, 3] },
            object,
        }) as { items: number[] };

        expect(result).toEqual({ items: [1] });
        expect(result).not.toBe(object);
        expect(result.items).toBe(items);
        expect(object.items).toEqual([1]);
    });

    it("concats and index-fills arrays when asked", () => {
        expect(
            defaultsDeep({
                arrayMerge: "concat",
                defaults: { items: [2, 3] },
                object: { items: [1] },
            }),
        ).toEqual({ items: [1, 2, 3] });
        expect(
            defaultsDeep({
                arrayMerge: "index",
                defaults: { items: [{ b: 2 }, { c: 3 }] },
                object: { items: [{ a: 1 }] },
            }),
        ).toEqual({ items: [{ a: 1, b: 2 }, { c: 3 }] });
    });

    it("returns undefined for invalid input", () => {
        expect(
            defaultsDeep({ defaults: { a: 1 }, object: null }),
        ).toBeUndefined();
        expect(defaultsDeep({ defaults: 1, object: {} })).toBeUndefined();
        expect(
            defaultsDeep(null as unknown as DefaultsDeepParams),
        ).toBeUndefined();
    });

    it("throws RangeError for an unknown arrayMerge", () => {
        expect(() =>
            defaultsDeep({
                arrayMerge: "nope",
                defaults: {},
                object: {},
            } as unknown as DefaultsDeepParams),
        ).toThrow(RangeError);
    });

    it("does not mutate inputs", () => {
        const object = { a: { b: 1 } };
        const source = { a: { c: 2 }, d: 3 };
        const beforeObject = structuredClone(object);
        const beforeSource = structuredClone(source);

        defaultsDeep({ defaults: source, object });
        expect(object).toEqual(beforeObject);
        expect(source).toEqual(beforeSource);
    });

    it("skips a JSON __proto__ payload", () => {
        const payload = jsonObject(
            '{"__proto__":{"polluted":true},"a":{"b":1}}',
        );
        const result = defaultsDeep({
            defaults: payload,
            object: {},
        }) as { a?: { b?: number }; polluted?: boolean };

        expect(result).toEqual({ a: { b: 1 } });
        expect(result.polluted).toBeFalsy();
        expectCleanPrototype();
    });
});

/**
 * Parses a JSON object without using the `any` return of `JSON.parse`.
 *
 * @param text - JSON text for one object.
 * @returns The parsed object.
 */
function jsonObject(text: string): object {
    const value: unknown = JSON.parse(text);
    if (typeof value !== "object" || value === null) {
        throw new Error("expected a JSON object");
    }
    return value;
}

/**
 * Asserts that prototype pollution did not land on `Object.prototype`.
 */
function expectCleanPrototype(): void {
    const carrier = {} as { polluted?: boolean };
    expect(carrier.polluted).toBeFalsy();
    expect(Object.hasOwn(Object.prototype, "polluted")).toBe(false);
}
