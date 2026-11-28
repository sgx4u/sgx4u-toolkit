import { describe, expect, it } from "vitest";
import { createArray } from "./create-array.js";
import * as root from "../index.js";
import * as asyncEntry from "../async.js";
import * as combinatorics from "../combinatorics.js";

describe("createArray", () => {
    it("binds equals without changing the standalone function", () => {
        const byIdentity = (left: unknown, right: unknown): boolean =>
            typeof left === "object" &&
            left !== null &&
            typeof right === "object" &&
            right !== null &&
            "id" in left &&
            "id" in right &&
            left.id === right.id;
        const arrays = createArray({ equals: byIdentity });
        const first = { id: 1 };
        const second = { id: 1 };
        expect(
            arrays.isEqualArray({
                first: [first],
                second: [second],
            }),
        ).toBe(true);
        expect(
            root.isEqualArray({
                first: [first],
                second: [second],
            }),
        ).toBe(false);
    });

    it("lets a per-call equals replace the bound one", () => {
        const arrays = createArray({
            equals: () => false,
        });
        expect(
            arrays.isEqualArray({
                first: [1],
                second: [1],
                equals: Object.is,
            }),
        ).toBe(true);
    });

    it("uses a bound random and lets seed win on that call", () => {
        const arrays = createArray({
            random: () => 0,
        });
        const first = arrays.shuffleItems([1, 2, 3, 4]);
        const second = arrays.shuffleItems([1, 2, 3, 4]);
        expect(second).toEqual(first);
        const seeded = arrays.shuffleItems({
            array: [1, 2, 3, 4],
            seed: 7,
        });
        const seededAgain = createArray().shuffleItems({
            array: [1, 2, 3, 4],
            seed: 7,
        });
        expect(seeded).toEqual(seededAgain);
    });

    it("keeps two instances isolated", () => {
        const numeric = createArray({ numeric: true, locale: "en-US" });
        const text = createArray({ numeric: false, locale: "en-US" });
        const values = ["item10", "item2"];
        expect(
            numeric.sortBy({
                array: values,
                keys: [(item: string) => item],
            }),
        ).toEqual(["item2", "item10"]);
        expect(
            text.sortBy({
                array: values,
                keys: [(item: string) => item],
            }),
        ).toEqual(["item10", "item2"]);
    });

    it("freezes the toolkit and rejects invalid config", () => {
        const arrays = createArray();
        expect(Object.isFrozen(arrays)).toBe(true);
        expect(() => createArray({ concurrency: 0 })).toThrow(RangeError);
        expect(() =>
            createArray({ random: "math" as unknown as () => number }),
        ).toThrow(TypeError);
        expect(() => createArray(null as unknown as undefined)).toThrow(
            TypeError,
        );
    });

    it("does not publish async or combinatorics helpers from the root", () => {
        expect("mapAsync" in root).toBe(false);
        expect("getPermutations" in root).toBe(false);
        expect("createAsyncArray" in root).toBe(false);
        expect(typeof root.createArray).toBe("function");
        expect(typeof asyncEntry.mapAsync).toBe("function");
        expect(typeof combinatorics.getPermutations).toBe("function");
    });
});
