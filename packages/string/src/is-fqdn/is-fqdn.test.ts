import { describe, expect, it } from "vitest";
import { isFQDN } from "./is-fqdn.js";
describe("isFQDN", () => {
    it("accepts hostnames", () => {
        expect(isFQDN("example.com")).toBe(true);
        expect(isFQDN("localhost")).toBe(false);
        expect(
            isFQDN({ value: "localhost", requireTopLevelDomain: false }),
        ).toBe(true);
        expect(isFQDN("https://example.com")).toBe(false);
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(isFQDN(null as never)).toBe(false);
    });
    it("accepts an empty string", () => {
        expect(typeof isFQDN("")).toBe("boolean");
    });
    it("accepts a family emoji grapheme", () => {
        expect(typeof isFQDN("👨‍👩‍👧")).toBe("boolean");
    });
    it("accepts a combining mark", () => {
        expect(typeof isFQDN("e\u0301")).toBe("boolean");
    });
    it("accepts Arabic text", () => {
        expect(typeof isFQDN("مرحبا")).toBe("boolean");
    });
    it("accepts CJK text", () => {
        expect(typeof isFQDN("你好")).toBe("boolean");
    });
});
