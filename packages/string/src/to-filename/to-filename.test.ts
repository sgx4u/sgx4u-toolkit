import { describe, expect, it } from "vitest";
import { toFilename } from "./to-filename.js";

describe("toFilename", () => {
    it("replaces reserved and control characters and collapses each run", () => {
        expect(toFilename("report.txt")).toBe("report.txt");
        expect(toFilename("a<b>c")).toBe("a-b-c");
        expect(toFilename("a<<b")).toBe("a-b");
        expect(toFilename("a/b\\c")).toBe("a-b-c");
        expect(toFilename("a\u0000b")).toBe("a-b");
        expect(toFilename("my--file")).toBe("my--file");
    });

    it("trims trailing dots and spaces and replaces an empty result", () => {
        expect(toFilename("file.")).toBe("file");
        expect(toFilename("file ")).toBe("file");
        expect(toFilename("file. ")).toBe("file");
        expect(toFilename("...")).toBe("_");
        expect(toFilename("")).toBe("_");
        expect(toFilename(".gitignore")).toBe(".gitignore");
    });

    it("suffixes Windows reserved device names, including an extension", () => {
        expect(toFilename("CON")).toBe("CON_");
        expect(toFilename("con.txt")).toBe("con_.txt");
        expect(toFilename("Con.Txt")).toBe("Con_.Txt");
        expect(toFilename("PRN")).toBe("PRN_");
        expect(toFilename("AUX")).toBe("AUX_");
        expect(toFilename("NUL")).toBe("NUL_");
        expect(toFilename("COM1")).toBe("COM1_");
        expect(toFilename("COM10")).toBe("COM10");
        expect(toFilename("LPT3.doc")).toBe("LPT3_.doc");
        expect(toFilename("AUX.")).toBe("AUX_");
    });

    it("limits the grapheme length and repairs a reserved slice", () => {
        expect(toFilename({ value: "CON", maximumLength: 3 })).toBe("CO_");
        expect(toFilename({ value: "hello.txt", replacement: "_" })).toBe(
            "hello.txt",
        );
        expect(toFilename({ value: "a<>b", replacement: "<" })).toBe("ab");
    });

    it("rejects a length below 1 and a non-string replacement", () => {
        expect(() => toFilename({ value: "a", maximumLength: 0 })).toThrow(
            RangeError,
        );
        expect(() => toFilename({ value: "a", maximumLength: -1 })).toThrow(
            RangeError,
        );
        expect(() =>
            toFilename({ value: "a", replacement: 1 as never }),
        ).toThrow(TypeError);
    });

    it("returns undefined for a non-string", () => {
        expect(toFilename(1 as never)).toBeUndefined();
        expect(toFilename({ value: 1 as never })).toBeUndefined();
    });
});
