import { describe, expect, it } from "vitest";
import { toUTF8Bytes } from "./to-utf8-bytes.js";
describe("toUTF8Bytes", () => {
    it("encodes a string", () => {
        expect(toUTF8Bytes("hi")).toBeTypeOf("object");
        expect(toUTF8Bytes(null)).toBeUndefined();
    });
});
