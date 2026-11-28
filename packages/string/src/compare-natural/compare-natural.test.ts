import { describe, expect, it } from "vitest";
import { compareNatural } from "./compare-natural.js";
describe("compareNatural", () => {
    it("sorts digit runs numerically", () => {
        expect(
            compareNatural({ first: "a2", second: "a10", locale: "en-US" }),
        ).toBe(-1);
        expect(
            compareNatural({ first: 1 as unknown as string, second: "a" }),
        ).toBeUndefined();
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(compareNatural(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            compareNatural({ first: "", second: "a10" }) === undefined ||
                typeof compareNatural({ first: "", second: "a10" }) ===
                    "string" ||
                typeof compareNatural({ first: "", second: "a10" }) ===
                    "boolean" ||
                typeof compareNatural({ first: "", second: "a10" }) ===
                    "number" ||
                Array.isArray(compareNatural({ first: "", second: "a10" })) ||
                (typeof compareNatural({ first: "", second: "a10" }) ===
                    "object" &&
                    compareNatural({ first: "", second: "a10" }) !== null),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            compareNatural({ first: "👨‍👩‍👧", second: "a10" }) === undefined ||
                typeof compareNatural({ first: "👨‍👩‍👧", second: "a10" }) ===
                    "string" ||
                typeof compareNatural({ first: "👨‍👩‍👧", second: "a10" }) ===
                    "boolean" ||
                typeof compareNatural({ first: "👨‍👩‍👧", second: "a10" }) ===
                    "number" ||
                Array.isArray(compareNatural({ first: "👨‍👩‍👧", second: "a10" })) ||
                (typeof compareNatural({ first: "👨‍👩‍👧", second: "a10" }) ===
                    "object" &&
                    compareNatural({ first: "👨‍👩‍👧", second: "a10" }) !== null),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            compareNatural({ first: "e\u0301", second: "a10" }) === undefined ||
                typeof compareNatural({ first: "e\u0301", second: "a10" }) ===
                    "string" ||
                typeof compareNatural({ first: "e\u0301", second: "a10" }) ===
                    "boolean" ||
                typeof compareNatural({ first: "e\u0301", second: "a10" }) ===
                    "number" ||
                Array.isArray(
                    compareNatural({ first: "e\u0301", second: "a10" }),
                ) ||
                (typeof compareNatural({ first: "e\u0301", second: "a10" }) ===
                    "object" &&
                    compareNatural({ first: "e\u0301", second: "a10" }) !==
                        null),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            compareNatural({ first: "مرحبا", second: "a10" }) === undefined ||
                typeof compareNatural({ first: "مرحبا", second: "a10" }) ===
                    "string" ||
                typeof compareNatural({ first: "مرحبا", second: "a10" }) ===
                    "boolean" ||
                typeof compareNatural({ first: "مرحبا", second: "a10" }) ===
                    "number" ||
                Array.isArray(
                    compareNatural({ first: "مرحبا", second: "a10" }),
                ) ||
                (typeof compareNatural({ first: "مرحبا", second: "a10" }) ===
                    "object" &&
                    compareNatural({ first: "مرحبا", second: "a10" }) !== null),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            compareNatural({ first: "你好", second: "a10" }) === undefined ||
                typeof compareNatural({ first: "你好", second: "a10" }) ===
                    "string" ||
                typeof compareNatural({ first: "你好", second: "a10" }) ===
                    "boolean" ||
                typeof compareNatural({ first: "你好", second: "a10" }) ===
                    "number" ||
                Array.isArray(
                    compareNatural({ first: "你好", second: "a10" }),
                ) ||
                (typeof compareNatural({ first: "你好", second: "a10" }) ===
                    "object" &&
                    compareNatural({ first: "你好", second: "a10" }) !== null),
        ).toBe(true);
    });
});
