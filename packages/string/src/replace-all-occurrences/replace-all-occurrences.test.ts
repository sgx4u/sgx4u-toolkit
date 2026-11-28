import { describe, expect, it } from "vitest";
import { replaceAllOccurrences } from "./replace-all-occurrences.js";
describe("replaceAllOccurrences", () => {
    it("replaces literally and restores lastIndex", () => {
        expect(
            replaceAllOccurrences({
                value: "a-a",
                pattern: "-",
                replacement: "_",
            }),
        ).toBe("a_a");
        expect(
            replaceAllOccurrences({
                value: "a$b",
                pattern: "$",
                replacement: "x",
            }),
        ).toBe("axb");
        expect(
            replaceAllOccurrences({
                value: "ab",
                pattern: "",
                replacement: "x",
            }),
        ).toBe("ab");
        expect(
            replaceAllOccurrences({
                value: "a",
                pattern: "a",
                replacement: "$&",
            }),
        ).toBe("$&");
        const expression = /a/g;
        expression.lastIndex = 1;
        expect(
            replaceAllOccurrences({
                value: "aba",
                pattern: expression,
                replacement: "c",
            }),
        ).toBe("cbc");
        expect(expression.lastIndex).toBe(1);
        expect(
            replaceAllOccurrences({
                value: 1 as unknown as string,
                pattern: "a",
                replacement: "b",
            }),
        ).toBeUndefined();
    });
});
