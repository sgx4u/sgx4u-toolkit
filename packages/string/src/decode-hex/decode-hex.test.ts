import { describe, expect, it } from "vitest";
import fc from "fast-check";
import { decodeHex } from "./decode-hex.js";
import { encodeHex } from "../encode-hex/encode-hex.js";
describe("decodeHex", () => {
    it("round-trips", () => {
        expect(decodeHex("6869")).toBe("hi");
        expect(decodeHex("abc")).toBeUndefined();
        fc.assert(
            fc.property(fc.string({ maxLength: 20 }), (value) => {
                expect(decodeHex(encodeHex(value) ?? "")).toBe(value);
            }),
            { numRuns: 15 },
        );
    });
});
