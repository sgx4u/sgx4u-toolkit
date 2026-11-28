import { describe, expect, it } from "vitest";
import { encodeBase64URL } from "./encode-base64-url.js";
describe("encodeBase64URL", () => {
    it("encodes a string", () => {
        expect(encodeBase64URL("hi")).toBeTypeOf("string");
        expect(encodeBase64URL(null)).toBeUndefined();
    });
});
