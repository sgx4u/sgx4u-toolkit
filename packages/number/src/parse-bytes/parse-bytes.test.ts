import { describe, expect, it } from "vitest";
import { parseBytes } from "../index.js";

describe("parseBytes", () => {
    it("covers the documented behavior", () => {
        expect(parseBytes({ value: "1.34 kB" })).toBe(1340);
        expect(parseBytes({ value: "1 KiB" })).toBe(1024);
        expect(parseBytes({ value: "500B" })).toBe(500);
        expect(parseBytes({ value: "1.5 MB" })).toBe(1_500_000);
        expect(parseBytes({ value: "1 kbit" })).toBe(125);
        expect(parseBytes({ value: "1 KB", standard: "SI" })).toBe(1000);
        expect(parseBytes({ value: "1 KB", standard: "IEC" })).toBe(1024);
        expect(parseBytes({ value: "nope" })).toBeUndefined();
        expect(() =>
            parseBytes({ value: "1 B", standard: "nope" as "SI" }),
        ).toThrow(RangeError);
    });
});
