import { describe, expect, it } from "vitest";
import { parseHexadecimal } from "../index.js";

describe("parseHexadecimal", () => {
    it("covers the documented behavior", () => {
        expect(parseHexadecimal("0xff")).toBe(255);
        expect(parseHexadecimal("FF")).toBe(255);
    });
});
