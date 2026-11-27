import { describe, expect, it } from "vitest";
import { formatHexadecimal } from "../index.js";

describe("formatHexadecimal", () => {
    it("covers the documented behavior", () => {
        expect(formatHexadecimal({ value: 255 })).toBe("0xff");
        expect(formatHexadecimal({ value: 255, uppercase: true })).toBe("0xFF");
    });
});
