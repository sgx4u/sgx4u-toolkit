import { afterEach, describe, expect, it } from "vitest";
import { defaults } from "./defaults.js";
import type { DefaultsParams } from "./defaults.types.js";

afterEach(() => {
    Reflect.deleteProperty(Object.prototype, "polluted");
});

describe("defaults", () => {
    it("keeps null, zero, and empty string, and fills undefined", () => {
        expect(
            defaults({
                defaults: { a: 1, b: 2, c: 3, d: 4, e: 5 },
                object: { a: undefined, b: null, c: 0, d: "" },
            }),
        ).toEqual({ a: 1, b: null, c: 0, d: "", e: 5 });
    });

    it("fills from later defaults only where a gap remains", () => {
        expect(
            defaults({
                defaults: [
                    { a: 1, e: 5 },
                    { e: 6, f: 7 },
                ],
                object: { a: undefined },
            }),
        ).toEqual({ a: 1, e: 5, f: 7 });
    });

    it("keeps a present nested object by reference", () => {
        const nested = { b: 1 };
        const result = defaults({
            defaults: { a: { c: 2 }, d: 3 },
            object: { a: nested },
        });

        expect(result).toEqual({ a: { b: 1 }, d: 3 });
        expect(result?.a).toBe(nested);
    });

    it("keeps an explicit undefined key when nothing fills it", () => {
        const result = defaults({ defaults: {}, object: { a: undefined } });

        expect(result).toEqual({ a: undefined });
        expect(Object.hasOwn(result ?? {}, "a")).toBe(true);
    });

    it("returns undefined for a non-object source or a bad defaults value", () => {
        expect(defaults({ defaults: { a: 1 }, object: null })).toBeUndefined();
        expect(defaults({ defaults: { a: 1 }, object: 1 })).toBeUndefined();
        expect(defaults({ defaults: null, object: {} })).toBeUndefined();
        expect(defaults({ defaults: "no", object: {} })).toBeUndefined();
        expect(defaults(null as unknown as DefaultsParams)).toBeUndefined();
    });

    it("skips non-objects inside a defaults list", () => {
        expect(
            defaults({
                defaults: [1, { b: 2 }, null],
                object: { a: 1 },
            }),
        ).toEqual({ a: 1, b: 2 });
    });

    it("does not mutate inputs", () => {
        const object = { a: undefined, b: 1 };
        const source = { a: 2, c: 3 };

        defaults({ defaults: source, object });
        expect(object).toEqual({ a: undefined, b: 1 });
        expect(source).toEqual({ a: 2, c: 3 });
    });

    it("skips a JSON __proto__ payload", () => {
        const payload = jsonObject('{"__proto__":{"polluted":true},"a":1}');
        const result = defaults({ defaults: payload, object: {} }) as {
            a?: number;
            polluted?: boolean;
        };

        expect(result).toEqual({ a: 1 });
        expect(result.polluted).toBeFalsy();
        expectCleanPrototype();
    });

    it("skips dangerous keys already on the source", () => {
        const object = { a: 1 };
        Object.defineProperty(object, "__proto__", {
            configurable: true,
            enumerable: true,
            value: { polluted: true },
            writable: true,
        });
        const result = defaults({ defaults: { b: 2 }, object });

        expect(result).toEqual({ a: 1, b: 2 });
        expect(Object.hasOwn(result ?? {}, "__proto__")).toBe(false);
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
