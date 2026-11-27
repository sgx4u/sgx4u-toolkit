import { afterEach, describe, expect, it } from "vitest";
import { hashObject } from "./hash-object.js";

const originalCrypto = Object.getOwnPropertyDescriptor(globalThis, "crypto");

afterEach(() => {
    if (originalCrypto === undefined) {
        delete (globalThis as { crypto?: unknown }).crypto;
        return;
    }
    Object.defineProperty(globalThis, "crypto", originalCrypto);
});

describe("hashObject", () => {
    it("returns a 16 character FNV-1a 64 digest by default", () => {
        expect(hashObject({ value: null })).toBe("5b9bc4ba528108e4");
        expect(hashObject({ value: null, algorithm: "fnv1a64" })).toBe(
            "5b9bc4ba528108e4",
        );
        expect(hashObject({ value: { b: 1, a: 2 } })).toBe(
            hashObject({ value: { a: 2, b: 1 } }),
        );
        expect(hashObject({ value: "" })).toHaveLength(16);
    });

    it("returns undefined when the value is not canonical JSON", () => {
        expect(hashObject({ value: Number.NaN })).toBeUndefined();
        expect(hashObject({ value: undefined })).toBeUndefined();
        const cycle: { self?: unknown } = {};
        cycle.self = cycle;
        expect(hashObject({ value: cycle })).toBeUndefined();
    });

    it("returns a 64 character SHA-256 promise", async () => {
        const digest = hashObject({ value: null, algorithm: "sha256" });
        expect(digest).toBeInstanceOf(Promise);
        await expect(digest).resolves.toMatch(/^[0-9a-f]{64}$/);
        const again = await hashObject({ value: null, algorithm: "sha256" });
        expect(again).toBe(await digest);

        const missing = hashObject({ value: Number.NaN, algorithm: "sha256" });
        expect(missing).toBeInstanceOf(Promise);
        await expect(missing).resolves.toBeUndefined();
    });

    it("resolves undefined when SubtleCrypto is missing", async () => {
        Object.defineProperty(globalThis, "crypto", {
            configurable: true,
            value: {},
        });
        await expect(
            hashObject({ value: null, algorithm: "sha256" }),
        ).resolves.toBeUndefined();

        Object.defineProperty(globalThis, "crypto", {
            configurable: true,
            value: { subtle: {} },
        });
        await expect(
            hashObject({ value: 1, algorithm: "sha256" }),
        ).resolves.toBeUndefined();
    });

    it("throws for an unknown algorithm string and returns undefined otherwise", () => {
        expect(() =>
            hashObject({ value: 1, algorithm: "md5" } as never),
        ).toThrow(RangeError);
        expect(hashObject({ value: 1, algorithm: 1 as never })).toBeUndefined();
    });

    it("throws when params is not a plain object", () => {
        expect(() => hashObject(undefined as never)).toThrow(TypeError);
    });
});
