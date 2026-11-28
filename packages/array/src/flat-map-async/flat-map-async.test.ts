import { describe, expect, it } from "vitest";
import { flatMapAsync } from "./flat-map-async.js";

describe("flatMapAsync", () => {
    it("flattens one level and keeps a non-array result as one item", async () => {
        await expect(
            flatMapAsync({
                array: [1, 2, 3],
                mapper: async (item) => (item === 1 ? [item, item] : item),
            }),
        ).resolves.toEqual([1, 1, 2, 3]);
    });

    it("does not flatten a nested array further", async () => {
        await expect(
            flatMapAsync({
                array: [1],
                mapper: async () => [1, [2]],
            }),
        ).resolves.toEqual([1, [2]]);
    });

    it("rejects when array is not an array", async () => {
        await expect(
            flatMapAsync({
                array: "no" as never,
                mapper: async (item) => item,
            }),
        ).rejects.toBeInstanceOf(TypeError);
    });
});
