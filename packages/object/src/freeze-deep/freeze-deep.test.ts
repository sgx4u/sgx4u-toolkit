import { describe, expect, it } from "vitest";
import { freezeDeep } from "./freeze-deep.js";
import type { FreezeDeepParams } from "./freeze-deep.types.js";

describe("freezeDeep", () => {
    it("returns primitives and functions as-is", () => {
        const fn = (): number => 1;

        expect(freezeDeep(1)).toBe(1);
        expect(freezeDeep(null)).toBeNull();
        expect(freezeDeep(fn)).toBe(fn);
    });

    it("freezes nested objects, arrays, maps, and sets in place", () => {
        const key = { id: 1 };
        const entry = { n: 2 };
        const map = new Map([[key, entry]]);
        const setEntry = { n: 3 };
        const value = {
            list: [{ c: 2 }],
            map,
            nested: { b: 1 },
            set: new Set([setEntry]),
        };
        const frozen = freezeDeep(value);

        expect(frozen).toBe(value);
        expect(Object.isFrozen(value)).toBe(true);
        expect(Object.isFrozen(value.nested)).toBe(true);
        expect(Object.isFrozen(value.list)).toBe(true);
        expect(Object.isFrozen(value.list[0])).toBe(true);
        expect(Object.isFrozen(map)).toBe(true);
        expect(Object.isFrozen(key)).toBe(true);
        expect(Object.isFrozen(entry)).toBe(true);
        expect(Object.isFrozen(setEntry)).toBe(true);
    });

    it("freezes a cycle once", () => {
        const box: { self?: object } = {};
        box.self = box;

        expect(freezeDeep(box)).toBe(box);
        expect(Object.isFrozen(box)).toBe(true);
    });

    it("freezes a shared object once when circular is throw", () => {
        const shared = { a: 1 };
        const root = { left: shared, right: shared };

        expect(freezeDeep({ circular: "throw", value: root })).toBe(root);
        expect(Object.isFrozen(shared)).toBe(true);
    });

    it("throws on a cycle when circular is throw and leaves the value unfrozen", () => {
        const box: { self?: object } = {};
        box.self = box;

        expect(() => freezeDeep({ circular: "throw", value: box })).toThrow(
            RangeError,
        );
        expect(Object.isFrozen(box)).toBe(false);
    });

    it("accepts skip and replace by freezing the cycle once", () => {
        const skipped: { self?: object } = {};
        const replaced: { self?: object } = {};
        skipped.self = skipped;
        replaced.self = replaced;

        expect(freezeDeep({ circular: "skip", value: skipped })).toBe(skipped);
        expect(freezeDeep({ circular: "replace", value: replaced })).toBe(
            replaced,
        );
        expect(Object.isFrozen(skipped)).toBe(true);
        expect(Object.isFrozen(replaced)).toBe(true);
    });

    it("treats an object that only owns value as data", () => {
        const data = { value: { a: 1 } };

        expect(freezeDeep(data)).toBe(data);
        expect(Object.isFrozen(data)).toBe(true);
        expect(Object.isFrozen(data.value)).toBe(true);
    });

    it("freezes the inner value when circular is present", () => {
        const inner = { a: 1 };
        const options = { circular: "preserve" as const, value: inner };

        expect(freezeDeep(options)).toBe(inner);
        expect(Object.isFrozen(inner)).toBe(true);
        expect(Object.isFrozen(options)).toBe(false);
    });

    it("throws RangeError for an unknown circular value", () => {
        const inner = { a: 1 };

        expect(() =>
            freezeDeep({
                circular: "nope",
                value: inner,
            } as unknown as FreezeDeepParams),
        ).toThrow(RangeError);
        expect(Object.isFrozen(inner)).toBe(false);
    });
});
