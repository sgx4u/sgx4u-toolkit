import { describe, expect, it } from "vitest";
import { forEachAsync } from "./for-each-async.js";

describe("forEachAsync", () => {
    it("visits every item and resolves undefined", async () => {
        const seen: number[] = [];
        const values = Object.freeze([1, 2, 3]);
        await expect(
            forEachAsync({
                array: values,
                visitor: async (item) => {
                    seen.push(item);
                },
            }),
        ).resolves.toBeUndefined();
        expect(seen).toEqual([1, 2, 3]);
        expect(values).toEqual([1, 2, 3]);
    });

    it("rejects when array is not an array", async () => {
        await expect(
            forEachAsync({
                array: null as never,
                visitor: async () => undefined,
            }),
        ).rejects.toBeInstanceOf(TypeError);
    });
});
