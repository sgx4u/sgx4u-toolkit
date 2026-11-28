import { describe, expect, it } from "vitest";
import { isCreditCard } from "./is-credit-card.js";
describe("isCreditCard", () => {
    it("accepts the Visa test number", () => {
        expect(isCreditCard("4242424242424242")).toBe(true);
        expect(isCreditCard("4242-4242-4242-4242")).toBe(true);
        expect(isCreditCard("4242424242424243")).toBe(false);
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(isCreditCard(null as never)).toBe(false);
    });
    it("accepts an empty string", () => {
        expect(typeof isCreditCard("")).toBe("boolean");
    });
    it("accepts a family emoji grapheme", () => {
        expect(typeof isCreditCard("👨‍👩‍👧")).toBe("boolean");
    });
    it("accepts a combining mark", () => {
        expect(typeof isCreditCard("e\u0301")).toBe("boolean");
    });
    it("accepts Arabic text", () => {
        expect(typeof isCreditCard("مرحبا")).toBe("boolean");
    });
    it("accepts CJK text", () => {
        expect(typeof isCreditCard("你好")).toBe("boolean");
    });
});
