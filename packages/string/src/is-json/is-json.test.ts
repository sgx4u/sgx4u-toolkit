import { describe, expect, it } from "vitest";
import { isJSON } from "./is-json.js";
describe("isJSON", () => {
    it("parses without throwing", () => {
        expect(isJSON("null")).toBe(true);
        expect(isJSON('"a"')).toBe(true);
        expect(isJSON("123")).toBe(true);
        expect(isJSON("")).toBe(false);
        expect(isJSON("{")).toBe(false);
        expect(isJSON(null)).toBe(false);
    });
});
