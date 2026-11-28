import { assert, property, string as arbitraryString } from "fast-check";
import { describe, expect, it } from "vitest";
import { decodeHex } from "../decode-hex/decode-hex.js";
import { encodeHex } from "./encode-hex.js";

describe("encodeHex", () => {
    it("encodes a string", () => {
        expect(encodeHex("A")).toBe("41");
        expect(encodeHex(null)).toBeUndefined();
        expect(decodeHex("41")).toBe("A");
        expect(decodeHex("4")).toBeUndefined();
        expect(decodeHex("zz")).toBeUndefined();
    });

    it("round-trips strings of length 30 or less", () => {
        assert(
            property(arbitraryString({ maxLength: 30 }), (value) => {
                expect(decodeHex(encodeHex(value))).toBe(value);
            }),
            { numRuns: 20 },
        );
    });
});
