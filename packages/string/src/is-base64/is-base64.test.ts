import { describe, expect, it } from "vitest";
import { isBase64 } from "./is-base64.js";
describe("isBase64", () => {
    it("accepts padded text", () => {
        expect(isBase64("YQ==")).toBe(true);
        expect(isBase64("$$$")).toBe(false);
    });
});
