import { describe, expect, it } from "vitest";
import { someAsync } from "./some-async.js";

describe("someAsync", () => {
    it("returns true when any predicate is true", async () => {
        await expect(
            someAsync({
                array: [1, 2, 3],
                predicate: async (item) => item === 2,
            }),
        ).resolves.toBe(true);
    });

    it("returns false for an empty array or no match", async () => {
        await expect(
            someAsync({ array: [], predicate: async () => true }),
        ).resolves.toBe(false);
        await expect(
            someAsync({ array: [1], predicate: async () => false }),
        ).resolves.toBe(false);
    });

    it("rejects when array is not an array", async () => {
        await expect(
            someAsync({ array: "no" as never, predicate: async () => true }),
        ).rejects.toBeInstanceOf(TypeError);
    });
});
