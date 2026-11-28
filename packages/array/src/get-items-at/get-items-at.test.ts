import { describe, expect, it } from "vitest";
import { getItemsAt } from "./get-items-at.js";
import type { GetItemsAtParams } from "./get-items-at.types.js";

function* oneNumber(): Generator<number> {
    yield 1;
}

describe("getItemsAt", () => {
    it("returns items in index order, including duplicates", () => {
        const input = Object.freeze(["a", "b", "c"]);
        const indexes = Object.freeze([2, 0, 0, -1]);
        const params: GetItemsAtParams<string> = { array: input, indexes };
        const result = getItemsAt(params);

        expect(result).toEqual(["c", "a", "a", "c"]);
        expect(result).not.toBe(input);
        expect(getItemsAt({ array: ["a"], indexes: [0] })).toEqual(["a"]);
        expect(getItemsAt({ array: ["a", "b"], indexes: [] })).toEqual([]);
        expect(indexes).toEqual([2, 0, 0, -1]);
        expect(input).toEqual(["a", "b", "c"]);
    });

    it("skips out-of-range and non-integer indexes", () => {
        expect(
            getItemsAt({
                array: ["a", "b", "c"],
                indexes: [0, 2, 5, 1.5, -4, "0", true],
            }),
        ).toEqual(["a", "c"]);
        expect(getItemsAt({ array: [], indexes: [0, -1] })).toEqual([]);
    });

    it("returns a hole as undefined", () => {
        const sparse: string[] = [];
        sparse[1] = "b";
        expect(getItemsAt({ array: sparse, indexes: [0, 1] })).toEqual([
            undefined,
            "b",
        ]);
    });

    it("returns undefined when array is not an array", () => {
        expect(getItemsAt({ array: "text", indexes: [0] })).toBeUndefined();
        expect(getItemsAt({ indexes: [0] })).toBeUndefined();
    });

    it("throws when indexes is not an array", () => {
        expect(getItemsAt(null)).toBeUndefined();
        expect(getItemsAt("text")).toBeUndefined();
        expect(() => getItemsAt({})).toThrow(TypeError);
        expect(() => getItemsAt(new Uint8Array([1]))).toThrow(TypeError);
        expect(() => getItemsAt(new Set([1]))).toThrow(TypeError);
        expect(() => getItemsAt(oneNumber())).toThrow(TypeError);
        expect(() =>
            getItemsAt({ array: ["a"], indexes: "no" as unknown as unknown[] }),
        ).toThrow('`indexes` must be an array; received "no".');
        expect(() =>
            getItemsAt({
                array: "no",
                indexes: "no" as unknown as unknown[],
            }),
        ).toThrow(TypeError);
    });
});
