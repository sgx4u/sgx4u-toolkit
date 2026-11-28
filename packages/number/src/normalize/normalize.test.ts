import { describe, expect, it } from "vitest";
import { normalize } from "../index.js";

describe("normalize", () => {
    it("covers the documented behavior", () => {
        expect(normalize({ value: 5, start: 0, end: 10 })).toBe(0.5);
        expect(normalize({ value: 2, start: 2, end: 2 })).toBe(0);
        expect(normalize({ value: 3, start: 2, end: 2 })).toBeUndefined();
    });
});
