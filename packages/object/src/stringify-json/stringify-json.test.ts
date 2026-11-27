import { describe, expect, it } from "vitest";
import { stringifyJSON } from "./stringify-json.js";
import type { StringifyJSONParams } from "./stringify-json.types.js";

const samples: unknown[] = [
    null,
    true,
    false,
    0,
    -0,
    1,
    -1,
    1.5,
    "",
    'a"b',
    "\n",
    [],
    [1, 2],
    [1, undefined, 3],
    { b: 1, a: 2 },
    { a: [1, { b: 2 }] },
    { a: undefined, b: 1, c: () => 1 },
    { 10: "a", 2: "b" },
    new Date("2020-01-02T03:04:05.000Z"),
    new Number(1),
    new String("ab"),
    new Boolean(false),
];

describe("stringifyJSON", () => {
    it("matches JSON.stringify for ordinary values", () => {
        for (const sample of samples) {
            expect(stringifyJSON(sample)).toBe(JSON.stringify(sample));
            expect(stringifyJSON({ space: 2, value: sample })).toBe(
                JSON.stringify(sample, null, 2),
            );
        }
    });

    it("matches JSON.stringify spacing", () => {
        const value = { a: { b: 1 }, c: [1, 2] };
        expect(stringifyJSON({ space: 2, value })).toBe(
            JSON.stringify(value, null, 2),
        );
        expect(stringifyJSON({ space: 12, value })).toBe(
            JSON.stringify(value, null, 12),
        );
        expect(stringifyJSON({ space: "ab", value })).toBe(
            JSON.stringify(value, null, "ab"),
        );
        expect(stringifyJSON({ space: "0123456789XYZ", value })).toBe(
            JSON.stringify(value, null, "0123456789XYZ"),
        );
        expect(stringifyJSON({ space: 0, value })).toBe(JSON.stringify(value));
    });

    it("returns undefined for an omitted root", () => {
        expect(stringifyJSON(undefined)).toBeUndefined();
        expect(stringifyJSON(() => 1)).toBeUndefined();
        expect(stringifyJSON(Symbol("s"))).toBeUndefined();
        expect(stringifyJSON(1n)).toBeUndefined();
    });

    it("sorts object keys by UTF-16 code units when stable is set", () => {
        expect(
            stringifyJSON({ stable: true, value: { b: 1, a: 2, A: 3 } }),
        ).toBe('{"A":3,"a":2,"b":1}');
        expect(
            stringifyJSON({
                stable: true,
                value: { 10: "a", 2: "b", nested: { d: 1, c: 2 } },
            }),
        ).toBe('{"10":"a","2":"b","nested":{"c":2,"d":1}}');
    });

    it("throws RangeError for a cycle by default", () => {
        const box: { self?: object } = {};
        box.self = box;
        expect(() => stringifyJSON(box)).toThrow(RangeError);
    });

    it("replaces or skips a cycle", () => {
        const box: { name: string; self?: object } = { name: "a" };
        box.self = box;
        expect(stringifyJSON({ circular: "replace", value: box })).toBe(
            '{"name":"a","self":"[Circular]"}',
        );
        expect(stringifyJSON({ circular: "skip", value: box })).toBe(
            '{"name":"a"}',
        );
    });

    it("writes null for a cycle in an array when circular is skip", () => {
        const items: unknown[] = [1];
        items.push(items);
        expect(stringifyJSON({ circular: "skip", value: items })).toBe(
            "[1,null]",
        );
    });

    it("throws when circular is not a supported policy", () => {
        const params = {
            circular: "preserve",
            value: 1,
        } as unknown as StringifyJSONParams;
        expect(() => stringifyJSON(params)).toThrow(RangeError);
    });

    it("throws TypeError for a nested bigint", () => {
        expect(() => stringifyJSON({ n: 1n })).toThrow(TypeError);
    });

    it("treats a record that owns value as options only for the allowed keys", () => {
        expect(stringifyJSON({ value: 1 })).toBe("1");
        expect(stringifyJSON({ extra: 2, value: 1 })).toBe(
            JSON.stringify({ extra: 2, value: 1 }),
        );
    });

    it("calls toJSON", () => {
        const value = {
            toJSON: (): unknown => ({ b: 1, a: undefined }),
        };
        expect(stringifyJSON(value)).toBe(JSON.stringify(value));
    });
});
