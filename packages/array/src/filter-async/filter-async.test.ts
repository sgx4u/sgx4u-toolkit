import { describe, expect, it } from "vitest";
import { filterAsync } from "./filter-async.js";

describe("filterAsync", () => {
    it("keeps items whose predicate is true, in order", async () => {
        const values = Object.freeze([1, 2, 3, 4]);
        await expect(
            filterAsync({
                array: values,
                predicate: async (item) => item % 2 === 0,
            }),
        ).resolves.toEqual([2, 4]);
        expect(values).toEqual([1, 2, 3, 4]);
    });

    it("resolves an empty array when nothing matches", async () => {
        await expect(
            filterAsync({ array: [], predicate: async () => true }),
        ).resolves.toEqual([]);
    });

    it("rejects when array is not an array", async () => {
        await expect(
            filterAsync({ array: null as never, predicate: async () => true }),
        ).rejects.toBeInstanceOf(TypeError);
    });
});
