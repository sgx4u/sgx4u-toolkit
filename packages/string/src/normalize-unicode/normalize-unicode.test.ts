import { describe, expect, it } from "vitest";
import fc from "fast-check";
import { normalizeUnicode } from "./normalize-unicode.js";

describe("normalizeUnicode", () => {
    it("normalizes and is idempotent", () => {
        expect(normalizeUnicode("e\u0301")).toBe("é");
        expect(normalizeUnicode({ value: "é", form: "NFD" })).toBe("e\u0301");
        expect(normalizeUnicode("")).toBe("");
        expect(normalizeUnicode(null as unknown as string)).toBeUndefined();
        expect(() =>
            normalizeUnicode({ value: "a", form: "nope" as "NFC" }),
        ).toThrow(RangeError);
    });

    it("is idempotent for random strings", () => {
        fc.assert(
            fc.property(fc.string({ maxLength: 40 }), (value) => {
                const once = normalizeUnicode(value);
                expect(normalizeUnicode(once ?? "")).toBe(once);
            }),
            { numRuns: 30 },
        );
    });
});
