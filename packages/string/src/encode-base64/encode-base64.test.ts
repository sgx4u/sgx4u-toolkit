import { assert, property, string as arbitraryString } from "fast-check";
import { describe, expect, it } from "vitest";
import { decodeBase64 } from "../decode-base64/decode-base64.js";
import { encodeBase64 } from "./encode-base64.js";

describe("encodeBase64", () => {
    it("encodes a string", () => {
        expect(encodeBase64("hi")).toBe("aGk=");
        expect(encodeBase64(null)).toBeUndefined();
        expect(decodeBase64("aGk=")).toBe("hi");
        expect(decodeBase64("aGk")).toBe("hi");
        expect(decodeBase64("@@@")).toBeUndefined();
    });

    it("round-trips strings of length 30 or less", () => {
        assert(
            property(arbitraryString({ maxLength: 30 }), (value) => {
                expect(decodeBase64(encodeBase64(value))).toBe(value);
            }),
            { numRuns: 20 },
        );
    });
});
