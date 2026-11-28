import { describe, expect, it } from "vitest";
import { isIPv4 } from "./is-ipv4.js";
describe("isIPv4", () => {
    it("rejects leading zeros", () => {
        expect(isIPv4("127.0.0.1")).toBe(true);
        expect(isIPv4("0.0.0.0")).toBe(true);
        expect(isIPv4("01.2.3.4")).toBe(false);
        expect(isIPv4("256.0.0.1")).toBe(false);
    });
});
