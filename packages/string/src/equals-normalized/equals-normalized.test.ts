import { describe, expect, it } from "vitest";
import { equalsNormalized } from "./equals-normalized.js";
describe("equalsNormalized", () => {
    it("normalizes before comparing", () => {
        expect(equalsNormalized({ first: "é", second: "e\u0301" })).toBe(true);
        expect(equalsNormalized({ first: "a", second: "b" })).toBe(false);
        expect(
            equalsNormalized({ first: 1 as unknown as string, second: "a" }),
        ).toBe(false);
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(equalsNormalized(null as never)).toBe(false);
    });
    it("accepts an empty string", () => {
        expect(typeof equalsNormalized({ first: "", second: "e\u0301" })).toBe(
            "boolean",
        );
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            typeof equalsNormalized({ first: "👨‍👩‍👧", second: "e\u0301" }),
        ).toBe("boolean");
    });
    it("accepts a combining mark", () => {
        expect(
            typeof equalsNormalized({ first: "e\u0301", second: "e\u0301" }),
        ).toBe("boolean");
    });
    it("accepts Arabic text", () => {
        expect(
            typeof equalsNormalized({ first: "مرحبا", second: "e\u0301" }),
        ).toBe("boolean");
    });
    it("accepts CJK text", () => {
        expect(
            typeof equalsNormalized({ first: "你好", second: "e\u0301" }),
        ).toBe("boolean");
    });
});
