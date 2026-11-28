import { describe, expect, it } from "vitest";
import { isIPRange } from "./is-ip-range.js";
describe("isIPRange", () => {
    it("accepts CIDR", () => {
        expect(isIPRange("127.0.0.1/24")).toBe(true);
        expect(isIPRange("::1/128")).toBe(true);
        expect(isIPRange("127.0.0.1/33")).toBe(false);
    });
});
