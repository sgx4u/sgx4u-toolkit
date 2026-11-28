import { describe, expect, it } from "vitest";
import { escapeMarkdown } from "./escape-markdown.js";
describe("escapeMarkdown", () => {
    it("escapes markup punctuation", () => {
        expect(escapeMarkdown("*hi*")).toBe("\\*hi\\*");
        expect(escapeMarkdown("a_b")).toBe("a\\_b");
        expect(escapeMarkdown(null)).toBeUndefined();
    });
});
