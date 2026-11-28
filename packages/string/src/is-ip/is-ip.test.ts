import { describe, expect, it } from "vitest";
import { isIP } from "./is-ip.js";
describe("isIP", () => {
    it("accepts either version", () => {
        expect(isIP("127.0.0.1")).toBe(true);
        expect(isIP("::1")).toBe(true);
        expect(isIP({ value: "::1", version: 4 })).toBe(false);
    });
});
