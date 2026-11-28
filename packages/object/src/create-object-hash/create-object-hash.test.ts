import { describe, expect, it } from "vitest";
import { createObjectHash } from "./create-object-hash.js";

describe("createObjectHash", () => {
    it("returns a frozen API that hashes the canonical form", async () => {
        const api = createObjectHash();
        expect(Object.isFrozen(api)).toBe(true);
        expect(api.canonicalizeJSON({ b: 1, a: 2 })).toBe('{"a":2,"b":1}');
        expect(api.hashObject({ value: null })).toBe("5b9bc4ba528108e4");
        await expect(
            api.hashObject({ value: null, algorithm: "sha256" }),
        ).resolves.toMatch(/^[0-9a-f]{64}$/);
    });

    it("does not share mutable config between instances", () => {
        const firstConfig = { pathDelimiter: "/" };
        const first = createObjectHash(firstConfig);
        firstConfig.pathDelimiter = ".";
        const second = createObjectHash({ pathDelimiter: "." });

        expect(first.canonicalizeJSON({ z: 1, a: 2 })).toBe(
            second.canonicalizeJSON({ a: 2, z: 1 }),
        );
        expect(first.hashObject({ value: { a: 1 } })).toBe(
            second.hashObject({ value: { a: 1 } }),
        );
    });

    it("validates known options and ignores unknown keys", () => {
        expect(
            createObjectHash({
                pathStyle: "dot",
                pathDelimiter: "/",
                arrayMerge: "concat",
                prototypeKeys: "keep",
                circular: "skip",
                keyCase: "snakeCase",
                prototypes: "keep",
                includeSymbols: true,
                includeNonEnumerable: false,
                preserveConsecutiveUppercase: true,
                emptyValues: ["undefined", "null"],
                locale: ["en", "fr"],
                maxDepth: Number.POSITIVE_INFINITY,
                ignored: true,
            } as never).canonicalizeJSON(1),
        ).toBe("1");
        expect(
            createObjectHash({ locale: "en", maxDepth: 0 }).hashObject({
                value: true,
            }),
        ).toBe(createObjectHash().hashObject({ value: true }));

        expect(() => createObjectHash(null as never)).toThrow(TypeError);
        expect(() => createObjectHash(1 as never)).toThrow(TypeError);
        expect(() => createObjectHash({ pathDelimiter: "" })).toThrow(
            RangeError,
        );
        expect(() => createObjectHash({ pathStyle: "nope" } as never)).toThrow(
            RangeError,
        );
        expect(() =>
            createObjectHash({ prototypeKeys: "nope" } as never),
        ).toThrow(RangeError);
        expect(() => createObjectHash({ arrayMerge: "nope" } as never)).toThrow(
            RangeError,
        );
        expect(() => createObjectHash({ circular: "nope" } as never)).toThrow(
            RangeError,
        );
        expect(() => createObjectHash({ prototypes: "nope" } as never)).toThrow(
            RangeError,
        );
        expect(
            createObjectHash({
                keyCase: "nope",
                emptyValues: ["nope"],
            } as never).canonicalizeJSON(true),
        ).toBe("true");
        expect(() =>
            createObjectHash({ includeSymbols: "yes" } as never),
        ).toThrow(RangeError);
        expect(() =>
            createObjectHash({ includeNonEnumerable: 1 } as never),
        ).toThrow(RangeError);
        expect(() =>
            createObjectHash({ preserveConsecutiveUppercase: "yes" } as never),
        ).toThrow(RangeError);
        expect(
            createObjectHash({
                locale: 1,
                maxDepth: -1,
            } as never).canonicalizeJSON(null),
        ).toBe("null");
    });
});
