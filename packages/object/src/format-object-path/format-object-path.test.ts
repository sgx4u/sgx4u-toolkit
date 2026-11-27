import { describe, expect, it } from "vitest";
import { parseObjectPath } from "../parse-object-path/parse-object-path.js";
import type { FormatObjectPathParams } from "./format-object-path.types.js";
import { formatObjectPath } from "./format-object-path.js";

describe("formatObjectPath", () => {
    it("formats a dot path and a JSON Pointer", () => {
        expect(formatObjectPath({ segments: ["a", "b", 0] })).toBe("a.b[0]");
        expect(
            formatObjectPath({
                segments: ["a", "b"],
                pathStyle: "json-pointer",
            }),
        ).toBe("/a/b");
        expect(
            formatObjectPath({
                segments: ["a", "b"],
                pathDelimiter: "/",
            }),
        ).toBe("a/b");
    });

    it("round-trips string segments and pointer indexes", () => {
        const segments = parseObjectPath("a.b.c");
        expect(segments).toEqual(["a", "b", "c"]);
        expect(
            parseObjectPath(
                formatObjectPath({ segments: segments ?? [] }) ?? "",
            ),
        ).toEqual(segments);
        expect(
            parseObjectPath({
                path:
                    formatObjectPath({
                        segments: ["a", 0],
                        pathStyle: "json-pointer",
                    }) ?? "",
                pathStyle: "json-pointer",
            }),
        ).toEqual(["a", 0]);
        expect(parseObjectPath("a.b[0]")).toEqual(["a", "b", 0]);
    });

    it("returns undefined when segments is not an array or a segment is invalid", () => {
        expect(
            formatObjectPath({
                segments: "a" as unknown as FormatObjectPathParams["segments"],
            }),
        ).toBeUndefined();
        expect(
            formatObjectPath({
                segments: ["a", Number.NaN],
            }),
        ).toBeUndefined();
    });

    it("throws when pathStyle or pathDelimiter is invalid", () => {
        expect(() =>
            formatObjectPath({
                segments: ["a"],
                pathStyle: "bad",
            } as unknown as FormatObjectPathParams),
        ).toThrow(
            '`pathStyle` must be "dot" or "json-pointer"; received "bad".',
        );
        expect(() =>
            formatObjectPath({ segments: ["a"], pathDelimiter: "" }),
        ).toThrow('`pathDelimiter` must be a non-empty string; received "".');
    });
});
