import { describe, expect, it } from "vitest";
import { isBase64URL } from "./is-base64-url.js";
describe("isBase64URL", () => {
    it("rejects standard padding", () => {
        expect(isBase64URL("YQ")).toBe(true);
        expect(isBase64URL("YQ==")).toBe(false);
    });
});
