import { describe, expect, it } from "vitest";
import { diffArraysByKey } from "./diff-arrays-by-key.js";

describe("diffArraysByKey", () => {
    it("returns undefined when either side is not an array", () => {
        expect(
            diffArraysByKey({ first: null, second: [], key: "id" } as never),
        ).toBeUndefined();
    });

    it("classifies a changed value as updated only", () => {
        const previous = { id: 1, name: "a" };
        const next = { id: 1, name: "z" };
        const stayed = { id: 2, name: "b" };
        const diff = diffArraysByKey({
            first: [previous, stayed],
            second: [stayed, next],
            key: "id",
        });
        expect(diff?.updated).toEqual([{ previous, next }]);
        expect(diff?.moved).toEqual([{ item: stayed, from: 1, to: 0 }]);
        expect(diff?.added).toEqual([]);
        expect(diff?.removed).toEqual([]);
    });

    it("interleaves duplicate keys in appearance order", () => {
        const primary = { id: 1, name: "a" };
        const duplicate = { id: 1, name: "a-dup" };
        const stayed = { id: 2, name: "b" };
        const added = { id: 3, name: "c" };
        const addedDuplicate = { id: 3, name: "c-dup" };
        const nextPrimary = { id: 1, name: "a" };
        const diff = diffArraysByKey({
            first: [primary, duplicate, stayed],
            second: [stayed, added, nextPrimary, addedDuplicate],
            key: "id",
            equals: (left, right) => left.name === right.name,
        });
        expect(diff?.removed).toEqual([duplicate]);
        expect(diff?.added).toEqual([added, addedDuplicate]);
        expect(diff?.moved).toEqual([
            { item: stayed, from: 2, to: 0 },
            { item: nextPrimary, from: 0, to: 2 },
        ]);
        expect(diff?.unchanged).toEqual([]);
        expect(diff?.updated).toEqual([]);
    });

    it("keeps an equal item at the same index as unchanged", () => {
        const item = { id: 1, name: "a" };
        const values = Object.freeze([item]);
        expect(
            diffArraysByKey({ first: values, second: [item], key: "id" }),
        ).toEqual({
            added: [],
            removed: [],
            updated: [],
            moved: [],
            unchanged: [item],
        });
        expect(values).toEqual([item]);
    });

    it("throws when key is not an iteratee", () => {
        expect(() =>
            diffArraysByKey({
                first: [1],
                second: [1],
                key: {} as never,
            }),
        ).toThrow(TypeError);
    });
});
