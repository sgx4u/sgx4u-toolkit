import { describe, expect, it } from "vitest";
import { extractURLs } from "./extract-urls.js";
describe("extractURLs", () => {
    it("finds http URLs", () => {
        expect(extractURLs("see https://example.com.")).toEqual([
            "https://example.com",
        ]);
        expect(extractURLs("none")).toEqual([]);
    });
});
