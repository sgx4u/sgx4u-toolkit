import { describe, expect, it } from "vitest";
import { hasKey } from "./has-key.js";

describe("hasKey", () => {
    it("checks own keys and optionally inherited keys", () => {
        expect(hasKey({ object: { id: 1 }, key: "id" })).toBe(true);
        expect(hasKey({ object: {}, key: "toString" })).toBe(false);
        expect(hasKey({ object: {}, key: "toString", inherited: true })).toBe(
            true,
        );
        expect(hasKey({ object: null, key: "id", inherited: true })).toBe(
            false,
        );
        expect(hasKey({ object: [], key: 0 })).toBe(false);
        expect(hasKey({ object: [1], key: 0 })).toBe(true);
    });
});
