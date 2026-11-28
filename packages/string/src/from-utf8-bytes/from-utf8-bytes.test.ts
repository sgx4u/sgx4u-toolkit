import { describe, expect, it } from "vitest";
import { fromUTF8Bytes } from "./from-utf8-bytes.js";
import { toUTF8Bytes } from "../to-utf8-bytes/to-utf8-bytes.js";
describe("fromUTF8Bytes", () => {
    it("round-trips and rejects bad bytes", () => {
        expect(fromUTF8Bytes(toUTF8Bytes("hi"))).toBe("hi");
        expect(fromUTF8Bytes(new Uint8Array([0xff]))).toBeUndefined();
        expect(fromUTF8Bytes("hi")).toBeUndefined();
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(fromUTF8Bytes(null as never)).toBeUndefined();
    });
    it("decodes UTF-8 bytes and rejects a bad byte", () => {
        expect(typeof fromUTF8Bytes(new TextEncoder().encode("é"))).toBe(
            "string",
        );
        expect(fromUTF8Bytes(new Uint8Array([0xff]))).toBeUndefined();
    });
});
