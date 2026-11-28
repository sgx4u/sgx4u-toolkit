import { describe, expect, it } from "vitest";
import { isFQDN } from "./is-fqdn.js";
describe("isFQDN", () => {
    it("accepts hostnames", () => {
        expect(isFQDN("example.com")).toBe(true);
        expect(isFQDN("localhost")).toBe(false);
        expect(
            isFQDN({ value: "localhost", requireTopLevelDomain: false }),
        ).toBe(true);
        expect(isFQDN("https://example.com")).toBe(false);
    });
});
