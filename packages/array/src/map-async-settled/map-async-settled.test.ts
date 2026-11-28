import { describe, expect, it } from "vitest";
import { mapAsyncSettled } from "./map-async-settled.js";

describe("mapAsyncSettled", () => {
    it("captures fulfilments and rejections without rejecting", async () => {
        const outcomes = await mapAsyncSettled({
            array: [1, 2, 3],
            mapper: async (item) => {
                if (item === 2) {
                    throw new Error("nope");
                }
                return item;
            },
        });
        expect(outcomes[0]).toEqual({ status: "fulfilled", value: 1 });
        expect(outcomes[1]?.status).toBe("rejected");
        expect(outcomes[2]).toEqual({ status: "fulfilled", value: 3 });
        if (outcomes[1]?.status === "rejected") {
            expect(outcomes[1].reason).toBeInstanceOf(Error);
        }
    });

    it("rejects for a bad array, a bad mapper, or an aborted signal", async () => {
        await expect(
            mapAsyncSettled({
                array: "no" as never,
                mapper: async (item) => item,
            }),
        ).rejects.toBeInstanceOf(TypeError);
        await expect(
            mapAsyncSettled({ array: [1], mapper: null as never }),
        ).rejects.toBeInstanceOf(TypeError);
        const controller = new AbortController();
        controller.abort();
        await expect(
            mapAsyncSettled({
                array: [1],
                mapper: async (item) => item,
                signal: controller.signal,
            }),
        ).rejects.toBe(controller.signal.reason);
    });
});
