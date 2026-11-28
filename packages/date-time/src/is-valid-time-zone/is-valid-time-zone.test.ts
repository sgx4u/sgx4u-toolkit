import { describe, expect, it } from "vitest";
import { isValidTimeZone } from "../index.js";

describe("isValidTimeZone", () => {
    it("accepts IANA names and fixed offsets", () => {
        expect(isValidTimeZone("Asia/Kolkata")).toBe(true);
        expect(isValidTimeZone("UTC")).toBe(true);
        expect(isValidTimeZone("America/New_York")).toBe(true);
        expect(isValidTimeZone("+05:30")).toBe(true);
        expect(isValidTimeZone("+0530")).toBe(true);
        expect(isValidTimeZone("-08")).toBe(true);
        expect(isValidTimeZone("+00:00")).toBe(true);
    });

    it("rejects unknown zones and other types without throwing", () => {
        const rejectedValues: readonly unknown[] = [
            "Mars/Base",
            "",
            "+5:30",
            "+24:00",
            "+00:60",
            null,
            undefined,
            330,
            true,
        ];

        for (const rejectedValue of rejectedValues) {
            expect(isValidTimeZone(rejectedValue)).toBe(false);
        }
    });
});
