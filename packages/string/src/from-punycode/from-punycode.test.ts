import { describe, expect, it } from "vitest";
import { fromPunycode } from "./from-punycode.js";
describe("fromPunycode", () => {
    it("encodes a string", () => {
        expect(fromPunycode("hi")).toBeTypeOf("string");
        expect(fromPunycode(null)).toBeUndefined();
    });
});
