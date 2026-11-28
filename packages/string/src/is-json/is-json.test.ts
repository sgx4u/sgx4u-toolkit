import { describe, expect, it } from "vitest";
import { isJSON } from "./is-json.js";
describe("isJSON", () => {
    it("parses without throwing", () => {
        expect(isJSON("null")).toBe(true);
        expect(isJSON('"a"')).toBe(true);
        expect(isJSON("123")).toBe(true);
        expect(isJSON("")).toBe(false);
        expect(isJSON("{")).toBe(false);
        expect(isJSON(null)).toBe(false);
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(isJSON(null as never)).toBe(false);
    });
    it("accepts an empty string", () => {
        expect(typeof isJSON("")).toBe("boolean");
    });
    it("accepts a family emoji grapheme", () => {
        expect(typeof isJSON("👨‍👩‍👧")).toBe("boolean");
    });
    it("accepts a combining mark", () => {
        expect(typeof isJSON("e\u0301")).toBe("boolean");
    });
    it("accepts Arabic text", () => {
        expect(typeof isJSON("مرحبا")).toBe("boolean");
    });
    it("accepts CJK text", () => {
        expect(typeof isJSON("你好")).toBe("boolean");
    });
});
