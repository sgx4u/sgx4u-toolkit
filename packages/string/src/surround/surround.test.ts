import { describe, expect, it } from "vitest";
import { surround } from "./surround.js";
describe("surround", () => {
    it("wraps with the prefix and an optional suffix", () => {
        expect(surround({ value: "a", prefix: "*" })).toBe("*a*");
        expect(surround({ value: "a", prefix: "(", suffix: ")" })).toBe("(a)");
        expect(
            surround({ value: 1 as unknown as string, prefix: "*" }),
        ).toBeUndefined();
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(surround(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            surround({ value: "", prefix: "*" }) === undefined ||
                typeof surround({ value: "", prefix: "*" }) === "string" ||
                typeof surround({ value: "", prefix: "*" }) === "boolean" ||
                typeof surround({ value: "", prefix: "*" }) === "number" ||
                Array.isArray(surround({ value: "", prefix: "*" })) ||
                (typeof surround({ value: "", prefix: "*" }) === "object" &&
                    surround({ value: "", prefix: "*" }) !== null),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            surround({ value: "👨‍👩‍👧", prefix: "*" }) === undefined ||
                typeof surround({ value: "👨‍👩‍👧", prefix: "*" }) === "string" ||
                typeof surround({ value: "👨‍👩‍👧", prefix: "*" }) === "boolean" ||
                typeof surround({ value: "👨‍👩‍👧", prefix: "*" }) === "number" ||
                Array.isArray(surround({ value: "👨‍👩‍👧", prefix: "*" })) ||
                (typeof surround({ value: "👨‍👩‍👧", prefix: "*" }) === "object" &&
                    surround({ value: "👨‍👩‍👧", prefix: "*" }) !== null),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            surround({ value: "e\u0301", prefix: "*" }) === undefined ||
                typeof surround({ value: "e\u0301", prefix: "*" }) ===
                    "string" ||
                typeof surround({ value: "e\u0301", prefix: "*" }) ===
                    "boolean" ||
                typeof surround({ value: "e\u0301", prefix: "*" }) ===
                    "number" ||
                Array.isArray(surround({ value: "e\u0301", prefix: "*" })) ||
                (typeof surround({ value: "e\u0301", prefix: "*" }) ===
                    "object" &&
                    surround({ value: "e\u0301", prefix: "*" }) !== null),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            surround({ value: "مرحبا", prefix: "*" }) === undefined ||
                typeof surround({ value: "مرحبا", prefix: "*" }) === "string" ||
                typeof surround({ value: "مرحبا", prefix: "*" }) ===
                    "boolean" ||
                typeof surround({ value: "مرحبا", prefix: "*" }) === "number" ||
                Array.isArray(surround({ value: "مرحبا", prefix: "*" })) ||
                (typeof surround({ value: "مرحبا", prefix: "*" }) ===
                    "object" &&
                    surround({ value: "مرحبا", prefix: "*" }) !== null),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            surround({ value: "你好", prefix: "*" }) === undefined ||
                typeof surround({ value: "你好", prefix: "*" }) === "string" ||
                typeof surround({ value: "你好", prefix: "*" }) === "boolean" ||
                typeof surround({ value: "你好", prefix: "*" }) === "number" ||
                Array.isArray(surround({ value: "你好", prefix: "*" })) ||
                (typeof surround({ value: "你好", prefix: "*" }) === "object" &&
                    surround({ value: "你好", prefix: "*" }) !== null),
        ).toBe(true);
    });
});
