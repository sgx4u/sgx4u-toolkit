import { describe, expect, it } from "vitest";
import { escapeCSV } from "./escape-csv.js";
describe("escapeCSV", () => {
    it("quotes when needed", () => {
        expect(escapeCSV("a,b")).toBe('"a,b"');
        expect(escapeCSV('say "hi"')).toBe('"say ""hi"""');
        expect(escapeCSV("plain")).toBe("plain");
        expect(escapeCSV(null as unknown as string)).toBeUndefined();
    });
});
