import { describe, expect, it } from "vitest";
import type { ParseObjectPathParams } from "./parse-object-path.types.js";
import { parseObjectPath } from "./parse-object-path.js";

describe("parseObjectPath", () => {
    it("parses a dot path, including an empty path", () => {
        expect(parseObjectPath("a.b.0.c")).toEqual(["a", "b", 0, "c"]);
        expect(parseObjectPath("")).toEqual([]);
        expect(parseObjectPath("a.b[0].c")).toEqual(["a", "b", 0, "c"]);
        expect(parseObjectPath("a[0][1]")).toEqual(["a", 0, 1]);
    });

    it("returns undefined for illegal text and for a non-path argument", () => {
        expect(parseObjectPath("a..b")).toBeUndefined();
        expect(parseObjectPath(".")).toBeUndefined();
        expect(parseObjectPath(1 as unknown as string)).toBeUndefined();
        expect(
            parseObjectPath({ path: "a.b", extra: true } as unknown as string),
        ).toBeUndefined();
        expect(
            parseObjectPath({
                path: 1,
            } as unknown as ParseObjectPathParams),
        ).toBeUndefined();
    });

    it("parses the options form with a pointer or a delimiter", () => {
        expect(
            parseObjectPath({
                path: "/a/b/0",
                pathStyle: "json-pointer",
            }),
        ).toEqual(["a", "b", 0]);
        expect(parseObjectPath({ path: "a/b", pathDelimiter: "/" })).toEqual([
            "a",
            "b",
        ]);
    });

    it("throws when the options form has an unknown pathStyle or an empty delimiter", () => {
        expect(() =>
            parseObjectPath({
                path: "a.b",
                pathStyle: "bad",
            } as unknown as ParseObjectPathParams),
        ).toThrow(
            '`pathStyle` must be "dot" or "json-pointer"; received "bad".',
        );
        expect(() => parseObjectPath({ path: "a", pathDelimiter: "" })).toThrow(
            RangeError,
        );
        expect(parseObjectPath("a..b")).toBeUndefined();
    });
});
