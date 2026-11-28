import { describe, expect, it } from "vitest";
import { matches } from "./matches.js";
describe("matches", () => {
    it("tests a literal or a regular expression", () => {
        expect(matches({ value: "hello", pattern: "ell" })).toBe(true);
        expect(matches({ value: "hello", pattern: /h.llo/u })).toBe(true);
        expect(matches({ value: 1 as never, pattern: "a" })).toBe(false);
        expect(() => matches({ value: "a", pattern: 1 as never })).toThrow(
            TypeError,
        );
        const expression = /a/g;
        expression.lastIndex = 1;
        expect(matches({ value: "a", pattern: expression })).toBe(true);
        expect(expression.lastIndex).toBe(1);
    });
});
