import { describe, expect, it } from "vitest";
import { hasOwnKey } from "./has-own-key.js";

describe("hasOwnKey", () => {
    it("uses Object.hasOwn and does not throw", () => {
        expect(hasOwnKey({ object: { id: 1 }, key: "id" })).toBe(true);
        expect(hasOwnKey({ object: {}, key: "toString" })).toBe(false);
        expect(hasOwnKey({ object: null, key: "id" })).toBe(false);
        expect(hasOwnKey({ object: 1, key: "id" })).toBe(false);
        const symbol = Symbol("id");
        expect(hasOwnKey({ object: { [symbol]: 1 }, key: symbol })).toBe(true);
    });
});
