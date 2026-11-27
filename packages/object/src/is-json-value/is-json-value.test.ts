import { describe, expect, it } from "vitest";
import { isJSONValue } from "./is-json-value.js";

describe("isJSONValue", () => {
    it("accepts JSON data and rejects the rest", () => {
        const shared = { n: 1 };
        expect(isJSONValue(null)).toBe(true);
        expect(isJSONValue(true)).toBe(true);
        expect(isJSONValue("a")).toBe(true);
        expect(isJSONValue(1)).toBe(true);
        expect(isJSONValue({ a: [1, shared], b: shared })).toBe(true);
        expect(isJSONValue(Number.NaN)).toBe(false);
        expect(isJSONValue(Number.POSITIVE_INFINITY)).toBe(false);
        expect(isJSONValue(undefined)).toBe(false);
        expect(isJSONValue(() => 1)).toBe(false);
        expect(isJSONValue(1n)).toBe(false);
        expect(isJSONValue({ [Symbol("a")]: 1 })).toBe(false);
        const hole: unknown[] = [1, 2];
        delete hole[0];
        expect(isJSONValue(hole)).toBe(false);
        expect(isJSONValue({ missing: undefined })).toBe(false);
        const cycle: { self?: object } = {};
        cycle.self = cycle;
        expect(isJSONValue(cycle)).toBe(false);
        expect(isJSONValue(new Date())).toBe(false);
    });
});
