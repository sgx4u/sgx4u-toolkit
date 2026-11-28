import { describe, expect, it } from "vitest";
import { startsWith } from "./starts-with.js";
describe("startsWith", () => {
    it("checks the prefix", () => {
        expect(startsWith({ value: "hello", search: "he" })).toBe(true);
        expect(
            startsWith({ value: "hello", search: "HE", ignoreCase: true }),
        ).toBe(true);
        expect(startsWith({ value: "hello", search: "x" })).toBe(false);
        expect(startsWith({ value: "hello", search: "e", position: 1 })).toBe(
            true,
        );
        expect(startsWith({ value: "hello", search: "h", position: -1 })).toBe(
            true,
        );
        expect(startsWith({ value: "👨‍👩‍👧‍👦", search: "👨" })).toBe(false);
        expect(startsWith({ value: "hello", search: "" })).toBe(true);
        expect(startsWith({ value: 1 as unknown as string, search: "a" })).toBe(
            false,
        );
        expect(() =>
            startsWith({ value: "a", search: 1 as unknown as string }),
        ).toThrow(TypeError);
    });
});
