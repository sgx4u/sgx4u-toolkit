import { describe, expect, it } from "vitest";
import { unescapeHTML } from "./unescape-html.js";

describe("unescapeHTML", () => {
    it("reverses the five named escapes and numeric references", () => {
        expect(unescapeHTML("&amp;&lt;&gt;&quot;&#39;")).toBe("&<>\"'");
        expect(unescapeHTML("&#65;")).toBe("A");
        expect(unescapeHTML("&#x41;")).toBe("A");
        expect(unescapeHTML("&#X41;")).toBe("A");
        expect(unescapeHTML("&#00065;")).toBe("A");
        expect(unescapeHTML("")).toBe("");
    });

    it("leaves other named entities and invalid numbers unchanged", () => {
        expect(unescapeHTML("&nbsp;")).toBe("&nbsp;");
        expect(unescapeHTML("&AMP;")).toBe("&AMP;");
        expect(unescapeHTML("&#x;")).toBe("&#x;");
        expect(unescapeHTML("&#;")).toBe("&#;");
        expect(unescapeHTML("&#x110000;")).toBe("&#x110000;");
        expect(unescapeHTML("&#xD800;")).toBe("&#xD800;");
        expect(unescapeHTML("&amp")).toBe("&amp");
        expect(unescapeHTML("&amp;lt;")).toBe("&lt;");
    });

    it("does not throw for garbage and returns undefined for a non-string", () => {
        expect(unescapeHTML("&")).toBe("&");
        expect(unescapeHTML("&#999999999999;")).toBe("&#999999999999;");
        expect(unescapeHTML(1 as never)).toBeUndefined();
    });
});
