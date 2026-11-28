import { describe, expect, it } from "vitest";
import { formatBinary } from "../index.js";

describe("formatBinary", () => {
    it("covers the documented behavior", () => {
        expect(formatBinary({ value: 5 })).toBe("0b101");
        expect(formatBinary({ value: 5, prefix: false })).toBe("101");
    });
});
