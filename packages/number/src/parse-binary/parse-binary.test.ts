import { describe, expect, it } from "vitest";
import { parseBinary } from "../index.js";

describe("parseBinary", () => {
    it("covers the documented behavior", () => {
        expect(parseBinary("0b1010")).toBe(10);
        expect(parseBinary("1010")).toBe(10);
        expect(parseBinary("0b2")).toBeUndefined();
    });
});
