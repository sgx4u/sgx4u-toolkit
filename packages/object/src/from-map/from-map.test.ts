import { describe, expect, it } from "vitest";
import { fromMap } from "./from-map.js";

describe("fromMap", () => {
    it("copies string keys into a plain object", () => {
        expect(
            fromMap(
                new Map<unknown, unknown>([
                    ["id", 1],
                    ["name", "Ada"],
                ]),
            ),
        ).toEqual({ id: 1, name: "Ada" });
    });

    it("keeps symbol keys and skips numbers and dangerous keys", () => {
        const marker = Symbol("id");
        const map = new Map<unknown, unknown>([
            ["ok", 1],
            [1, "number"],
            ["__proto__", { admin: true }],
            ["constructor", "bad"],
            [marker, 2],
            [{}, "object"],
        ]);
        const object = fromMap(map) as Record<PropertyKey, unknown>;
        expect(object.ok).toBe(1);
        expect(object[1]).toBeUndefined();
        expect(Object.hasOwn(object, "__proto__")).toBe(false);
        expect(Object.hasOwn(object, "constructor")).toBe(false);
        expect(object[marker]).toBe(2);
        expect(({} as { admin?: boolean }).admin).toBeUndefined();
    });

    it("returns undefined when the value is not a Map", () => {
        expect(fromMap({})).toBeUndefined();
        expect(fromMap(null)).toBeUndefined();
        expect(fromMap(new WeakMap())).toBeUndefined();
        expect(fromMap([["id", 1]])).toBeUndefined();
    });
});
