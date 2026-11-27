import { describe, expect, it } from "vitest";
import { sanitizeObject } from "./sanitize-object.js";

function withDangerous(
    target: Record<string, unknown>,
    key: string,
    value: unknown,
): void {
    Object.defineProperty(target, key, {
        configurable: true,
        enumerable: true,
        value,
        writable: true,
    });
}

describe("sanitizeObject", () => {
    it("removes dangerous keys at every level", () => {
        const nested: Record<string, unknown> = { ok: 2 };
        withDangerous(nested, "constructor", "bad");
        const source = Object.create(null) as Record<string, unknown>;
        source.id = 1;
        source.nested = nested;
        withDangerous(source, "__proto__", { admin: true });
        const sanitized = sanitizeObject(source) as Record<string, unknown>;
        expect(Object.getPrototypeOf(sanitized)).toBeNull();
        expect(Object.keys(sanitized).sort()).toEqual(["id", "nested"]);
        expect(sanitized.nested).toEqual({ ok: 2 });
        expect(source.id).toBe(1);
        expect(Object.hasOwn(nested, "constructor")).toBe(true);
    });

    it("shares nested values when deep is false and still drops top-level keys", () => {
        const nested: Record<string, unknown> = { ok: 2 };
        withDangerous(nested, "constructor", "bad");
        const source: Record<string, unknown> = { id: 1, nested };
        withDangerous(source, "prototype", "bad");
        const sanitized = sanitizeObject({
            deep: false,
            object: source,
        }) as { id: number; nested: Record<string, unknown> };
        expect(Object.keys(sanitized).sort()).toEqual(["id", "nested"]);
        expect(sanitized.nested).toBe(nested);
        expect(Object.hasOwn(sanitized.nested, "constructor")).toBe(true);
        expect(Object.hasOwn(source, "prototype")).toBe(true);
    });

    it("copies an array without mutating it", () => {
        const source = [1, { id: 2 }];
        const sanitized = sanitizeObject(source) as unknown[];
        expect(sanitized).toEqual(source);
        expect(sanitized).not.toBe(source);
        expect(sanitized[1]).not.toBe(source[1]);
    });

    it("returns undefined for a non-object", () => {
        expect(sanitizeObject(null)).toBeUndefined();
        expect(sanitizeObject("ada")).toBeUndefined();
        expect(sanitizeObject(1)).toBeUndefined();
    });

    it("preserves a cycle instead of throwing", () => {
        const source: { self?: object; id: number } = { id: 1 };
        source.self = source;
        const sanitized = sanitizeObject(source) as {
            self?: object;
            id: number;
        };
        expect(sanitized).not.toBe(source);
        expect(sanitized.self).toBe(sanitized);
        expect(sanitized.id).toBe(1);
    });
});
