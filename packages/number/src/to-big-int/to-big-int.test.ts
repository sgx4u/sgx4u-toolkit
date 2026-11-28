import { describe, expect, it } from "vitest";
import { toBigInt } from "../index.js";

describe("toBigInt", () => {
    it("covers the documented behavior", () => {
        expect(toBigInt("42")).toBe(42n);
        expect(toBigInt(7)).toBe(7n);
        expect(toBigInt(8n)).toBe(8n);
        expect(toBigInt("1.5")).toBeUndefined();
        expect(toBigInt(1.5)).toBeUndefined();
        expect(toBigInt(Number.MAX_SAFE_INTEGER + 1)).toBeUndefined();
    });
});
