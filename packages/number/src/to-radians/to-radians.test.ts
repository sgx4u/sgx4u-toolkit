import { describe, expect, it } from "vitest";
import { toRadians } from "../index.js";

describe("toRadians", () => {
    it("covers the documented behavior", () => {
        expect(toRadians(180)).toBe(Math.PI);
        expect(toRadians(Number.POSITIVE_INFINITY)).toBeUndefined();
    });
});
