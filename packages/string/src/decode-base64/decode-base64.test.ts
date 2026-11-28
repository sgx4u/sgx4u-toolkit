import { describe, expect, it } from "vitest";
import fc from "fast-check";
import { decodeBase64 } from "./decode-base64.js";
import { encodeBase64 } from "../encode-base64/encode-base64.js";
describe("decodeBase64", () => {
    it("round-trips", () => {
        expect(decodeBase64("???")).toBeUndefined();
        fc.assert(
            fc.property(fc.string({ maxLength: 20 }), (value) => {
                expect(decodeBase64(encodeBase64(value) ?? "")).toBe(value);
            }),
            { numRuns: 15 },
        );
    });
});
