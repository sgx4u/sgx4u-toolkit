import { describe, expect, it } from "vitest";
import { mapAsync } from "./map-async.js";

function delay(milliseconds: number): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(resolve, milliseconds);
    });
}

describe("mapAsync", () => {
    it("preserves input order", async () => {
        const values = await mapAsync({
            array: [1, 2, 3],
            mapper: async (item) => {
                await delay((4 - item) * 5);
                return item * 2;
            },
        });
        expect(values).toEqual([2, 4, 6]);
    });

    it("never exceeds the concurrency limit", async () => {
        let inFlight = 0;
        let maxInFlight = 0;
        const values = Object.freeze([1, 2, 3, 4, 5, 6]);
        const mapped = await mapAsync({
            array: values,
            concurrency: 2,
            mapper: async (item) => {
                inFlight += 1;
                maxInFlight = Math.max(maxInFlight, inFlight);
                await delay(5);
                inFlight -= 1;
                return item;
            },
        });
        expect(maxInFlight).toBeLessThanOrEqual(2);
        expect(maxInFlight).toBeGreaterThan(1);
        expect(mapped).toEqual([1, 2, 3, 4, 5, 6]);
        expect(values).toEqual([1, 2, 3, 4, 5, 6]);
    });

    it("starts items sequentially when concurrency is 1", async () => {
        const starts: number[] = [];
        await mapAsync({
            array: [1, 2, 3],
            concurrency: 1,
            mapper: async (item) => {
                starts.push(item);
                await delay(5);
                return item;
            },
        });
        expect(starts).toEqual([1, 2, 3]);
    });

    it("rejects when the signal is already aborted", async () => {
        const controller = new AbortController();
        controller.abort();
        await expect(
            mapAsync({
                array: [1],
                mapper: async (item) => item,
                signal: controller.signal,
            }),
        ).rejects.toBe(controller.signal.reason);
    });

    it("rejects when the signal aborts during the first item", async () => {
        const controller = new AbortController();
        const reason = new Error("stop");
        await expect(
            mapAsync({
                array: [1, 2, 3],
                mapper: async (item) => {
                    if (item === 1) {
                        controller.abort(reason);
                    }
                    await delay(10);
                    return item;
                },
                signal: controller.signal,
            }),
        ).rejects.toBe(reason);
    });

    it("rejects on the first mapper failure by default", async () => {
        await expect(
            mapAsync({
                array: [1, 2, 3],
                mapper: async (item) => {
                    if (item === 2) {
                        throw new Error("fail");
                    }
                    return item;
                },
            }),
        ).rejects.toThrow("fail");
    });

    it("rejects with AggregateError when stopOnError is false", async () => {
        await expect(
            mapAsync({
                array: [1, 2],
                stopOnError: false,
                mapper: async (item) => {
                    throw new Error(`fail-${item}`);
                },
            }),
        ).rejects.toBeInstanceOf(AggregateError);
    });

    it("rejects when array, mapper, or concurrency is unusable", async () => {
        await expect(
            mapAsync({ array: "no" as never, mapper: async (item) => item }),
        ).rejects.toBeInstanceOf(TypeError);
        await expect(
            mapAsync({ array: [1], mapper: "no" as never }),
        ).rejects.toBeInstanceOf(TypeError);
        await expect(
            mapAsync({
                array: [1],
                mapper: async (item) => item,
                concurrency: 0,
            }),
        ).rejects.toBeInstanceOf(RangeError);
    });
});
