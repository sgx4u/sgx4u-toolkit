import { describe, expect, it } from "vitest";
import { isBlank } from "../index.js";

describe("isBlank", () => {
    it("accepts an empty string", () => {
        expect(isBlank("")).toBe(true);
    });

    it("accepts whitespace", () => {
        expect(isBlank(" \n\t")).toBe(true);
    });

    it("treats a no-break space as whitespace", () => {
        expect(isBlank("\u00A0")).toBe(true);
    });

    it("rejects text", () => {
        expect(isBlank(" sgx ")).toBe(false);
    });
});
