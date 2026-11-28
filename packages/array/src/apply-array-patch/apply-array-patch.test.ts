import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { diffArraySequence } from "../diff-array-sequence/diff-array-sequence.js";
import { applyArrayPatch } from "./apply-array-patch.js";

describe("applyArrayPatch", () => {
    it("inserts, keeps, and removes without mutating the inputs", () => {
        const array = Object.freeze([1, 2]);
        const patch = Object.freeze([
            { type: "keep" as const, items: [1] },
            { type: "insert" as const, items: [9] },
            { type: "remove" as const, items: [2] },
        ]);
        const next = applyArrayPatch({ array, patch });
        expect(next).toEqual([1, 9]);
        expect(next).not.toBe(array);
        expect(array).toEqual([1, 2]);
    });

    it("returns undefined when a run does not match or items remain", () => {
        expect(
            applyArrayPatch({
                array: [1],
                patch: [{ type: "keep", items: [9] }],
            }),
        ).toBeUndefined();
        expect(
            applyArrayPatch({
                array: [1, 2],
                patch: [{ type: "keep", items: [1] }],
            }),
        ).toBeUndefined();
        expect(
            applyArrayPatch({
                array: [],
                patch: [{ type: "remove", items: [1] }],
            }),
        ).toBeUndefined();
    });

    it("returns an empty array when an empty patch matches an empty array", () => {
        expect(applyArrayPatch({ array: [], patch: [] })).toEqual([]);
    });

    it("returns undefined when array is not an array", () => {
        expect(
            applyArrayPatch({ array: "no", patch: [] } as never),
        ).toBeUndefined();
    });

    it("throws when the patch is malformed", () => {
        expect(() =>
            applyArrayPatch({ array: [1], patch: "no" as never }),
        ).toThrow(TypeError);
        expect(() =>
            applyArrayPatch({
                array: [1],
                patch: [{ type: "replace" as never, items: [1] }],
            }),
        ).toThrow(TypeError);
        expect(() =>
            applyArrayPatch({
                array: [1],
                patch: [{ type: "keep", items: "no" as never }],
            }),
        ).toThrow(TypeError);
    });

    it("matches a sparse hole as undefined", () => {
        const array: number[] = [];
        array[0] = 1;
        array[2] = 3;
        expect(
            applyArrayPatch({
                array,
                patch: [{ type: "keep", items: [1, undefined, 3] }],
            }),
        ).toEqual([1, undefined, 3]);
    });

    it("rebuilds the next array from a sequence patch", () => {
        fc.assert(
            fc.property(
                fc.array(fc.integer({ min: 0, max: 5 }), { maxLength: 8 }),
                fc.array(fc.integer({ min: 0, max: 5 }), { maxLength: 8 }),
                (first, second) => {
                    const patch = diffArraySequence({ first, second });
                    expect(
                        applyArrayPatch({ array: first, patch: patch ?? [] }),
                    ).toEqual([...second]);
                },
            ),
        );
    });
});
