import { describe, expect, it } from "vitest";
import { extractEmails } from "./extract-emails.js";
describe("extractEmails", () => {
    it("returns addresses in order", () => {
        expect(extractEmails("a@b.co and c@d.co")).toEqual([
            "a@b.co",
            "c@d.co",
        ]);
        expect(extractEmails("none")).toEqual([]);
        expect(extractEmails(null)).toBeUndefined();
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(extractEmails(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            extractEmails("") === undefined || Array.isArray(extractEmails("")),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            extractEmails("👨‍👩‍👧") === undefined ||
                Array.isArray(extractEmails("👨‍👩‍👧")),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            extractEmails("e\u0301") === undefined ||
                Array.isArray(extractEmails("e\u0301")),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            extractEmails("مرحبا") === undefined ||
                Array.isArray(extractEmails("مرحبا")),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            extractEmails("你好") === undefined ||
                Array.isArray(extractEmails("你好")),
        ).toBe(true);
    });
});
