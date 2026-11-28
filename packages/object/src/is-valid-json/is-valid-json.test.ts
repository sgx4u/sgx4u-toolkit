import { describe, expect, it } from "vitest";
import { isValidJSON } from "./is-valid-json.js";

describe("isValidJSON", () => {
    it("accepts JSON text", () => {
        expect(isValidJSON("{}")).toBe(true);
        expect(isValidJSON("null")).toBe(true);
        expect(isValidJSON("[1,2]")).toBe(true);
        expect(isValidJSON('"ada"')).toBe(true);
        expect(isValidJSON("0")).toBe(true);
    });

    it("rejects invalid text and non-strings", () => {
        expect(isValidJSON("{")).toBe(false);
        expect(isValidJSON("")).toBe(false);
        expect(isValidJSON("undefined")).toBe(false);
        expect(isValidJSON(1)).toBe(false);
        expect(isValidJSON(null)).toBe(false);
        expect(isValidJSON(undefined)).toBe(false);
        expect(isValidJSON({})).toBe(false);
        expect(isValidJSON([])).toBe(false);
    });

    it("accepts JSON that contains a dangerous key", () => {
        expect(isValidJSON('{"__proto__":{"admin":true},"ok":1}')).toBe(true);
    });
});
