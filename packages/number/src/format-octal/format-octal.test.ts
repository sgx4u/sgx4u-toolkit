import { describe, expect, it } from "vitest";
import { formatOctal } from "../index.js";

describe("formatOctal", () => {
    it("covers the documented behavior", () => {
        expect(formatOctal({ value: 8 })).toBe("0o10");
    });
});
