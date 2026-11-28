import { describe, expect, it } from "vitest";
import { endsWith } from "./ends-with.js";
describe("endsWith", () => {
    it("checks the suffix", () => {
        expect(endsWith({ value: "hello", search: "lo" })).toBe(true);
        expect(
            endsWith({ value: "hello", search: "LO", ignoreCase: true }),
        ).toBe(true);
        expect(endsWith({ value: "hello", search: "x" })).toBe(false);
        expect(endsWith({ value: "hello", search: "h", position: -1 })).toBe(
            false,
        );
        expect(endsWith({ value: "hello", search: "", position: -1 })).toBe(
            true,
        );
        expect(endsWith({ value: "hello", search: "hell", position: 4 })).toBe(
            true,
        );
        expect(endsWith({ value: "👨‍👩‍👧‍👦", search: "👦" })).toBe(false);
        expect(endsWith({ value: 1 as unknown as string, search: "a" })).toBe(
            false,
        );
    });
});
