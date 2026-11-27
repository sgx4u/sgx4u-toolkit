import {
    assert,
    dictionary,
    integer,
    oneof,
    property,
    stringMatching,
} from "fast-check";
import { afterEach, describe, expect, it } from "vitest";
import { isEqual } from "../is-equal/is-equal.js";
import { cloneDeep } from "./clone-deep.js";
import type { CloneDeepParams } from "./clone-deep.types.js";

afterEach(() => {
    Reflect.deleteProperty(Object.prototype, "polluted");
});

describe("cloneDeep", () => {
    it("copies nested values and keeps the source", () => {
        const source = { a: { b: 1 }, list: [1, { c: 2 }] };
        const cloned = cloneDeep(source) as typeof source;

        expect(cloned).toEqual(source);
        expect(cloned).not.toBe(source);
        expect(cloned.a).not.toBe(source.a);
        expect(cloned.list[1]).not.toBe(source.list[1]);
        expect(source).toEqual({ a: { b: 1 }, list: [1, { c: 2 }] });
    });

    it("preserves a cycle, deep-equal and not the same reference", () => {
        const box: { name: string; self?: object } = { name: "box" };
        box.self = box;
        const cloned = cloneDeep(box) as { name: string; self?: object };

        expect(cloned).not.toBe(box);
        expect(cloned.name).toBe("box");
        expect(cloned.self).toBe(cloned);
        expect(cloned.self).not.toBe(box);
        expect(isEqual({ first: cloned, second: box })).toBe(true);
    });

    it("reads an options object and clones a lookalike that has an extra key", () => {
        expect(cloneDeep({ value: { a: 1 } })).toEqual({ a: 1 });
        expect(cloneDeep({ circular: "preserve", value: 1 })).toBe(1);

        const shape = { circular: "preserve", extra: true, value: 1 };
        const cloned = cloneDeep(shape) as typeof shape;

        expect(cloned).toEqual(shape);
        expect(cloned).not.toBe(shape);
    });

    it("throws RangeError for an unknown policy or a rejected cycle", () => {
        const box: { self?: object } = {};
        box.self = box;

        expect(() =>
            cloneDeep({
                circular: "nope",
                value: {},
            } as unknown as CloneDeepParams),
        ).toThrow(RangeError);
        expect(() =>
            cloneDeep({
                prototypes: "nope",
                value: {},
            } as unknown as CloneDeepParams),
        ).toThrow(RangeError);
        expect(() => cloneDeep({ value: box, circular: "throw" })).toThrow(
            RangeError,
        );
    });

    it("strips a class prototype unless prototypes is keep", () => {
        const source = new Box(1);
        const stripped = cloneDeep(source) as { id?: number };
        const kept = cloneDeep({
            prototypes: "keep",
            value: source,
        });

        expect(stripped).toEqual({ id: 1 });
        expect(Object.getPrototypeOf(stripped)).toBe(Object.prototype);
        expect(Object.getPrototypeOf(kept)).toBe(Box.prototype);
        expect(kept).not.toBe(source);
    });

    it("drops a JSON __proto__ key", () => {
        const payload = jsonObject('{"__proto__":{"polluted":true},"a":1}');
        const cloned = cloneDeep(payload) as { a?: number; polluted?: boolean };

        expect(cloned).toEqual({ a: 1 });
        expect(Object.hasOwn(cloned, "__proto__")).toBe(false);
        expect(cloned.polluted).toBeFalsy();
        expectCleanPrototype();
    });

    it("returns a deep-equal plain object that is a new reference", () => {
        const key = stringMatching(/^[a-z][a-z0-9]{0,7}$/).filter(
            (candidate) => candidate !== "value" && candidate !== "circular",
        );
        const leaf = integer({ min: -20, max: 20 });
        const plain = dictionary(
            key,
            oneof(
                leaf,
                dictionary(key, leaf, { maxKeys: 2, noNullPrototype: true }),
            ),
            { maxKeys: 3, noNullPrototype: true },
        );

        assert(
            property(plain, (value) => {
                const cloned = cloneDeep(value);
                expect(cloned).toEqual(value);
                expect(cloned).not.toBe(value);
            }),
        );
    });
});

/**
 * A class instance used to show prototype policies.
 */
class Box {
    public id: number;

    public constructor(id: number) {
        this.id = id;
    }
}

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
