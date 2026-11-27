import { describe, expect, it } from "vitest";
import { hasCircularReference } from "./has-circular-reference.js";

describe("hasCircularReference", () => {
    it("finds ancestor cycles and ignores shared references", () => {
        expect(hasCircularReference(1)).toBe(false);
        expect(hasCircularReference(null)).toBe(false);
        const shared = { n: 1 };
        expect(hasCircularReference({ a: shared, b: shared })).toBe(false);
        const cycle: { self?: object } = {};
        cycle.self = cycle;
        expect(hasCircularReference(cycle)).toBe(true);
        const items: unknown[] = [];
        items.push(items);
        expect(hasCircularReference(items)).toBe(true);
        const map = new Map();
        map.set("self", map);
        expect(hasCircularReference(map)).toBe(true);
        const set = new Set();
        set.add(set);
        expect(hasCircularReference(set)).toBe(true);
        const error = new Error("boom", { cause: null });
        error.cause = error;
        expect(hasCircularReference(error)).toBe(true);
    });
});
