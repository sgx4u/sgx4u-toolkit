import { describe, expect, it } from "vitest";
import { findAsync } from "./find-async.js";

describe("findAsync", () => {
    it("returns the first match in input order", async () => {
        await expect(
            findAsync({
                array: ["a", "b"],
                predicate: async (item) => {
                    if (item === "b") {
                        return true;
                    }
                    await new Promise((resolve) => {
                        setTimeout(resolve, 15);
                    });
                    return true;
                },
            }),
        ).resolves.toBe("a");
    });

    it("returns undefined when nothing matches", async () => {
        await expect(
            findAsync({ array: [1, 2], predicate: async () => false }),
        ).resolves.toBeUndefined();
        await expect(
            findAsync({ array: [], predicate: async () => true }),
        ).resolves.toBeUndefined();
    });

    it("rejects when the predicate throws", async () => {
        await expect(
            findAsync({
                array: [1],
                predicate: async () => {
                    throw new Error("fail");
                },
            }),
        ).rejects.toThrow("fail");
    });
});
