import { describe, expect, it } from "vitest";
import { isURL } from "./is-url.js";
describe("isURL", () => {
    it("uses the URL parser and the default allow list", () => {
        expect(isURL("https://example.com")).toBe(true);
        expect(isURL("http://example.com/a")).toBe(true);
        expect(isURL("ftp://example.com")).toBe(false);
        expect(isURL("example.com")).toBe(false);
        expect(isURL({ value: "example.com", requireProtocol: false })).toBe(
            true,
        );
        expect(isURL("https://localhost")).toBe(false);
        expect(
            isURL({
                value: "https://localhost",
                allowLocalhost: true,
                requireTopLevelDomain: false,
            }),
        ).toBe(true);
        expect(isURL(null)).toBe(false);
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(isURL(null as never)).toBe(false);
    });
    it("accepts an empty string", () => {
        expect(typeof isURL("")).toBe("boolean");
    });
    it("accepts a family emoji grapheme", () => {
        expect(typeof isURL("👨‍👩‍👧")).toBe("boolean");
    });
    it("accepts a combining mark", () => {
        expect(typeof isURL("e\u0301")).toBe("boolean");
    });
    it("accepts Arabic text", () => {
        expect(typeof isURL("مرحبا")).toBe("boolean");
    });
    it("accepts CJK text", () => {
        expect(typeof isURL("你好")).toBe("boolean");
    });
});
