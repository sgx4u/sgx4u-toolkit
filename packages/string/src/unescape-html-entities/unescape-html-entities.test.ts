import { describe, expect, it } from "vitest";
import { unescapeHTMLEntities } from "./unescape-html-entities.js";

describe("unescapeHTMLEntities", () => {
    it("decodes names and numeric references", () => {
        expect(unescapeHTMLEntities("&amp;")).toBe("&");
        expect(unescapeHTMLEntities("&amp")).toBe("&");
        expect(unescapeHTMLEntities("&#60;")).toBe("<");
        expect(unescapeHTMLEntities("&#x3C;")).toBe("<");
        expect(unescapeHTMLEntities("&#60")).toBe("<");
        expect(unescapeHTMLEntities({ value: "&notit", level: "html5" })).toBe(
            "¬it",
        );
        expect(unescapeHTMLEntities({ value: "&auml;", level: "html5" })).toBe(
            "ä",
        );
        expect(unescapeHTMLEntities({ value: "&apos;", level: "html4" })).toBe(
            "&apos;",
        );
        expect(unescapeHTMLEntities("no entities")).toBe("no entities");
        expect(unescapeHTMLEntities(null as never)).toBeUndefined();
    });
});
