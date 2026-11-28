import { describe, expect, it } from "vitest";
import { diffObjects } from "../diff-objects/diff-objects.js";
import { valuesAreEqual } from "../utils/equal.utils.js";
import { revertObjectPatch } from "./revert-object-patch.js";

describe("revertObjectPatch", () => {
    it("swaps added and removed and exchanges changed values", () => {
        const patch = diffObjects({
            first: { id: 1, city: "Paris" },
            second: { id: 2, name: "Ada" },
        });
        expect(
            revertObjectPatch({
                object: { id: 2, name: "Ada" },
                patch,
            }),
        ).toEqual({ id: 1, city: "Paris" });
    });

    it("restores an array after an insertion and a deletion", () => {
        const first = [1, 2, 3, 4];
        const second = [1, 9, 3];
        const patch = diffObjects({ first, second });
        const restored = revertObjectPatch({ object: second, patch });
        expect(
            valuesAreEqual(restored, first, {
                includeNonEnumerable: false,
                includeSymbols: false,
            }),
        ).toBe(true);
    });

    it("returns undefined for an invalid patch", () => {
        expect(
            revertObjectPatch({ object: { id: 1 }, patch: { kind: "bad" } }),
        ).toBeUndefined();
        expect(revertObjectPatch({ object: [], patch: [] })).toBeUndefined();
    });
});
