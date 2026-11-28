import { describe, expect, it } from "vitest";
import { isBIC } from "./is-bic.js";
describe("isBIC", () => {
    it("accepts 8 or 11 characters", () => {
        expect(isBIC("DEUTDEFF")).toBe(true);
        expect(isBIC("DEUTDEFF500")).toBe(true);
        expect(isBIC("nope")).toBe(false);
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(isBIC(null as never)).toBe(false);
    });
    it("accepts an empty string", () => {
        expect(typeof isBIC("")).toBe("boolean");
    });
    it("accepts a family emoji grapheme", () => {
        expect(typeof isBIC("👨‍👩‍👧")).toBe("boolean");
    });
    it("accepts a combining mark", () => {
        expect(typeof isBIC("e\u0301")).toBe("boolean");
    });
    it("accepts Arabic text", () => {
        expect(typeof isBIC("مرحبا")).toBe("boolean");
    });
    it("accepts CJK text", () => {
        expect(typeof isBIC("你好")).toBe("boolean");
    });
});
