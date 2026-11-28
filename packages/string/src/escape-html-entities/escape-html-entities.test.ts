import { describe, expect, it } from "vitest";
import { escapeHTMLEntities } from "./escape-html-entities.js";
import { unescapeHTMLEntities } from "../unescape-html-entities/unescape-html-entities.js";

describe("escapeHTMLEntities", () => {
    it("uses a named entity and round-trips", () => {
        expect(escapeHTMLEntities("<")).toBe("&lt;");
        expect(escapeHTMLEntities({ value: "'", level: "xml" })).toBe("&apos;");
        expect(unescapeHTMLEntities("&amp;")).toBe("&");
        expect(unescapeHTMLEntities("&#65;")).toBe("A");
        expect(() =>
            escapeHTMLEntities({ value: "a", level: "nope" as "xml" }),
        ).toThrow(RangeError);
    });
});
