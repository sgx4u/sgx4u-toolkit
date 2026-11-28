import { describe, expect, it } from "vitest";
import { diffObjects } from "../diff-objects/diff-objects.js";
import { revertObjectPatch } from "../revert-object-patch/revert-object-patch.js";
import { valuesAreEqual } from "../utils/equal.utils.js";
import { applyObjectPatch } from "./apply-object-patch.js";

const equalOptions = {
    includeNonEnumerable: false,
    includeSymbols: false,
} as const;

function roundTrip(first: unknown, second: unknown): void {
    const patch = diffObjects({ first, second });
    const applied = applyObjectPatch({ object: first, patch });
    const reverted = revertObjectPatch({ object: second, patch });
    expect(valuesAreEqual(applied, second, equalOptions)).toBe(true);
    expect(valuesAreEqual(reverted, first, equalOptions)).toBe(true);
}

describe("applyObjectPatch", () => {
    it("round-trips a nested object", () => {
        const shared = { id: 1 };
        const first = {
            items: [1, 2, 3],
            meta: { keep: shared, n: 1 },
        };
        const second = {
            items: [1, 9, 3, 4],
            meta: { extra: true, n: 2 },
        };
        roundTrip(first, second);
        const patch = diffObjects({ first, second });
        const applied = applyObjectPatch({ object: first, patch }) as {
            meta: { keep?: unknown };
        };
        expect(applied.meta.keep).toBeUndefined();
        expect(first.meta.keep).toBe(shared);
        expect(first.items).toEqual([1, 2, 3]);
    });

    it("round-trips an array insertion and an array deletion", () => {
        roundTrip([1, 2, 3], [1, 9, 3, 4]);
        roundTrip([1, 2, 3, 4], [1, 8, 3]);
        roundTrip(["a", "b", "c", "d"], ["a", "x", "c"]);
    });

    it("returns the same reference for an unchanged patch", () => {
        const object = { id: 1 };
        expect(applyObjectPatch({ object, patch: { kind: "unchanged" } })).toBe(
            object,
        );
    });

    it("returns the new root for added and changed patches", () => {
        expect(
            applyObjectPatch({
                object: 1,
                patch: { kind: "added", value: 2 },
            }),
        ).toBe(2);
        expect(
            applyObjectPatch({
                object: 1,
                patch: { kind: "changed", from: 1, to: "next" },
            }),
        ).toBe("next");
    });

    it("returns undefined when the root is removed", () => {
        expect(
            applyObjectPatch({
                object: { id: 1 },
                patch: { kind: "removed", value: { id: 1 } },
            }),
        ).toBeUndefined();
    });

    it("inserts an added array index and omits a removed one", () => {
        expect(
            applyObjectPatch({
                object: [1, 3],
                patch: {
                    kind: "array",
                    items: [{ index: 1, diff: { kind: "added", value: 2 } }],
                },
            }),
        ).toEqual([1, 2, 3]);
        expect(
            applyObjectPatch({
                object: [1, 2, 3],
                patch: {
                    kind: "array",
                    items: [{ index: 1, diff: { kind: "removed", value: 2 } }],
                },
            }),
        ).toEqual([1, 3]);
    });

    it("returns undefined for an invalid patch", () => {
        expect(
            applyObjectPatch({ object: {}, patch: { kind: "nope" } }),
        ).toBeUndefined();
        expect(applyObjectPatch({ object: {}, patch: null })).toBeUndefined();
        expect(
            applyObjectPatch({
                object: {},
                patch: { kind: "object", properties: { a: { kind: "added" } } },
            }),
        ).toBeUndefined();
        expect(
            applyObjectPatch({
                object: [],
                patch: {
                    kind: "array",
                    items: [{ index: -1, diff: { kind: "unchanged" } }],
                },
            }),
        ).toBeUndefined();
    });
});
