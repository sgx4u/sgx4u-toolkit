import { describe, expect, it } from "vitest";
import { isValidJSONPatch } from "./is-valid-json-patch.js";

describe("isValidJSONPatch", () => {
    it("accepts an empty patch and well-formed operations", () => {
        expect(isValidJSONPatch([])).toBe(true);
        expect(
            isValidJSONPatch([
                { op: "add", path: "/a", value: 1 },
                { op: "remove", path: "" },
                { op: "replace", path: "/a~1b", value: null },
                { op: "move", from: "/a", path: "/b", extra: true },
                { op: "copy", from: "", path: "/c" },
                { op: "test", path: "/a", value: undefined },
            ]),
        ).toBe(true);
    });

    it("rejects a value that is not a patch and does not throw", () => {
        const rejected = [
            null,
            undefined,
            {},
            "[]",
            1,
            { op: "add", path: "/a", value: 1 },
            [{ op: "nope", path: "/a" }],
            [{ path: "/a" }],
            [{ op: "add", path: "a", value: 1 }],
            [{ op: "add", path: "/~", value: 1 }],
            [{ op: "add", path: "/a" }],
            [{ op: "replace", path: "/a" }],
            [{ op: "test", path: "/a" }],
            [{ op: "move", path: "/a" }],
            [{ op: "copy", path: "/a", from: "a" }],
            [{ op: "remove", path: 1 }],
            [null],
            [[]],
        ];

        for (const value of rejected) {
            expect(isValidJSONPatch(value)).toBe(false);
        }
    });
});
