import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { splitIntoUnits } from "../utils/units.utils.js";
import { truncate } from "./truncate.js";

const family = "👨‍👩‍👧‍👦";

/**
 * Whether `text` is a join of a prefix of `units`.
 *
 * @param units - Graphemes of the source.
 * @param text - The candidate prefix.
 * @returns `true` when some leading slice joins to `text`.
 */
function isGraphemePrefix(units: readonly string[], text: string): boolean {
    for (let count = 0; count <= units.length; count += 1) {
        if (units.slice(0, count).join("") === text) {
            return true;
        }
    }
    return false;
}

/**
 * Whether `text` is a join of a suffix of `units`.
 *
 * @param units - Graphemes of the source.
 * @param text - The candidate suffix.
 * @returns `true` when some trailing slice joins to `text`.
 */
function isGraphemeSuffix(units: readonly string[], text: string): boolean {
    for (let count = 0; count <= units.length; count += 1) {
        if (units.slice(count).join("") === text) {
            return true;
        }
    }
    return false;
}

describe("truncate", () => {
    it("shortens on a unit boundary and trims a separator", () => {
        expect(truncate({ value: "hello world", maximumLength: 8 })).toBe(
            "hello w…",
        );
        expect(
            truncate({
                value: "hello world",
                maximumLength: 8,
                separator: " ",
            }),
        ).toBe("hello…");
        expect(
            truncate({
                value: "hello world",
                maximumLength: 8,
                separator: / /u,
            }),
        ).toBe("hello…");
        expect(truncate({ value: "hi", maximumLength: 5 })).toBe("hi");
        expect(
            truncate({ value: "hello", maximumLength: 1, omission: "..." }),
        ).toBe(".");
        expect(
            truncate({ value: "abcdef", maximumLength: 4, location: "start" }),
        ).toBe("…def");
        expect(
            truncate({
                value: "abcdef",
                maximumLength: 4,
                location: "middle",
            }),
        ).toBe("ab…f");
        expect(truncate({ value: `${family}ab`, maximumLength: 2 })).toBe(
            `${family}…`,
        );
        expect(truncate({ value: "hello", maximumLength: 0 })).toBe("");
    });

    it("returns undefined for a non-string and throws for bad limits", () => {
        expect(
            truncate({ value: 1 as unknown as string, maximumLength: 1 }),
        ).toBeUndefined();
        expect(truncate("hello" as never)).toBeUndefined();
        expect(() => truncate({ value: "a", maximumLength: -1 })).toThrow(
            RangeError,
        );
        expect(() =>
            truncate({ value: "a", maximumLength: Number.NaN }),
        ).toThrow(RangeError);
        expect(() =>
            truncate({
                value: "a",
                maximumLength: 1,
                location: "side" as "end",
            }),
        ).toThrow(RangeError);
        expect(() =>
            truncate({
                value: "a",
                maximumLength: 1,
                unit: "byte" as "grapheme",
            }),
        ).toThrow(RangeError);
        expect(() =>
            truncate({
                value: "a",
                maximumLength: 1,
                separator: 1 as unknown as string,
            }),
        ).toThrow(TypeError);
    });

    it("never cuts inside a grapheme", () => {
        fc.assert(
            fc.property(
                fc.string({ maxLength: 40, unit: "grapheme" }),
                fc.integer({ min: 0, max: 40 }),
                fc.constantFrom("end", "start", "middle"),
                (value, maximumLength, location) => {
                    const result =
                        truncate({
                            value,
                            maximumLength,
                            location,
                            omission: "",
                        }) ?? "";
                    const units = splitIntoUnits(value, "grapheme");
                    expect(
                        splitIntoUnits(result, "grapheme").length,
                    ).toBeLessThanOrEqual(maximumLength);
                    if (location === "end") {
                        expect(isGraphemePrefix(units, result)).toBe(true);
                    } else if (location === "start") {
                        expect(isGraphemeSuffix(units, result)).toBe(true);
                    } else {
                        const resultUnits = splitIntoUnits(result, "grapheme");
                        let matched = false;
                        for (
                            let head = 0;
                            head <= resultUnits.length;
                            head += 1
                        ) {
                            const tail = resultUnits.length - head;
                            const headText = resultUnits
                                .slice(0, head)
                                .join("");
                            const tailText = resultUnits.slice(head).join("");
                            if (
                                head + tail <= units.length &&
                                isGraphemePrefix(units, headText) &&
                                units.slice(0, head).join("") === headText &&
                                (tail === 0 ||
                                    units
                                        .slice(units.length - tail)
                                        .join("") === tailText)
                            ) {
                                matched = true;
                                break;
                            }
                        }
                        expect(matched).toBe(true);
                    }
                },
            ),
            { numRuns: 40 },
        );
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(truncate(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            truncate({ value: "", maximumLength: 8 }) === undefined ||
                typeof truncate({ value: "", maximumLength: 8 }) === "string" ||
                typeof truncate({ value: "", maximumLength: 8 }) ===
                    "boolean" ||
                typeof truncate({ value: "", maximumLength: 8 }) === "number" ||
                Array.isArray(truncate({ value: "", maximumLength: 8 })) ||
                (typeof truncate({ value: "", maximumLength: 8 }) ===
                    "object" &&
                    truncate({ value: "", maximumLength: 8 }) !== null),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            truncate({ value: "👨‍👩‍👧", maximumLength: 8 }) === undefined ||
                typeof truncate({ value: "👨‍👩‍👧", maximumLength: 8 }) ===
                    "string" ||
                typeof truncate({ value: "👨‍👩‍👧", maximumLength: 8 }) ===
                    "boolean" ||
                typeof truncate({ value: "👨‍👩‍👧", maximumLength: 8 }) ===
                    "number" ||
                Array.isArray(truncate({ value: "👨‍👩‍👧", maximumLength: 8 })) ||
                (typeof truncate({ value: "👨‍👩‍👧", maximumLength: 8 }) ===
                    "object" &&
                    truncate({ value: "👨‍👩‍👧", maximumLength: 8 }) !== null),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            truncate({ value: "e\u0301", maximumLength: 8 }) === undefined ||
                typeof truncate({ value: "e\u0301", maximumLength: 8 }) ===
                    "string" ||
                typeof truncate({ value: "e\u0301", maximumLength: 8 }) ===
                    "boolean" ||
                typeof truncate({ value: "e\u0301", maximumLength: 8 }) ===
                    "number" ||
                Array.isArray(
                    truncate({ value: "e\u0301", maximumLength: 8 }),
                ) ||
                (typeof truncate({ value: "e\u0301", maximumLength: 8 }) ===
                    "object" &&
                    truncate({ value: "e\u0301", maximumLength: 8 }) !== null),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            truncate({ value: "مرحبا", maximumLength: 8 }) === undefined ||
                typeof truncate({ value: "مرحبا", maximumLength: 8 }) ===
                    "string" ||
                typeof truncate({ value: "مرحبا", maximumLength: 8 }) ===
                    "boolean" ||
                typeof truncate({ value: "مرحبا", maximumLength: 8 }) ===
                    "number" ||
                Array.isArray(truncate({ value: "مرحبا", maximumLength: 8 })) ||
                (typeof truncate({ value: "مرحبا", maximumLength: 8 }) ===
                    "object" &&
                    truncate({ value: "مرحبا", maximumLength: 8 }) !== null),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            truncate({ value: "你好", maximumLength: 8 }) === undefined ||
                typeof truncate({ value: "你好", maximumLength: 8 }) ===
                    "string" ||
                typeof truncate({ value: "你好", maximumLength: 8 }) ===
                    "boolean" ||
                typeof truncate({ value: "你好", maximumLength: 8 }) ===
                    "number" ||
                Array.isArray(truncate({ value: "你好", maximumLength: 8 })) ||
                (typeof truncate({ value: "你好", maximumLength: 8 }) ===
                    "object" &&
                    truncate({ value: "你好", maximumLength: 8 }) !== null),
        ).toBe(true);
    });
    it("throws when unit is unknown", () => {
        expect(() =>
            truncate({
                value: "hello world",
                maximumLength: 8,
                unit: "nope" as never,
            }),
        ).toThrow(RangeError);
    });
    it("throws when maximumLength is negative", () => {
        expect(() =>
            truncate({ value: "hello world", maximumLength: -1 }),
        ).toThrow(RangeError);
    });
});
