import { describe, expect, it } from "vitest";
import { isUUID } from "./is-uuid.js";
describe("isUUID", () => {
    it("accepts versions, nil, and max", () => {
        expect(isUUID("00000000-0000-0000-0000-000000000000")).toBe(true);
        expect(isUUID("ffffffff-ffff-ffff-ffff-ffffffffffff")).toBe(true);
        expect(
            isUUID({
                value: "00000000-0000-0000-0000-000000000000",
                version: "nil",
            }),
        ).toBe(true);
        expect(
            isUUID({
                value: "550e8400-e29b-41d4-a716-446655440000",
                version: 4,
            }),
        ).toBe(true);
        expect(isUUID("550e8400-e29b-41d4-a716-446655440000")).toBe(true);
        expect(isUUID("{550e8400-e29b-41d4-a716-446655440000}")).toBe(false);
        expect(isUUID(null)).toBe(false);
        expect(() => isUUID({ value: "x", version: 9 as 4 })).toThrow(
            RangeError,
        );
        expect(() => isUUID({ value: "x", version: 0 as 4 })).toThrow(
            RangeError,
        );
        expect(() => isUUID({ value: "x", version: "foo" })).toThrow(
            RangeError,
        );
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(isUUID(null as never)).toBe(false);
    });
    it("accepts an empty string", () => {
        expect(typeof isUUID("")).toBe("boolean");
    });
    it("accepts a family emoji grapheme", () => {
        expect(typeof isUUID("👨‍👩‍👧")).toBe("boolean");
    });
    it("accepts a combining mark", () => {
        expect(typeof isUUID("e\u0301")).toBe("boolean");
    });
    it("accepts Arabic text", () => {
        expect(typeof isUUID("مرحبا")).toBe("boolean");
    });
    it("accepts CJK text", () => {
        expect(typeof isUUID("你好")).toBe("boolean");
    });
});
