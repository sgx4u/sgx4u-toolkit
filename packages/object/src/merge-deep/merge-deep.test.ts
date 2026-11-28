import {
    array,
    assert,
    dictionary,
    integer,
    property,
    stringMatching,
} from "fast-check";
import { afterEach, describe, expect, it } from "vitest";
import { mergeDeep } from "./merge-deep.js";
import type { MergeDeepParams } from "./merge-deep.types.js";

afterEach(() => {
    Reflect.deleteProperty(Object.prototype, "polluted");
});

describe("mergeDeep", () => {
    it("merges plain objects from left to right", () => {
        expect(
            mergeDeep({
                objects: [
                    { a: 1, nested: { b: 1 } },
                    { nested: { c: 2 } },
                    { a: 3 },
                ],
            }),
        ).toEqual({ a: 3, nested: { b: 1, c: 2 } });
    });

    it("returns an empty object for an empty list or only primitives", () => {
        expect(mergeDeep({ objects: [] })).toEqual({});
        expect(mergeDeep({ objects: [1, "a", null] })).toEqual({});
    });

    it("returns undefined when objects is not an array", () => {
        expect(
            mergeDeep({ objects: {} as unknown as readonly unknown[] }),
        ).toBeUndefined();
        expect(mergeDeep(null as unknown as MergeDeepParams)).toBeUndefined();
    });

    it("does not mutate inputs", () => {
        const left = { a: 1, nested: { b: 2 } };
        const right = { a: 3, nested: { c: 4 }, list: [1] };
        const beforeLeft = structuredClone(left);
        const beforeRight = structuredClone(right);

        expect(mergeDeep({ objects: [left, right] })).toEqual({
            a: 3,
            list: [1],
            nested: { b: 2, c: 4 },
        });
        expect(left).toEqual(beforeLeft);
        expect(right).toEqual(beforeRight);
    });

    it("passes arrayMerge through to the merge", () => {
        expect(
            mergeDeep({ objects: [[1], [2]], arrayMerge: "concat" }),
        ).toEqual([1, 2]);
        expect(
            mergeDeep({
                arrayMerge: "index",
                objects: [[{ a: 1, b: 1 }], [{ a: 2, c: 3 }, 4]],
            }),
        ).toEqual([{ a: 2, b: 1, c: 3 }, 4]);
        expect(mergeDeep({ objects: [[1, 2], [3]] })).toEqual([3]);
    });

    it("uses a customizer value and falls back when it returns undefined", () => {
        expect(
            mergeDeep({
                customizer: ({ key, sourceValue, targetValue }) => {
                    if (
                        key === "a" &&
                        typeof targetValue === "number" &&
                        typeof sourceValue === "number"
                    ) {
                        return targetValue + sourceValue;
                    }
                    return undefined;
                },
                objects: [
                    { a: 1, b: { c: 1 } },
                    { a: 2, b: { d: 2 } },
                ],
            }),
        ).toEqual({ a: 3, b: { c: 1, d: 2 } });
    });

    it("keeps a numeric customizer result of zero", () => {
        expect(
            mergeDeep({
                customizer: () => 0,
                objects: [{ a: 1 }, { a: 2 }],
            }),
        ).toEqual({ a: 0 });
    });

    it("throws TypeError when customizer is not a function", () => {
        expect(() =>
            mergeDeep({
                customizer: null,
                objects: [{}],
            } as unknown as MergeDeepParams),
        ).toThrow(TypeError);
    });

    it("throws RangeError for an unknown policy", () => {
        expect(() =>
            mergeDeep({
                arrayMerge: "nope",
                objects: [{}],
            } as unknown as MergeDeepParams),
        ).toThrow(RangeError);
        expect(() =>
            mergeDeep({
                objects: [{}],
                prototypeKeys: "nope",
            } as unknown as MergeDeepParams),
        ).toThrow(RangeError);
        expect(() =>
            mergeDeep({
                circular: "nope",
                objects: [{}],
            } as unknown as MergeDeepParams),
        ).toThrow(RangeError);
    });

    it("throws when circular is throw and the source cycles", () => {
        const box: { self?: object } = {};
        box.self = box;

        expect(() =>
            mergeDeep({ circular: "throw", objects: [{}, box] }),
        ).toThrow(RangeError);
        expect(box.self).toBe(box);
    });

    it("skips a JSON __proto__ payload", () => {
        const payload = jsonObject('{"__proto__":{"polluted":true},"a":1}');
        const merged = mergeDeep({ objects: [{}, payload] }) as {
            a?: number;
            polluted?: boolean;
        };

        expect(merged).toEqual({ a: 1 });
        expect(merged.polluted).toBeFalsy();
        expect(Object.getPrototypeOf(merged)).toBe(Object.prototype);
        expectCleanPrototype();
    });

    it("keeps a dangerous key as an own property when asked", () => {
        const payload = jsonObject('{"__proto__":{"polluted":true}}');
        const merged = mergeDeep({
            objects: [{}, payload],
            prototypeKeys: "keep",
        }) as { polluted?: boolean };

        expect(Object.hasOwn(merged, "__proto__")).toBe(true);
        expect(merged.polluted).toBeFalsy();
        expectCleanPrototype();
    });

    it("does not mutate generated plain objects", () => {
        const key = stringMatching(/^[a-z][a-z0-9]{0,7}$/);
        const plain = dictionary(key, integer({ min: -5, max: 5 }), {
            maxKeys: 4,
            noNullPrototype: true,
        });

        assert(
            property(array(plain, { maxLength: 4 }), (objects) => {
                const before = objects.map((item) => ({ ...item }));
                mergeDeep({ objects });
                expect(objects).toEqual(before);
            }),
        );
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
