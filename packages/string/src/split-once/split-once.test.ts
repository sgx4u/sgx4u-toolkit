import { describe, expect, it } from "vitest";
import { splitOnce } from "./split-once.js";
describe("splitOnce", () => {
    it("splits once from either end", () => {
        expect(splitOnce({ value: "a-b-c", separator: "-" })).toEqual([
            "a",
            "b-c",
        ]);
        expect(
            splitOnce({ value: "a-b-c", separator: "-", from: "end" }),
        ).toEqual(["a-b", "c"]);
        expect(splitOnce({ value: "abc", separator: "-" })).toBeUndefined();
        expect(() => splitOnce({ value: "a", separator: "" })).toThrow(
            RangeError,
        );
        expect(
            splitOnce({ value: 1 as unknown as string, separator: "-" }),
        ).toBeUndefined();
    });
});
