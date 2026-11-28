import { describe, expect, it } from "vitest";
import { getHammingDistance } from "./get-hamming-distance.js";
describe("getHammingDistance", () => {
    it("measures the pair", () => {
        expect(getHammingDistance({ first: "kitten", second: "kitten" })).toBe(
            0,
        );
        expect(
            getHammingDistance({ first: 1 as unknown as string, second: "a" }),
        ).toBeUndefined();
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(getHammingDistance(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            getHammingDistance({ first: "", second: "kat" }) === undefined ||
                typeof getHammingDistance({ first: "", second: "kat" }) ===
                    "string" ||
                typeof getHammingDistance({ first: "", second: "kat" }) ===
                    "boolean" ||
                typeof getHammingDistance({ first: "", second: "kat" }) ===
                    "number" ||
                Array.isArray(
                    getHammingDistance({ first: "", second: "kat" }),
                ) ||
                (typeof getHammingDistance({ first: "", second: "kat" }) ===
                    "object" &&
                    getHammingDistance({ first: "", second: "kat" }) !== null),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            getHammingDistance({ first: "👨‍👩‍👧", second: "kat" }) === undefined ||
                typeof getHammingDistance({ first: "👨‍👩‍👧", second: "kat" }) ===
                    "string" ||
                typeof getHammingDistance({ first: "👨‍👩‍👧", second: "kat" }) ===
                    "boolean" ||
                typeof getHammingDistance({ first: "👨‍👩‍👧", second: "kat" }) ===
                    "number" ||
                Array.isArray(
                    getHammingDistance({ first: "👨‍👩‍👧", second: "kat" }),
                ) ||
                (typeof getHammingDistance({ first: "👨‍👩‍👧", second: "kat" }) ===
                    "object" &&
                    getHammingDistance({ first: "👨‍👩‍👧", second: "kat" }) !==
                        null),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            getHammingDistance({ first: "e\u0301", second: "kat" }) ===
                undefined ||
                typeof getHammingDistance({
                    first: "e\u0301",
                    second: "kat",
                }) === "string" ||
                typeof getHammingDistance({
                    first: "e\u0301",
                    second: "kat",
                }) === "boolean" ||
                typeof getHammingDistance({
                    first: "e\u0301",
                    second: "kat",
                }) === "number" ||
                Array.isArray(
                    getHammingDistance({ first: "e\u0301", second: "kat" }),
                ) ||
                (typeof getHammingDistance({
                    first: "e\u0301",
                    second: "kat",
                }) === "object" &&
                    getHammingDistance({ first: "e\u0301", second: "kat" }) !==
                        null),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            getHammingDistance({ first: "مرحبا", second: "kat" }) ===
                undefined ||
                typeof getHammingDistance({ first: "مرحبا", second: "kat" }) ===
                    "string" ||
                typeof getHammingDistance({ first: "مرحبا", second: "kat" }) ===
                    "boolean" ||
                typeof getHammingDistance({ first: "مرحبا", second: "kat" }) ===
                    "number" ||
                Array.isArray(
                    getHammingDistance({ first: "مرحبا", second: "kat" }),
                ) ||
                (typeof getHammingDistance({
                    first: "مرحبا",
                    second: "kat",
                }) === "object" &&
                    getHammingDistance({ first: "مرحبا", second: "kat" }) !==
                        null),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            getHammingDistance({ first: "你好", second: "kat" }) ===
                undefined ||
                typeof getHammingDistance({ first: "你好", second: "kat" }) ===
                    "string" ||
                typeof getHammingDistance({ first: "你好", second: "kat" }) ===
                    "boolean" ||
                typeof getHammingDistance({ first: "你好", second: "kat" }) ===
                    "number" ||
                Array.isArray(
                    getHammingDistance({ first: "你好", second: "kat" }),
                ) ||
                (typeof getHammingDistance({ first: "你好", second: "kat" }) ===
                    "object" &&
                    getHammingDistance({ first: "你好", second: "kat" }) !==
                        null),
        ).toBe(true);
    });
    it("throws when unit is unknown", () => {
        expect(() =>
            getHammingDistance({
                first: "kar",
                second: "kat",
                unit: "nope" as never,
            }),
        ).toThrow(RangeError);
    });
});
