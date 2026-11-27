import { describe, expect, it } from "vitest";
import { damp } from "../index.js";

describe("damp", () => {
    it("covers the documented behavior", () => {
        expect(
            damp({ current: 0, target: 10, smoothing: 0, deltaTime: 1 }),
        ).toBe(10);
        expect(
            damp({ current: 0, target: 10, smoothing: 1, deltaTime: 0 }),
        ).toBe(0);
        const stepped = damp({
            current: 0,
            target: 10,
            smoothing: 1,
            deltaTime: 1,
        });
        expect(stepped).toBeGreaterThan(6);
        expect(stepped).toBeLessThan(7);
        expect(
            damp({ current: 0, target: 1, smoothing: -1, deltaTime: 1 }),
        ).toBeUndefined();
    });
});
