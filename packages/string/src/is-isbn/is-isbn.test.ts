import { describe, expect, it } from "vitest";
import { isISBN } from "./is-isbn.js";
describe("isISBN", () => {
    it("checks ISBN-10 and ISBN-13", () => {
        expect(isISBN("0-306-40615-2")).toBe(true);
        expect(isISBN("978-0-306-40615-7")).toBe(true);
        expect(isISBN("0-306-40615-3")).toBe(false);
    });
});
