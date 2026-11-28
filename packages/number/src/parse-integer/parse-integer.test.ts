import { describe, expect, it } from "vitest";
import { parseInteger } from "../index.js";

describe("parseInteger", () => {
    it("covers the documented behavior", () => {
        expect(parseInteger("42")).toBe(42);
        expect(parseInteger(3)).toBe(3);
        expect(parseInteger("1.5")).toBeUndefined();
        expect(parseInteger("nope")).toBeUndefined();
    });
});
