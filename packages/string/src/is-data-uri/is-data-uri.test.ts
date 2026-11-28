import { describe, expect, it } from "vitest";
import { isDataURI } from "./is-data-uri.js";
describe("isDataURI", () => {
    it("accepts a data URI", () => {
        expect(isDataURI("data:text/plain,hi")).toBe(true);
        expect(isDataURI("https://x")).toBe(false);
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(isDataURI(null as never)).toBe(false);
    });
    it("accepts an empty string", () => {
        expect(typeof isDataURI("")).toBe("boolean");
    });
    it("accepts a family emoji grapheme", () => {
        expect(typeof isDataURI("👨‍👩‍👧")).toBe("boolean");
    });
    it("accepts a combining mark", () => {
        expect(typeof isDataURI("e\u0301")).toBe("boolean");
    });
    it("accepts Arabic text", () => {
        expect(typeof isDataURI("مرحبا")).toBe("boolean");
    });
    it("accepts CJK text", () => {
        expect(typeof isDataURI("你好")).toBe("boolean");
    });
});
