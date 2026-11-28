import { describe, expect, it } from "vitest";
import { toMap } from "./to-map.js";

describe("toMap", () => {
    it("copies own enumerable string keys in insertion order", () => {
        const map = toMap({ b: 1, a: 2 });
        expect(map).toBeInstanceOf(Map);
        expect([...(map ?? [])]).toEqual([
            ["b", 1],
            ["a", 2],
        ]);
    });

    it("does not copy symbol keys", () => {
        const marker = Symbol("id");
        const map = toMap({ id: 1, [marker]: 2 });
        expect(map?.size).toBe(1);
        expect(map?.get("id")).toBe(1);
    });

    it("copies array indexes as strings", () => {
        expect([...(toMap(["a", "b"]) ?? [])]).toEqual([
            ["0", "a"],
            ["1", "b"],
        ]);
    });

    it("returns undefined when the value is not object-like", () => {
        expect(toMap(null)).toBeUndefined();
        expect(toMap("ada")).toBeUndefined();
        expect(toMap(1)).toBeUndefined();
        expect(toMap(undefined)).toBeUndefined();
    });
});
