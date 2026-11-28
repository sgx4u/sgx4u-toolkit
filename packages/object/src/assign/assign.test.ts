import { afterEach, describe, expect, it } from "vitest";
import { assign } from "./assign.js";
import type { AssignParams } from "./assign.types.js";

afterEach(() => {
    Reflect.deleteProperty(Object.prototype, "polluted");
});

describe("assign", () => {
    it("lets later objects overwrite earlier keys", () => {
        expect(
            assign({ objects: [{ a: 1, b: 1 }, { a: 2 }, { c: 3 }] }),
        ).toEqual({
            a: 2,
            b: 1,
            c: 3,
        });
    });

    it("returns an empty object for an empty list or only primitives", () => {
        expect(assign({ objects: [] })).toEqual({});
        expect(assign({ objects: [1, "a", true, null, undefined] })).toEqual(
            {},
        );
    });

    it("copies array indexes and other enumerable string keys", () => {
        expect(
            assign({ objects: [["a", "b"], { 0: "z", extra: true }] }),
        ).toEqual({
            0: "z",
            1: "b",
            extra: true,
        });
    });

    it("returns undefined when objects is not an array", () => {
        expect(
            assign({ objects: { a: 1 } as unknown as readonly unknown[] }),
        ).toBeUndefined();
        expect(assign(null as unknown as AssignParams)).toBeUndefined();
    });

    it("does not mutate inputs and shares nested values", () => {
        const nested = { b: 1 };
        const first = { a: nested };
        const second = { c: 2 };
        const result = assign({ objects: [first, second] });

        expect(result).toEqual({ a: nested, c: 2 });
        expect(result?.a).toBe(nested);
        expect(first).toEqual({ a: nested });
        expect(second).toEqual({ c: 2 });
    });

    it("skips dangerous keys and leaves Object.prototype clean", () => {
        const payload = jsonObject('{"__proto__":{"polluted":true},"a":1}');
        const result = assign({
            objects: [payload, { constructor: { polluted: true }, b: 2 }],
        });

        expect(result).toEqual({ a: 1, b: 2 });
        expect(result?.polluted).toBeFalsy();
        expectCleanPrototype();
    });

    it("ignores symbol keys", () => {
        const id = Symbol("id");
        const result = assign({ objects: [{ [id]: 1, a: 2 }] });

        expect(result).toEqual({ a: 2 });
        expect(Object.getOwnPropertySymbols(result ?? {})).toEqual([]);
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
