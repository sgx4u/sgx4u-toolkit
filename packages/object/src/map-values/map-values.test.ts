import { describe, expect, it } from "vitest";
import { mapValues } from "./map-values.js";

describe("mapValues", () => {
    it("maps values and, when deep, maps children first", () => {
        const result = mapValues({
            object: { a: 1, b: { c: 2 }, items: [{ n: 3 }, 4] },
            mapper: (value) => (typeof value === "number" ? value * 2 : value),
            deep: true,
        });

        expect(result).toEqual({ a: 2, b: { c: 4 }, items: [{ n: 6 }, 4] });
    });

    it("calls the mapper with the value, key, and source object", () => {
        const source = { a: 1 };
        const seen: unknown[] = [];

        mapValues({
            object: source,
            mapper: (value, key, object) => {
                seen.push(value, key, object);
                return value;
            },
        });

        expect(seen).toEqual([1, "a", source]);
    });

    it("does not mutate the input", () => {
        const input = { a: 1, b: { c: 2 } };
        const result = mapValues({
            object: input,
            mapper: (value) => (typeof value === "number" ? value + 1 : value),
            deep: true,
        });

        expect(result).toEqual({ a: 2, b: { c: 3 } });
        expect(input).toEqual({ a: 1, b: { c: 2 } });
    });

    it("leaves nested values in place when deep is false", () => {
        const nested = { c: 2 };
        const result = mapValues({
            object: { a: nested },
            mapper: (value) => value,
        });

        expect(result?.a).toBe(nested);
    });

    it("throws when mapper is not a function", () => {
        expect(() =>
            mapValues({
                object: { a: 1 },
                mapper: null as unknown as () => unknown,
            }),
        ).toThrow(TypeError);
    });

    it("keeps an array hole and points a cycle at the copy", () => {
        const items: ({ n: number } | undefined)[] = [];
        items[0] = { n: 1 };
        items[2] = { n: 2 };
        const result = mapValues({
            object: { items },
            mapper: (value) => value,
            deep: true,
        }) as { items: unknown[] };

        expect(result.items[0]).toEqual({ n: 1 });
        expect(Object.hasOwn(result.items, 1)).toBe(false);
        expect(result.items[2]).toEqual({ n: 2 });

        const box: { n: number; self?: object } = { n: 1 };
        box.self = box;
        const cycled = mapValues({
            object: box,
            mapper: (value) => value,
            deep: true,
        }) as { self: object };

        expect(cycled.self).toBe(cycled);
    });

    it("returns undefined for a non-object", () => {
        const mapper = (value: unknown) => value;

        expect(mapValues({ object: "nope", mapper })).toBeUndefined();
        expect(mapValues({ object: [], mapper })).toBeUndefined();
    });
});
