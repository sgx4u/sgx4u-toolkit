import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { slugify } from "./slugify.js";

describe("slugify", () => {
    it("builds a lowercase slug and keeps Unicode letters", () => {
        expect(slugify("Café au lait")).toBe("cafe-au-lait");
        expect(slugify("Hello, World!")).toBe("hello-world");
        expect(slugify("  hello  ")).toBe("hello");
        expect(slugify("foo_bar")).toBe("foo-bar");
        expect(slugify("foo--bar")).toBe("foo-bar");
        expect(slugify("123")).toBe("123");
        expect(slugify("")).toBe("");
        expect(slugify("你好，世界")).toBe("你好-世界");
        expect(slugify("नमस्ते")).toBe("नमसत");
    });

    it("accepts a value-only call and an options object", () => {
        expect(slugify({ value: "Hello World", separator: "_" })).toBe(
            "hello_world",
        );
        expect(slugify({ value: "Café", lowerCase: false })).toBe("Cafe");
    });

    it("slices on graphemes and trims a trailing separator", () => {
        expect(slugify({ value: "hello-world", maximumLength: 5 })).toBe(
            "hello",
        );
        expect(slugify({ value: "hello-world", maximumLength: 6 })).toBe(
            "hello",
        );
        expect(slugify({ value: "hello-world", maximumLength: 0 })).toBe("");
        expect(slugify({ value: "你-ab", maximumLength: 1 })).toBe("你");
    });

    it("rejects an empty separator and a negative length", () => {
        expect(() => slugify({ value: "a", separator: "" })).toThrow(
            RangeError,
        );
        expect(() => slugify({ value: "a", maximumLength: -1 })).toThrow(
            RangeError,
        );
        expect(() => slugify({ value: "a", maximumLength: 1.5 })).toThrow(
            RangeError,
        );
        expect(() =>
            slugify({ value: "a", lowerCase: "yes" as never }),
        ).toThrow(TypeError);
        expect(() => slugify({ value: 1 as never, separator: "" })).toThrow(
            RangeError,
        );
    });

    it("returns undefined for a non-string", () => {
        expect(slugify(1 as never)).toBeUndefined();
        expect(slugify({ value: 1 as never })).toBeUndefined();
        expect(slugify({} as never)).toBeUndefined();
    });

    it("is idempotent after the first pass", () => {
        fc.assert(
            fc.property(fc.string({ maxLength: 40 }), (value) => {
                const once = slugify(value);
                expect(slugify(once)).toBe(once);
            }),
            { numRuns: 30 },
        );
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(slugify(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(typeof slugify("")).toBe("string");
    });
    it("accepts a family emoji grapheme", () => {
        expect(typeof slugify("👨‍👩‍👧")).toBe("string");
    });
    it("accepts a combining mark", () => {
        expect(typeof slugify("e\u0301")).toBe("string");
    });
    it("accepts Arabic text", () => {
        expect(typeof slugify("مرحبا")).toBe("string");
    });
    it("accepts CJK text", () => {
        expect(typeof slugify("你好")).toBe("string");
    });
    it("throws when maximumLength is negative", () => {
        expect(() => slugify({ value: "a", maximumLength: -1 })).toThrow(
            RangeError,
        );
    });
    it("throws when separator is empty", () => {
        expect(() => slugify({ value: "a", separator: "" })).toThrow(
            RangeError,
        );
    });
});
