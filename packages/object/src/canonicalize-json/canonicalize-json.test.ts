import { describe, expect, it } from "vitest";
import { canonicalizeJSON } from "./canonicalize-json.js";

describe("canonicalizeJSON", () => {
    it("sorts keys, omits whitespace, and uses JSON number and string text", () => {
        expect(canonicalizeJSON({ b: 1, a: 2, A: 3 })).toBe(
            '{"A":3,"a":2,"b":1}',
        );
        expect(canonicalizeJSON(-0)).toBe("0");
        expect(canonicalizeJSON(1.5)).toBe("1.5");
        expect(canonicalizeJSON(1e21)).toBe("1e+21");
        expect(canonicalizeJSON('say "hi"')).toBe('"say \\"hi\\""');
        expect(canonicalizeJSON([true, false, null, "a"])).toBe(
            '[true,false,null,"a"]',
        );
        expect(canonicalizeJSON({ z: [1, { b: true }] })).toBe(
            '{"z":[1,{"b":true}]}',
        );
    });

    it("repeats a shared object and rejects a cycle", () => {
        const child = { n: 1 };
        expect(canonicalizeJSON({ a: child, b: child })).toBe(
            '{"a":{"n":1},"b":{"n":1}}',
        );
        const cycle: { self?: unknown } = {};
        cycle.self = cycle;
        expect(canonicalizeJSON(cycle)).toBeUndefined();
    });

    it("returns undefined for values that are not JSON", () => {
        const symbolKey = { a: 1, [Symbol("s")]: 2 };
        const values = [
            undefined,
            Number.NaN,
            Number.POSITIVE_INFINITY,
            Number.NEGATIVE_INFINITY,
            1n,
            () => 1,
            Symbol("s"),
            new Date(0),
            new Map(),
            [1, undefined],
            { a: undefined },
            symbolKey,
            [1, symbolKey],
        ];

        for (const value of values) {
            expect(canonicalizeJSON(value)).toBeUndefined();
        }
        const hole = [1, 1];
        delete hole[0];
        expect(canonicalizeJSON(hole)).toBeUndefined();
    });

    it("sorts keys by UTF-16 code units", () => {
        expect(canonicalizeJSON({ é: 1, e: 2, "\u0000": 3 })).toBe(
            '{"\\u0000":3,"e":2,"é":1}',
        );
    });
});
