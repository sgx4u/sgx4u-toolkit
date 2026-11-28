import { describe, expect, it } from "vitest";
import { stripHTMLTags } from "./strip-html-tags.js";
describe("stripHTMLTags", () => {
    it("removes tags and can keep an allowed tag", () => {
        expect(stripHTMLTags("<b>hi</b>")).toBe("hi");
        expect(stripHTMLTags({ value: "<b>hi</b>", allowedTags: ["b"] })).toBe(
            "<b>hi</b>",
        );
        expect(stripHTMLTags("<script>alert(1)</script>")).toBe("alert(1)");
        expect(stripHTMLTags("<!--x-->hi")).toBe("hi");
        expect(stripHTMLTags(null as unknown as string)).toBeUndefined();
    });
});
