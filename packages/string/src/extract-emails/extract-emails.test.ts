import { describe, expect, it } from "vitest";
import { extractEmails } from "./extract-emails.js";
describe("extractEmails", () => {
    it("returns addresses in order", () => {
        expect(extractEmails("a@b.co and c@d.co")).toEqual([
            "a@b.co",
            "c@d.co",
        ]);
        expect(extractEmails("none")).toEqual([]);
        expect(extractEmails(null)).toBeUndefined();
    });
});
