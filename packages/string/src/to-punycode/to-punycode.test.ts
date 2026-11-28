import { describe, expect, it } from "vitest";
import { toPunycode } from "./to-punycode.js";
describe("toPunycode", () => {
    it("encodes a string", () => {
        expect(toPunycode("hi")).toBeTypeOf("string");
        expect(toPunycode(null)).toBeUndefined();
    });
});
