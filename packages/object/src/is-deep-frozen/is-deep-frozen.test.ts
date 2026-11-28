import { describe, expect, it } from "vitest";
import { isDeepFrozen } from "./is-deep-frozen.js";

describe("isDeepFrozen", () => {
    it("walks nested objects, maps, and cycles", () => {
        expect(isDeepFrozen(1)).toBe(true);
        expect(isDeepFrozen(null)).toBe(true);
        expect(isDeepFrozen("a")).toBe(true);
        expect(isDeepFrozen(() => undefined)).toBe(false);
        const nested = Object.freeze({ child: { id: 1 } });
        expect(isDeepFrozen(nested)).toBe(false);
        const frozen = Object.freeze({ child: Object.freeze({ id: 1 }) });
        expect(isDeepFrozen(frozen)).toBe(true);
        const cycle: { self?: object } = {};
        cycle.self = cycle;
        Object.freeze(cycle);
        expect(isDeepFrozen(cycle)).toBe(true);
        const map = new Map([[{ id: 1 }, { id: 2 }]]);
        Object.freeze(map);
        expect(isDeepFrozen(map)).toBe(false);
        const set = new Set([Object.freeze({ id: 1 })]);
        Object.freeze(set);
        expect(isDeepFrozen(set)).toBe(true);
    });
});
