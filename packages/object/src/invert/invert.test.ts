import { describe, expect, it } from "vitest";
import { invert } from "./invert.js";

describe("invert", () => {
    it("swaps keys and values, and the last duplicate wins", () => {
        expect(invert({ a: 1, b: 1, c: 2 })).toEqual({ "1": "b", "2": "c" });
        expect(Object.keys(invert({ a: 1, b: 1, c: 2 }) ?? {})).toEqual([
            "1",
            "2",
        ]);
    });

    it("keeps the earliest key when duplicateValues is first", () => {
        expect(
            invert({ object: { a: 1, b: 1, c: 2 }, duplicateValues: "first" }),
        ).toEqual({ "1": "a", "2": "c" });
    });

    it("groups keys when duplicateValues is array", () => {
        const grouped = invert({
            object: { a: 1, b: 1, c: 2 },
            duplicateValues: "array",
        });

        expect(grouped).toEqual({ "1": ["a", "b"], "2": ["c"] });
    });

    it("throws when duplicateValues is throw and a key repeats", () => {
        expect(() =>
            invert({ object: { a: 1, b: 1 }, duplicateValues: "throw" }),
        ).toThrow(RangeError);
    });

    it("stringifies values that are not property keys", () => {
        expect(invert({ a: true, b: false, c: null })).toEqual({
            true: "a",
            false: "b",
            null: "c",
        });
    });

    it("uses a symbol value as a symbol key", () => {
        const symbol = Symbol("id");
        const result = invert({ a: symbol });

        expect(result).toBeDefined();
        expect(Object.getOwnPropertySymbols(result as object)).toEqual([
            symbol,
        ]);
        expect((result as Record<symbol, string>)[symbol]).toBe("a");
    });

    it("skips a dangerous inverted key", () => {
        const result = invert({ a: "__proto__", b: "ok" });

        expect(result).toEqual({ ok: "b" });
        expect(Object.getPrototypeOf(result)).toBe(Object.prototype);
        expect(({} as { a?: unknown }).a).toBeUndefined();
    });

    it("preserves a null prototype and does not mutate the input", () => {
        const source = Object.create(null) as Record<string, string>;
        source.a = "id";
        const result = invert(source);

        expect(result).toEqual({ id: "a" });
        expect(Object.getPrototypeOf(result)).toBeNull();
        expect(source).toEqual({ a: "id" });
    });

    it("returns undefined for null, primitives, and arrays", () => {
        expect(invert(null as unknown as object)).toBeUndefined();
        expect(invert("id" as unknown as object)).toBeUndefined();
        expect(invert([1, 2])).toBeUndefined();
        expect(invert({ object: [1, 2] })).toBeUndefined();
    });

    it("throws when duplicateValues is unknown", () => {
        expect(() =>
            invert({
                object: { a: 1 },
                duplicateValues: "middle" as "last",
            }),
        ).toThrow(RangeError);
    });
});
