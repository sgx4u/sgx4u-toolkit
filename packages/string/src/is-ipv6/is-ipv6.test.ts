import { describe, expect, it } from "vitest";
import { isIPv6 } from "./is-ipv6.js";
describe("isIPv6", () => {
    it("accepts compressed addresses", () => {
        expect(isIPv6("::1")).toBe(true);
        expect(isIPv6("2001:db8::1")).toBe(true);
        expect(isIPv6("gggg::")).toBe(false);
        expect(isIPv6(null)).toBe(false);
    });
});
