import { afterEach, describe, expect, it } from "vitest";
import type { ApplyPathUpdatesParams } from "./apply-path-updates.types.js";
import { applyPathUpdates } from "./apply-path-updates.js";

function sparseTriple(): number[] {
    const values: number[] = [];
    values[0] = 1;
    values[2] = 3;
    return values;
}

afterEach(() => {
    delete (Object.prototype as { polluted?: unknown }).polluted;
});

describe("applyPathUpdates", () => {
    it("applies a record and an array from left to right", () => {
        expect(
            applyPathUpdates({
                object: { a: 1 },
                updates: { "b.c": 2, a: 3 },
            }),
        ).toEqual({ a: 3, b: { c: 2 } });

        const updates = [
            { path: "b", value: 2 },
            { path: ["c", 0], value: 3 },
        ];
        const object = { a: 1 };
        expect(applyPathUpdates({ object, updates })).toEqual({
            a: 1,
            b: 2,
            c: [3],
        });
        expect(updates).toEqual([
            { path: "b", value: 2 },
            { path: ["c", 0], value: 3 },
        ]);
        expect(object).toEqual({ a: 1 });
    });

    it("lets a later write replace an earlier one", () => {
        expect(
            applyPathUpdates({
                object: {},
                updates: { "a.b": 2, a: 1 },
            }),
        ).toEqual({ a: 1 });
    });

    it("returns the same object when there is nothing to write", () => {
        const object = { a: 1 };
        expect(applyPathUpdates({ object, updates: {} })).toBe(object);
        expect(applyPathUpdates({ object, updates: [] })).toBe(object);
        expect(
            applyPathUpdates({
                object,
                updates: [
                    { path: "a..b", value: 1 },
                    { value: 1 },
                ] as unknown as ApplyPathUpdatesParams["updates"],
            }),
        ).toBe(object);
    });

    it("replaces the root when a path is empty", () => {
        expect(
            applyPathUpdates({
                object: { a: 1 },
                updates: [{ path: "", value: { b: 2 } }],
            }),
        ).toEqual({ b: 2 });
    });

    it("returns undefined when the object or the updates are the wrong kind", () => {
        expect(applyPathUpdates({ object: null, updates: {} })).toBeUndefined();
        expect(
            applyPathUpdates({ object: "ada", updates: [] }),
        ).toBeUndefined();
        expect(
            applyPathUpdates({
                object: {},
                updates:
                    new Map() as unknown as ApplyPathUpdatesParams["updates"],
            }),
        ).toBeUndefined();
        expect(
            applyPathUpdates({
                object: {},
                updates: null as unknown as ApplyPathUpdatesParams["updates"],
            }),
        ).toBeUndefined();
    });

    it("fills one sparse slot and leaves the input hole in place", () => {
        const sparse = sparseTriple();
        const result = applyPathUpdates({
            object: sparse,
            updates: { 1: 2 },
        }) as unknown[];

        expect(result).toEqual([1, 2, 3]);
        expect(Object.hasOwn(sparse, 1)).toBe(false);
    });

    it("throws for an unknown option or a rejected dangerous key", () => {
        expect(() =>
            applyPathUpdates({
                object: {},
                updates: {},
                prototypeKeys: "bad",
            } as unknown as ApplyPathUpdatesParams),
        ).toThrow(
            '`prototypeKeys` must be "skip", "throw", or "keep"; received "bad".',
        );
        const object = {};
        expect(() =>
            applyPathUpdates({
                object,
                updates: { "__proto__.polluted": true },
                prototypeKeys: "throw",
            }),
        ).toThrow(RangeError);
        expect(object).toEqual({});
        expect(({} as { polluted?: unknown }).polluted).toBeUndefined();
    });

    it("does not pollute Object.prototype from a path or a JSON payload", () => {
        const payload = JSON.parse('{"__proto__.polluted": true, "ok": 1}');
        const result = applyPathUpdates({
            object: { a: 1 },
            updates: payload,
        }) as { a: number; ok?: number };

        expect(result.ok).toBe(1);
        expect(result.a).toBe(1);
        applyPathUpdates({
            object: {},
            updates: { "__proto__.polluted": true },
        });
        expect(({} as { polluted?: unknown }).polluted).toBeUndefined();
    });
});
