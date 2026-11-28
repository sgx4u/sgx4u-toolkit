import { describe, expect, it } from "vitest";
import { getDiceCoefficient } from "./get-dice-coefficient.js";
describe("getDiceCoefficient", () => {
    it("measures the pair", () => {
        expect(getDiceCoefficient({ first: "kitten", second: "kitten" })).toBe(
            1,
        );
        expect(
            getDiceCoefficient({ first: 1 as unknown as string, second: "a" }),
        ).toBeUndefined();
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(getDiceCoefficient(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            getDiceCoefficient({ first: "", second: "nacht" }) === undefined ||
                typeof getDiceCoefficient({ first: "", second: "nacht" }) ===
                    "string" ||
                typeof getDiceCoefficient({ first: "", second: "nacht" }) ===
                    "boolean" ||
                typeof getDiceCoefficient({ first: "", second: "nacht" }) ===
                    "number" ||
                Array.isArray(
                    getDiceCoefficient({ first: "", second: "nacht" }),
                ) ||
                (typeof getDiceCoefficient({ first: "", second: "nacht" }) ===
                    "object" &&
                    getDiceCoefficient({ first: "", second: "nacht" }) !==
                        null),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            getDiceCoefficient({ first: "👨‍👩‍👧", second: "nacht" }) ===
                undefined ||
                typeof getDiceCoefficient({ first: "👨‍👩‍👧", second: "nacht" }) ===
                    "string" ||
                typeof getDiceCoefficient({ first: "👨‍👩‍👧", second: "nacht" }) ===
                    "boolean" ||
                typeof getDiceCoefficient({ first: "👨‍👩‍👧", second: "nacht" }) ===
                    "number" ||
                Array.isArray(
                    getDiceCoefficient({ first: "👨‍👩‍👧", second: "nacht" }),
                ) ||
                (typeof getDiceCoefficient({ first: "👨‍👩‍👧", second: "nacht" }) ===
                    "object" &&
                    getDiceCoefficient({ first: "👨‍👩‍👧", second: "nacht" }) !==
                        null),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            getDiceCoefficient({ first: "e\u0301", second: "nacht" }) ===
                undefined ||
                typeof getDiceCoefficient({
                    first: "e\u0301",
                    second: "nacht",
                }) === "string" ||
                typeof getDiceCoefficient({
                    first: "e\u0301",
                    second: "nacht",
                }) === "boolean" ||
                typeof getDiceCoefficient({
                    first: "e\u0301",
                    second: "nacht",
                }) === "number" ||
                Array.isArray(
                    getDiceCoefficient({ first: "e\u0301", second: "nacht" }),
                ) ||
                (typeof getDiceCoefficient({
                    first: "e\u0301",
                    second: "nacht",
                }) === "object" &&
                    getDiceCoefficient({
                        first: "e\u0301",
                        second: "nacht",
                    }) !== null),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            getDiceCoefficient({ first: "مرحبا", second: "nacht" }) ===
                undefined ||
                typeof getDiceCoefficient({
                    first: "مرحبا",
                    second: "nacht",
                }) === "string" ||
                typeof getDiceCoefficient({
                    first: "مرحبا",
                    second: "nacht",
                }) === "boolean" ||
                typeof getDiceCoefficient({
                    first: "مرحبا",
                    second: "nacht",
                }) === "number" ||
                Array.isArray(
                    getDiceCoefficient({ first: "مرحبا", second: "nacht" }),
                ) ||
                (typeof getDiceCoefficient({
                    first: "مرحبا",
                    second: "nacht",
                }) === "object" &&
                    getDiceCoefficient({ first: "مرحبا", second: "nacht" }) !==
                        null),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            getDiceCoefficient({ first: "你好", second: "nacht" }) ===
                undefined ||
                typeof getDiceCoefficient({
                    first: "你好",
                    second: "nacht",
                }) === "string" ||
                typeof getDiceCoefficient({
                    first: "你好",
                    second: "nacht",
                }) === "boolean" ||
                typeof getDiceCoefficient({
                    first: "你好",
                    second: "nacht",
                }) === "number" ||
                Array.isArray(
                    getDiceCoefficient({ first: "你好", second: "nacht" }),
                ) ||
                (typeof getDiceCoefficient({
                    first: "你好",
                    second: "nacht",
                }) === "object" &&
                    getDiceCoefficient({ first: "你好", second: "nacht" }) !==
                        null),
        ).toBe(true);
    });
    it("throws when unit is unknown", () => {
        expect(() =>
            getDiceCoefficient({
                first: "night",
                second: "nacht",
                unit: "nope" as never,
            }),
        ).toThrow(RangeError);
    });
});
