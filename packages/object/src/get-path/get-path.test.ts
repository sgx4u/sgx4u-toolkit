import { afterEach, describe, expect, it } from "vitest";
import type { GetPathParams } from "./get-path.types.js";
import { getPath } from "./get-path.js";

function sparseTriple(): number[] {
    const values: number[] = [];
    values[0] = 1;
    values[2] = 3;
    return values;
}

afterEach(() => {
    delete (Object.prototype as { polluted?: unknown }).polluted;
});

describe("getPath", () => {
    it("reads a literal path and a default", () => {
        const source = { profile: { name: "Ada", age: 1 } };
        const name = getPath({ object: source, path: "profile.name" });
        const age = getPath({
            object: source,
            path: "profile.age",
            defaultValue: 0,
        });
        const bySegments = getPath({
            object: source,
            path: ["profile", "name"],
        });
        const nameCheck: string | undefined = name;
        const ageCheck: number = age;
        const segmentCheck: string | undefined = bySegments;

        expect(nameCheck).toBe("Ada");
        expect(ageCheck).toBe(1);
        expect(segmentCheck).toBe("Ada");
    });

    it("returns the default for a missing path and not for an explicit undefined", () => {
        const object = { a: undefined as undefined, b: 1 };
        expect(getPath({ object, path: "a", defaultValue: "missing" })).toBe(
            undefined,
        );
        expect(getPath({ object, path: "c", defaultValue: "missing" })).toBe(
            "missing",
        );
        expect(getPath({ object, path: "c" })).toBeUndefined();
    });

    it("returns the value itself for an empty path", () => {
        const object = { a: 1 };
        expect(getPath({ object, path: "" })).toBe(object);
        expect(getPath({ object: null, path: "" })).toBeNull();
        expect(getPath({ object: 5, path: "a", defaultValue: 0 })).toBe(0);
    });

    it("returns the default for an illegal path and a sparse hole", () => {
        const sparse = sparseTriple();
        expect(getPath({ object: sparse, path: 1, defaultValue: "hole" })).toBe(
            "hole",
        );
        expect(getPath({ object: sparse, path: 2 })).toBe(3);
        expect(Object.hasOwn(sparse, 1)).toBe(false);
        expect(
            getPath({ object: { a: 1 }, path: "a..b", defaultValue: "bad" }),
        ).toBe("bad");
    });

    it("reads a JSON Pointer and a custom delimiter", () => {
        const object = { a: { b: 1 } };
        expect(
            getPath({
                object,
                path: "/a/b",
                pathStyle: "json-pointer",
            }),
        ).toBe(1);
        expect(getPath({ object, path: "a/b", pathDelimiter: "/" })).toBe(1);
    });

    it("throws for an unknown option and not for prototypeKeys throw", () => {
        expect(
            getPath({
                object: { a: 1 },
                path: "a",
                prototypeKeys: "throw",
            }),
        ).toBe(1);
        expect(
            getPath({
                object: {},
                path: "__proto__.polluted",
                prototypeKeys: "throw",
                defaultValue: "skipped",
            }),
        ).toBe("skipped");
        expect(() =>
            getPath({
                object: {},
                path: "a",
                prototypeKeys: "bad",
            } as unknown as GetPathParams),
        ).toThrow(
            '`prototypeKeys` must be "skip", "throw", or "keep"; received "bad".',
        );
        expect(() =>
            getPath({
                object: {},
                path: "a",
                pathDelimiter: "",
            }),
        ).toThrow(RangeError);
    });

    it("does not pollute Object.prototype from a JSON payload or a dangerous path", () => {
        const payload = JSON.parse(
            '{"__proto__": {"polluted": true}, "ok": 1}',
        );
        expect(
            getPath({
                object: payload,
                path: "__proto__",
                prototypeKeys: "keep",
            }),
        ).toEqual({ polluted: true });
        expect(getPath({ object: payload, path: "__proto__.polluted" })).toBe(
            undefined,
        );
        expect(getPath({ object: {}, path: "__proto__.polluted" })).toBe(
            undefined,
        );
        expect(({} as { polluted?: unknown }).polluted).toBeUndefined();
    });
});
