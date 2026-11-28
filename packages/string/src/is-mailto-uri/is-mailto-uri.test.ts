import { describe, expect, it } from "vitest";
import { isMailtoURI } from "./is-mailto-uri.js";
describe("isMailtoURI", () => {
    it("requires an address", () => {
        expect(isMailtoURI("mailto:a@b.co")).toBe(true);
        expect(isMailtoURI("mailto:")).toBe(false);
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(isMailtoURI(null as never)).toBe(false);
    });
    it("accepts an empty string", () => {
        expect(typeof isMailtoURI("")).toBe("boolean");
    });
    it("accepts a family emoji grapheme", () => {
        expect(typeof isMailtoURI("👨‍👩‍👧")).toBe("boolean");
    });
    it("accepts a combining mark", () => {
        expect(typeof isMailtoURI("e\u0301")).toBe("boolean");
    });
    it("accepts Arabic text", () => {
        expect(typeof isMailtoURI("مرحبا")).toBe("boolean");
    });
    it("accepts CJK text", () => {
        expect(typeof isMailtoURI("你好")).toBe("boolean");
    });
});
