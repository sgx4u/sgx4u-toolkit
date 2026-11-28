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
