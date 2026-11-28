import { describe, expect, it } from "vitest";
import { reduceAsync } from "./reduce-async.js";

describe("reduceAsync", () => {
    it("reduces left to right and resolves an empty array to the initial value", async () => {
        await expect(
            reduceAsync({
                array: ["a", "b", "c"],
                initialValue: "",
                reducer: async (accumulator, item) => {
                    await new Promise((resolve) => {
                        setTimeout(resolve, 5);
                    });
                    return accumulator + item;
                },
            }),
        ).resolves.toBe("abc");
        await expect(
            reduceAsync({
                array: [],
                initialValue: 4,
                reducer: async (accumulator) => accumulator,
            }),
        ).resolves.toBe(4);
    });

    it("rejects when initialValue is missing", async () => {
        await expect(
            reduceAsync({
                array: [1],
                reducer: async (accumulator: number) => accumulator,
            } as never),
        ).rejects.toThrow(
            "`initialValue` must be provided; received undefined.",
        );
    });

    it("rejects when the signal aborts before an item", async () => {
        const controller = new AbortController();
        controller.abort();
        await expect(
            reduceAsync({
                array: [],
                initialValue: 0,
                reducer: async (accumulator) => accumulator,
                signal: controller.signal,
            }),
        ).rejects.toBe(controller.signal.reason);

        const during = new AbortController();
        await expect(
            reduceAsync({
                array: [1, 2],
                initialValue: 0,
                signal: during.signal,
                reducer: async (accumulator, item) => {
                    during.abort();
                    return accumulator + item;
                },
            }),
        ).rejects.toBe(during.signal.reason);
    });

    it("rejects when array or reducer is unusable", async () => {
        await expect(
            reduceAsync({
                array: "no" as never,
                initialValue: 0,
                reducer: async (accumulator) => accumulator,
            }),
        ).rejects.toBeInstanceOf(TypeError);
        await expect(
            reduceAsync({
                array: [1],
                initialValue: 0,
                reducer: "no" as never,
            }),
        ).rejects.toBeInstanceOf(TypeError);
    });
});
