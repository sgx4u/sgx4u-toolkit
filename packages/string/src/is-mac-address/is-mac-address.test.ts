import { describe, expect, it } from "vitest";
import { isMACAddress } from "./is-mac-address.js";
describe("isMACAddress", () => {
    it("accepts the common formats", () => {
        expect(isMACAddress("aa:bb:cc:dd:ee:ff")).toBe(true);
        expect(isMACAddress("aabb.ccdd.eeff")).toBe(true);
        expect(isMACAddress({ value: "aabbccddeeff", format: "bare" })).toBe(
            true,
        );
        expect(isMACAddress("nope")).toBe(false);
    });
});
