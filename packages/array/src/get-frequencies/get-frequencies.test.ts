import { describe, expect, it } from "vitest";
import { getFrequencies } from "./get-frequencies.js";

describe("getFrequencies", () => {
    it("returns undefined for an empty array or a non-array", () => {
        expect(getFrequencies({ array: [] })).toBeUndefined();
        expect(getFrequencies({ array: "no" } as never)).toBeUndefined();
    });

    it("counts first-seen values", () => {
        const values = Object.freeze(["a", "b", "a"]);
        expect(getFrequencies({ array: values })).toEqual([
            { value: "a", item: "a", count: 2 },
            { value: "b", item: "b", count: 1 },
        ]);
        expect(values).toEqual(["a", "b", "a"]);
    });

    it("counts keys and keeps the first item", () => {
        const first = { id: "a", n: 1 };
        const second = { id: "b", n: 2 };
        const third = { id: "a", n: 3 };
        expect(
            getFrequencies({ array: [first, second, third], by: "id" }),
        ).toEqual([
            { value: "a", item: first, count: 2 },
            { value: "b", item: second, count: 1 },
        ]);
    });

    it("treats a sparse hole as undefined", () => {
        const values: number[] = [];
        values[0] = 1;
        values[2] = 1;
        expect(getFrequencies({ array: values })).toEqual([
            { value: 1, item: 1, count: 2 },
            { value: undefined, item: undefined, count: 1 },
        ]);
    });
});
