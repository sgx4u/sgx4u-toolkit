import { describe, expect, it } from "vitest";
import { mapKeys } from "./map-keys.js";

describe("mapKeys", () => {
    it("replaces keys and lets a later duplicate win", () => {
        expect(
            mapKeys({
                object: { a: 1, b: 2 },
                mapper: () => "same",
            }),
        ).toEqual({ same: 2 });
    });

    it("maps nested plain objects and objects inside arrays", () => {
        const result = mapKeys({
            object: {
                user_name: { first_name: "Ada" },
                items: [{ last_name: "Lovelace" }],
            },
            mapper: (key) => key.toUpperCase(),
            deep: true,
        });

        expect(result).toEqual({
            USER_NAME: { FIRST_NAME: "Ada" },
            ITEMS: [{ LAST_NAME: "Lovelace" }],
        });
    });

    it("passes the original value to the mapper", () => {
        const nested = { n: 1 };
        const seen: unknown[] = [];

        mapKeys({
            object: { box: nested },
            mapper: (key, value) => {
                if (key === "box") {
                    seen.push(value);
                }
                return key;
            },
            deep: true,
        });

        expect(seen).toEqual([nested]);
    });

    it("shares a repeated nested object and keeps a cycle on the copy", () => {
        const shared = { z: 1 };
        const sharedResult = mapKeys({
            object: { a: shared, b: shared },
            mapper: (key) => key.toUpperCase(),
            deep: true,
        }) as { A: object; B: object };

        expect(sharedResult.A).toBe(sharedResult.B);
        expect(sharedResult.A).toEqual({ Z: 1 });
        expect(shared).toEqual({ z: 1 });

        const box: { name: string; self?: object } = { name: "box" };
        box.self = box;
        const cycled = mapKeys({
            object: box,
            mapper: (key) => key,
            deep: true,
        }) as { self: object };

        expect(cycled.self).toBe(cycled);
        expect(box.self).toBe(box);
    });

    it("skips a dangerous mapped key", () => {
        const result = mapKeys({
            object: { a: 1, b: 2 },
            mapper: (key) => (key === "a" ? "__proto__" : key),
        });

        expect(result).toEqual({ b: 2 });
        expect(({} as { polluted?: unknown }).polluted).toBeUndefined();
    });

    it("does not map nested keys when deep is omitted", () => {
        const nested = { first_name: "Ada" };
        const result = mapKeys({
            object: { user_name: nested },
            mapper: (key) => key.toUpperCase(),
        });

        expect(result).toEqual({ USER_NAME: { first_name: "Ada" } });
        expect(result?.USER_NAME).toBe(nested);
    });

    it("throws when mapper is not a function", () => {
        expect(() =>
            mapKeys({
                object: { a: 1 },
                mapper: undefined as unknown as () => string,
            }),
        ).toThrow(TypeError);
    });

    it("returns undefined for null, primitives, and arrays", () => {
        const mapper = (key: string) => key;

        expect(mapKeys({ object: null, mapper })).toBeUndefined();
        expect(mapKeys({ object: 1, mapper })).toBeUndefined();
        expect(mapKeys({ object: [], mapper })).toBeUndefined();
    });
});
