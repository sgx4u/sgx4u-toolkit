import { describe, expect, it } from "vitest";
import { createString } from "./create-string.js";

describe("createString", () => {
    it("binds locale and rejects an unknown key", () => {
        const strings = createString({ locale: "tr-TR" });
        expect(strings.toLowerCase("I")).toBe("ı");
        expect(strings.toLowerCase({ value: "I", locale: "en" })).toBe("i");
        const other = createString();
        expect(other.toLowerCase("I")).toBe("i");
        expect(() => createString({ typo: true } as never)).toThrow(RangeError);
    });

    it("lets one call override truncation, slug, mask, and case defaults", () => {
        const strings = createString({
            locale: "en",
            truncationOmission: "...",
            truncationLocation: "end",
            slugifySeparator: "_",
            slugifyLowerCase: false,
            maskCharacter: "#",
            unmaskedStartLength: 1,
            unmaskedEndLength: 1,
            keepConsecutiveUppercase: true,
            templatePattern: "double-curly",
            wordsPerMinute: 100,
        });
        expect(strings.truncate({ value: "hello", maximumLength: 4 })).toBe(
            "h...",
        );
        expect(
            strings.truncate({
                value: "hello",
                maximumLength: 4,
                omission: "…",
            }),
        ).toBe("hel…");
        expect(strings.slugify("Hello World")).toBe("Hello_World");
        expect(
            strings.slugify({
                value: "Hello World",
                separator: "-",
                lowerCase: true,
            }),
        ).toBe("hello-world");
        expect(strings.maskString("secret")).toBe("s####t");
        expect(strings.toPascalCase("XMLHttpRequest")).toBe("XMLHttpRequest");
        expect(
            strings.toPascalCase({
                value: "XMLHttpRequest",
                keepConsecutiveUppercase: false,
            }),
        ).toBe("XmlHttpRequest");
        expect(strings.getReadingTime("one two")).toEqual({
            words: 2,
            minutes: 0.02,
        });
    });

    it("does not leak slug or title options into other functions", () => {
        const strings = createString({
            titleCaseStyle: "apa",
            slugifySeparator: "_",
            templatePattern: "double-curly",
            unit: "codeUnit",
        });
        expect(
            strings.formatList({
                values: ["Ada", "Grace"],
                locale: "en",
            }),
        ).toBe("Ada and Grace");
        expect(
            strings.truncate({ value: "hello_world", maximumLength: 8 }),
        ).toBe("hello_w…");
        expect(
            strings.interpolate({
                template: "Hello {{name}}",
                values: { name: "Ada" },
            }),
        ).toBe("Hello Ada");
        expect(strings.pad({ value: "😀", maximumLength: 3 })).toBe("😀 ");
        expect(strings.lastIndexOfMatch({ value: "😀😀", search: "😀" })).toBe(
            2,
        );
    });

    it("keeps two instances independent", () => {
        const turkish = createString({ locale: "tr-TR" });
        const english = createString({ locale: "en" });
        expect(turkish.toLowerCase("I")).toBe("ı");
        expect(english.toLowerCase("I")).toBe("i");
    });

    it("throws for an empty locale, a bad unit, and a bad reading speed", () => {
        expect(() => createString({ locale: "" })).toThrow(RangeError);
        expect(() => createString({ locale: [] })).toThrow(RangeError);
        expect(() => createString({ locale: 1 as never })).toThrow(TypeError);
        expect(() => createString({ unit: "nope" as never })).toThrow(
            RangeError,
        );
        expect(() => createString({ wordsPerMinute: 0 })).toThrow(RangeError);
        expect(() => createString(null as never)).toThrow(TypeError);
    });
});
