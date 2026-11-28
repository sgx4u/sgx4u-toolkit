import { describe, expect, it } from "vitest";
import { mapEntries, mapSkip } from "./map-entries.js";

describe("mapEntries", () => {
    it("replaces entries and drops mapSkip", () => {
        expect(
            mapEntries({
                object: { a: 1, b: 2 },
                mapper: (key, value) =>
                    key === "a" ? mapSkip : [key.toUpperCase(), value],
            }),
        ).toEqual({ B: 2 });
    });

    it("maps nested objects before the parent mapper sees them", () => {
        const result = mapEntries({
            object: { box: { n: 1 }, items: [{ n: 2 }] },
            mapper: (key, value) => [key, value],
            deep: true,
        });

        expect(result).toEqual({ box: { n: 1 }, items: [{ n: 2 }] });
        expect(result?.box).not.toBeUndefined();
    });

    it("lets a later duplicate key win and skips a dangerous key", () => {
        expect(
            mapEntries({
                object: { a: 1, b: 2, c: 3 },
                mapper: (key, value) => {
                    if (key === "a") {
                        return ["__proto__", value];
                    }
                    return ["same", value];
                },
            }),
        ).toEqual({ same: 3 });
        expect(({} as { polluted?: unknown }).polluted).toBeUndefined();
    });

    it("throws when mapper returns neither a pair nor mapSkip", () => {
        expect(() =>
            mapEntries({
                object: { a: 1 },
                mapper: () => "nope" as unknown as readonly [string, unknown],
            }),
        ).toThrow(TypeError);
    });

    it("throws when mapper is not a function", () => {
        expect(() =>
            mapEntries({
                object: { a: 1 },
                mapper: 1 as unknown as () => readonly [string, unknown],
            }),
        ).toThrow(TypeError);
    });

    it("returns undefined for an array root", () => {
        expect(
            mapEntries({
                object: [],
                mapper: (key, value) => [key, value],
            }),
        ).toBeUndefined();
    });
});
