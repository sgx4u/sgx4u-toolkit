import { describe, expect, it } from "vitest";
import { fromWords } from "../../en-IN.js";

describe("fromWords en-IN", () => {
    it("covers the documented behavior", () => {
        expect(fromWords({ value: "zero" })).toBe(0);
        expect(fromWords({ value: "minus three" })).toBe(-3);
        expect(fromWords({ value: "one point five" })).toBe(1.5);
        expect(fromWords({ value: "twenty-first" })).toBe(21);
        expect(fromWords({ value: "not a number" })).toBeUndefined();
    });
});
