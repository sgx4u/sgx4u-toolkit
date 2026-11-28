import { describe, expect, it } from "vitest";
import { isEmail } from "./is-email.js";
describe("isEmail", () => {
    it("accepts practical addresses and rejects RFC-odd ones", () => {
        expect(isEmail("user@example.com")).toBe(true);
        expect(isEmail("user.name+tag@example.co.uk")).toBe(true);
        expect(isEmail("user@localhost")).toBe(false);
        expect(
            isEmail({ value: "user@localhost", requireTopLevelDomain: false }),
        ).toBe(true);
        expect(isEmail("a@b")).toBe(false);
        expect(isEmail("userexample.com")).toBe(false);
        expect(isEmail("user@@example.com")).toBe(false);
        expect(isEmail("user name@example.com")).toBe(false);
        expect(isEmail("not an email")).toBe(false);
        expect(
            isEmail({ value: "Ada <ada@example.com>", allowDisplayName: true }),
        ).toBe(true);
        expect(isEmail(null)).toBe(false);
    });
});
