import { describe, expect, it } from "vitest";
import { formatIBAN } from "./format-iban.js";
describe("formatIBAN", () => {
    it("groups without checking the checksum", () => {
        expect(formatIBAN("GB82WEST12345698765432")).toBe(
            "GB82 WEST 1234 5698 7654 32",
        );
    });
});
