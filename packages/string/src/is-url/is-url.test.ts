import { describe, expect, it } from "vitest";
import { isURL } from "./is-url.js";
describe("isURL", () => {
    it("uses the URL parser and the default allow list", () => {
        expect(isURL("https://example.com")).toBe(true);
        expect(isURL("http://example.com/a")).toBe(true);
        expect(isURL("ftp://example.com")).toBe(false);
        expect(isURL("example.com")).toBe(false);
        expect(isURL({ value: "example.com", requireProtocol: false })).toBe(
            true,
        );
        expect(isURL("https://localhost")).toBe(false);
        expect(
            isURL({
                value: "https://localhost",
                allowLocalhost: true,
                requireTopLevelDomain: false,
            }),
        ).toBe(true);
        expect(isURL(null)).toBe(false);
    });
});
