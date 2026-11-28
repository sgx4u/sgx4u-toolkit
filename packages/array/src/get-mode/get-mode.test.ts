import { describe, expect, it } from "vitest";
import { getMode } from "./get-mode.js";

describe("getMode", () => {
    it("returns undefined for an empty array or a non-array", () => {
        expect(getMode({ array: [] })).toBeUndefined();
        expect(getMode({ array: null } as never)).toBeUndefined();
    });

    it("returns every maximal item in first-seen order", () => {
        const values = Object.freeze(["a", "b", "a", "c", "b"]);
        expect(getMode({ array: values })).toEqual(["a", "b"]);
        expect(getMode({ array: ["a", "b", "c"] })).toEqual(["a", "b", "c"]);
        expect(values).toEqual(["a", "b", "a", "c", "b"]);
    });

    it("counts keys and returns the first item of each maximal key", () => {
        const first = { id: "a", n: 1 };
        const second = { id: "b", n: 2 };
        const third = { id: "a", n: 3 };
        expect(getMode({ array: [first, second, third], by: "id" })).toEqual([
            first,
        ]);
    });

    it("treats NaN as the same key and a hole as undefined", () => {
        expect(getMode({ array: [Number.NaN, 1, Number.NaN] })).toEqual([
            Number.NaN,
        ]);
        const values: number[] = [];
        values[0] = 1;
        values[2] = 1;
        expect(getMode({ array: values })).toEqual([1]);
    });
});
