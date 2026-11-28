import { describe, expect, it } from "vitest";
import { escapeJavaScriptString } from "./escape-javascript-string.js";
describe("escapeJavaScriptString", () => {
    it("escapes quotes and controls", () => {
        expect(escapeJavaScriptString('a"b')).toBe('a\\"b');
        expect(escapeJavaScriptString("a\nb")).toBe("a\\nb");
        expect(escapeJavaScriptString("\u2028")).toBe("\\u2028");
        expect(escapeJavaScriptString(null)).toBeUndefined();
    });
});
