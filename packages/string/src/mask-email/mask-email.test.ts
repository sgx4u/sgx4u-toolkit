import { describe, expect, it } from "vitest";
import { maskEmail } from "./mask-email.js";
describe("maskEmail", () => {
    it("masks the local part", () => {
        expect(maskEmail("jane@example.com")).toBe("j***@example.com");
        expect(maskEmail("no-at")).toBeUndefined();
        expect(maskEmail(null as unknown as string)).toBeUndefined();
    });
});
