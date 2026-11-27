import { describe, expect, it } from "vitest";
import { createAsyncArray } from "./create-async-array.js";

describe("createAsyncArray", () => {
    it("binds concurrency and lets a call override it", async () => {
        let maxInFlight = 0;
        let inFlight = 0;
        const arrays = createAsyncArray({ concurrency: 1 });
        await arrays.mapAsync({
            array: [1, 2, 3, 4],
            mapper: async (item: number) => {
                inFlight += 1;
                maxInFlight = Math.max(maxInFlight, inFlight);
                await new Promise((resolve) => {
                    setTimeout(resolve, 5);
                });
                inFlight -= 1;
                return item;
            },
        });
        expect(maxInFlight).toBe(1);

        maxInFlight = 0;
        await arrays.mapAsync({
            array: [1, 2, 3, 4],
            concurrency: 4,
            mapper: async (item: number) => {
                inFlight += 1;
                maxInFlight = Math.max(maxInFlight, inFlight);
                await new Promise((resolve) => {
                    setTimeout(resolve, 5);
                });
                inFlight -= 1;
                return item;
            },
        });
        expect(maxInFlight).toBeGreaterThan(1);
    });

    it("rejects invalid config and freezes the toolkit", () => {
        expect(Object.isFrozen(createAsyncArray())).toBe(true);
        expect(() => createAsyncArray({ concurrency: 0 })).toThrow(RangeError);
    });
});
