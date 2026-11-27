import { describe, expect, it } from "vitest";
import { isMap } from "./is-map.js";

describe("isMap", () => {
    it("accepts a Map and rejects a lookalike", () => {
        expect(isMap(new Map())).toBe(true);
        expect(isMap(new Set())).toBe(false);
        expect(isMap({ get: () => 1 })).toBe(false);
        expect(isMap(null)).toBe(false);
    });
});
