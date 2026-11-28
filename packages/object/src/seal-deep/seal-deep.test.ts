import { describe, expect, it } from "vitest";
import { sealDeep } from "./seal-deep.js";
import type { SealDeepParams } from "./seal-deep.types.js";

describe("sealDeep", () => {
    it("seals nested objects and leaves values writable", () => {
        const value = { a: { b: 1 }, list: [{ c: 2 }] };
        const sealed = sealDeep(value);

        expect(sealed).toBe(value);
        expect(Object.isSealed(value)).toBe(true);
        expect(Object.isSealed(value.a)).toBe(true);
        expect(Object.isSealed(value.list[0])).toBe(true);
        expect(Object.isFrozen(value)).toBe(false);
        value.a.b = 2;
        expect(value.a.b).toBe(2);
    });

    it("seals map contents and a cycle", () => {
        const entry = { n: 1 };
        const map = new Map([["k", entry]]);
        const box: { self?: object } = {};
        box.self = box;

        expect(sealDeep(map)).toBe(map);
        expect(Object.isSealed(map)).toBe(true);
        expect(Object.isSealed(entry)).toBe(true);
        expect(sealDeep(box)).toBe(box);
        expect(Object.isSealed(box)).toBe(true);
    });

    it("returns primitives as-is and treats a bare value key as data", () => {
        const data = { value: { a: 1 } };

        expect(sealDeep(1)).toBe(1);
        expect(sealDeep(data)).toBe(data);
        expect(Object.isSealed(data)).toBe(true);
        expect(Object.isSealed(data.value)).toBe(true);
    });

    it("throws on a cycle when circular is throw and leaves the value unsealed", () => {
        const box: { self?: object } = {};
        box.self = box;

        expect(() => sealDeep({ circular: "throw", value: box })).toThrow(
            RangeError,
        );
        expect(Object.isSealed(box)).toBe(false);
    });

    it("throws RangeError for an unknown circular value", () => {
        const inner = { a: 1 };

        expect(() =>
            sealDeep({
                circular: "nope",
                value: inner,
            } as unknown as SealDeepParams),
        ).toThrow(RangeError);
        expect(Object.isSealed(inner)).toBe(false);
    });
});
