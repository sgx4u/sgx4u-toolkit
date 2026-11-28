import { describe, expect, it } from "vitest";
import { decodeBase64URL } from "./decode-base64-url.js";
import { encodeBase64URL } from "../encode-base64-url/encode-base64-url.js";
describe("decodeBase64URL", () => {
    it("round-trips", () => {
        expect(decodeBase64URL(encodeBase64URL("hi") ?? "")).toBe("hi");
        expect(decodeBase64URL("???")).toBeUndefined();
    });
});
