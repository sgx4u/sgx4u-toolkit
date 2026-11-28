import { describe, expect, it } from "vitest";
import { isDataURI } from "./is-data-uri.js";
describe("isDataURI", () => {
    it("accepts a data URI", () => {
        expect(isDataURI("data:text/plain,hi")).toBe(true);
        expect(isDataURI("https://x")).toBe(false);
    });
});
