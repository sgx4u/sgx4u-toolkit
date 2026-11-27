import { describe, expect, it } from "vitest";
import { everyAsync } from "./every-async.js";

describe("everyAsync", () => {
    it("returns true when every predicate is true", async () => {
        await expect(
            everyAsync({
                array: [2, 4],
                predicate: async (item) => item % 2 === 0,
            }),
        ).resolves.toBe(true);
    });

    it("returns true for an empty array and false when one item fails", async () => {
        await expect(
            everyAsync({ array: [], predicate: async () => false }),
        ).resolves.toBe(true);
        await expect(
            everyAsync({
                array: [2, 3],
                predicate: async (item) => item % 2 === 0,
            }),
        ).resolves.toBe(false);
    });

    it("rejects when array is not an array", async () => {
        await expect(
            everyAsync({ array: null as never, predicate: async () => true }),
        ).rejects.toBeInstanceOf(TypeError);
    });
});
