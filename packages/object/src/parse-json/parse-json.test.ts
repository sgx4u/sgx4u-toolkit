import { describe, expect, it } from "vitest";
import { parseJSON } from "./parse-json.js";
import type { ParseJSONParams } from "./parse-json.types.js";

function ownDangerous(value: Record<string, unknown>, key: string): void {
    Object.defineProperty(value, key, {
        configurable: true,
        enumerable: true,
        value: { admin: true },
        writable: true,
    });
}

describe("parseJSON", () => {
    it("parses JSON text", () => {
        expect(parseJSON('{"id":1}')).toEqual({ id: 1 });
        expect(parseJSON("null")).toBeNull();
        expect(parseJSON("[1,2]")).toEqual([1, 2]);
        expect(parseJSON({ text: '"ada"' })).toBe("ada");
    });

    it("drops dangerous keys", () => {
        const parsed = parseJSON(
            '{"__proto__":{"admin":true},"prototype":1,"constructor":2,"ok":3}',
        ) as Record<string, unknown>;
        expect(parsed).toEqual({ ok: 3 });
        expect(Object.hasOwn(parsed, "__proto__")).toBe(false);
        expect(Object.hasOwn(parsed, "prototype")).toBe(false);
        expect(Object.hasOwn(parsed, "constructor")).toBe(false);
        expect(({} as { admin?: boolean }).admin).toBeUndefined();
    });

    it("drops a dangerous key even when the reviver returns it", () => {
        const parsed = parseJSON({
            reviver: (_key, value) => value,
            text: '{"__proto__":{"admin":true},"role":"user"}',
        }) as Record<string, unknown>;
        expect(parsed).toEqual({ role: "user" });
        expect(Object.hasOwn(parsed, "__proto__")).toBe(false);
    });

    it("keeps a reviver result that has no dangerous key", () => {
        const sentinel = { ok: true };
        const parsed = parseJSON({
            reviver: (key, value) => (key === "a" ? sentinel : value),
            text: '{"a":1}',
        }) as { a: unknown };
        expect(parsed.a).toBe(sentinel);
    });

    it("strips a dangerous key built by the reviver", () => {
        const crafted: Record<string, unknown> = { ok: 1 };
        ownDangerous(crafted, "constructor");
        const parsed = parseJSON({
            reviver: () => crafted,
            text: "1",
        }) as Record<string, unknown>;
        expect(parsed.ok).toBe(1);
        expect(Object.hasOwn(parsed, "constructor")).toBe(false);
        expect(crafted.ok).toBe(1);
        expect(Object.hasOwn(crafted, "constructor")).toBe(true);
    });

    it("returns undefined for invalid JSON and non-strings", () => {
        expect(parseJSON("{")).toBeUndefined();
        expect(parseJSON("")).toBeUndefined();
        expect(parseJSON(1)).toBeUndefined();
        expect(parseJSON(null)).toBeUndefined();
        expect(
            parseJSON({ text: 1 } as unknown as ParseJSONParams),
        ).toBeUndefined();
        expect(
            parseJSON({
                extra: true,
                text: "{}",
            } as unknown as ParseJSONParams),
        ).toBeUndefined();
    });

    it("throws when reviver is present and not a function", () => {
        const params = {
            reviver: "no",
            text: "{}",
        } as unknown as ParseJSONParams;
        expect(() => parseJSON(params)).toThrow(TypeError);
    });
});
