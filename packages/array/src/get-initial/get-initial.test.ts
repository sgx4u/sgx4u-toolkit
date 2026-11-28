import { describe, expect, it } from "vitest";
import { getInitial } from "./get-initial.js";

function* oneNumber(): Generator<number> {
    yield 1;
}

describe("getInitial", () => {
    it("returns every item except the last", () => {
        const item = { value: 1 };
        const input = Object.freeze([item, { value: 2 }, { value: 3 }]);
        const result = getInitial(input);

        expect(result).toEqual([item, { value: 2 }]);
        expect(result).not.toBe(input);
        expect(result?.[0]).toBe(item);
        expect(getInitial([1])).toEqual([]);
        expect(getInitial([])).toEqual([]);
        expect(getInitial([])).not.toBe(getInitial([]));
    });

    it("copies a hole as undefined", () => {
        const sparse: number[] = [];
        sparse[0] = 1;
        sparse[2] = 3;
        expect(getInitial(sparse)).toEqual([1, undefined]);
    });

    it("returns undefined for invalid input", () => {
        expect(getInitial(null)).toBeUndefined();
        expect(getInitial({})).toBeUndefined();
        expect(getInitial("text")).toBeUndefined();
        expect(getInitial(new Uint8Array([1]))).toBeUndefined();
        expect(getInitial(new Set([1]))).toBeUndefined();
        expect(getInitial(oneNumber())).toBeUndefined();
    });
});
