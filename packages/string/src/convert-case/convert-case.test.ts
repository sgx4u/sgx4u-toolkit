import { describe, expect, it } from "vitest";
import { convertCase } from "./convert-case.js";

describe("convertCase", () => {
    it("dispatches and rejects an unknown case", () => {
        expect(convertCase({ value: "foo bar", case: "camel" })).toBe("fooBar");
        expect(convertCase({ value: "foo bar", case: "snake" })).toBe(
            "foo_bar",
        );
        expect(convertCase({ value: "fooBar", case: "title" })).toBe("Foo Bar");
        expect(
            convertCase({ value: 1 as unknown as string, case: "camel" }),
        ).toBeUndefined();
        expect(() =>
            convertCase({ value: "a", case: "foo" as "camel" }),
        ).toThrow(RangeError);
        expect(() =>
            convertCase({
                value: "a",
                case: "camel",
                style: "nope" as "apa",
            }),
        ).toThrow(RangeError);
        expect(
            convertCase({ value: "I", case: "lower", locale: "tr-TR" }),
        ).toBe("ı");
    });
});
