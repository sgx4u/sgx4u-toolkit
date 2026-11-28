import { describe, expect, it } from "vitest";
import { createHTMLEntities } from "./create-html-entities.js";

describe("createHTMLEntities", () => {
    it("binds the level", () => {
        const html = createHTMLEntities({ level: "xml" });
        expect(html.escapeHTMLEntities("'")).toBe("&apos;");
        expect(() => createHTMLEntities({ nope: true } as never)).toThrow(
            RangeError,
        );
    });
});
