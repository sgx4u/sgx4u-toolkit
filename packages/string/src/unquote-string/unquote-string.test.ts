import { describe, expect, it } from "vitest";
import { quoteString } from "../quote-string/quote-string.js";
import { unquoteString } from "./unquote-string.js";

describe("unquoteString", () => {
    it("removes one matching pair and unescapes it", () => {
        expect(unquoteString('"a"')).toBe("a");
        expect(unquoteString("a")).toBe("a");
        expect(unquoteString("'ab'")).toBe("ab");
        expect(unquoteString("`ab`")).toBe("ab");
        expect(unquoteString('"a\\"b"')).toBe('a"b');
        expect(unquoteString('"a\\\\b"')).toBe("a\\b");
        expect(unquoteString({ value: "'a'", style: "single" })).toBe("a");
        expect(unquoteString({ value: "'a'", style: "double" })).toBe("'a'");
        const quoted = quoteString('a"b\\c');
        expect(unquoteString(quoted ?? "")).toBe('a"b\\c');
        expect(unquoteString(null as unknown as string)).toBeUndefined();
        expect(() =>
            unquoteString({ value: '"a"', style: "none" as "double" }),
        ).toThrow(RangeError);
    });
});
