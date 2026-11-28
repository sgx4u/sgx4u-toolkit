import { describe, expect, it } from "vitest";
import { stripHTMLTags } from "./strip-html-tags.js";
describe("stripHTMLTags", () => {
    it("removes tags and can keep an allowed tag", () => {
        expect(stripHTMLTags("<b>hi</b>")).toBe("hi");
        expect(stripHTMLTags({ value: "<b>hi</b>", allowedTags: ["b"] })).toBe(
            "<b>hi</b>",
        );
        expect(stripHTMLTags("<script>alert(1)</script>")).toBe("alert(1)");
        expect(stripHTMLTags("<!--x-->hi")).toBe("hi");
        expect(stripHTMLTags(null as unknown as string)).toBeUndefined();
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(stripHTMLTags(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(typeof stripHTMLTags("")).toBe("string");
    });
    it("accepts a family emoji grapheme", () => {
        expect(typeof stripHTMLTags("👨‍👩‍👧")).toBe("string");
    });
    it("accepts a combining mark", () => {
        expect(typeof stripHTMLTags("e\u0301")).toBe("string");
    });
    it("accepts Arabic text", () => {
        expect(typeof stripHTMLTags("مرحبا")).toBe("string");
    });
    it("accepts CJK text", () => {
        expect(typeof stripHTMLTags("你好")).toBe("string");
    });
});
