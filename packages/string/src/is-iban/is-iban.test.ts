import { describe, expect, it } from "vitest";
import { isIBAN } from "./is-iban.js";
describe("isIBAN", () => {
    it("checks published examples", () => {
        expect(isIBAN("GB82WEST12345698765432")).toBe(true);
        expect(isIBAN("DE89370400440532013000")).toBe(true);
        expect(isIBAN("GB82WEST12345698765433")).toBe(false);
        expect(isIBAN("XX00")).toBe(false);
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(isIBAN(null as never)).toBe(false);
    });
    it("accepts an empty string", () => {
        expect(typeof isIBAN("")).toBe("boolean");
    });
    it("accepts a family emoji grapheme", () => {
        expect(typeof isIBAN("👨‍👩‍👧")).toBe("boolean");
    });
    it("accepts a combining mark", () => {
        expect(typeof isIBAN("e\u0301")).toBe("boolean");
    });
    it("accepts Arabic text", () => {
        expect(typeof isIBAN("مرحبا")).toBe("boolean");
    });
    it("accepts CJK text", () => {
        expect(typeof isIBAN("你好")).toBe("boolean");
    });
});
