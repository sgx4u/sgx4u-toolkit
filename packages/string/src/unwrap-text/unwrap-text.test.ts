import { describe, expect, it } from "vitest";
import { unwrapText } from "./unwrap-text.js";
describe("unwrapText", () => {
    it("joins lines and keeps paragraph breaks", () => {
        expect(unwrapText("hello\nworld")).toBe("hello world");
        expect(unwrapText("hello\n\nworld")).toBe("hello\n\nworld");
        expect(unwrapText("hello\r\nworld")).toBe("hello world");
        expect(unwrapText("hello\n \nworld")).toBe("hello\n\nworld");
        expect(unwrapText(null)).toBeUndefined();
    });
});
