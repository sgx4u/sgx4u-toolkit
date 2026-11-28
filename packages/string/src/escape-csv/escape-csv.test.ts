import { describe, expect, it } from "vitest";
import { escapeCSV } from "./escape-csv.js";
describe("escapeCSV", () => {
    it("quotes when needed", () => {
        expect(escapeCSV("a,b")).toBe('"a,b"');
        expect(escapeCSV('say "hi"')).toBe('"say ""hi"""');
        expect(escapeCSV("plain")).toBe("plain");
        expect(escapeCSV(null as unknown as string)).toBeUndefined();
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(escapeCSV(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(typeof escapeCSV("")).toBe("string");
    });
    it("accepts a family emoji grapheme", () => {
        expect(typeof escapeCSV("👨‍👩‍👧")).toBe("string");
    });
    it("accepts a combining mark", () => {
        expect(typeof escapeCSV("e\u0301")).toBe("string");
    });
    it("accepts Arabic text", () => {
        expect(typeof escapeCSV("مرحبا")).toBe("string");
    });
    it("accepts CJK text", () => {
        expect(typeof escapeCSV("你好")).toBe("string");
    });
});
