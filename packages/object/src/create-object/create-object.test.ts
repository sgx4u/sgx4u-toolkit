import { describe, expect, it } from "vitest";
import { getPath } from "../get-path/get-path.js";
import { mergeDeep } from "../merge-deep/merge-deep.js";
import { createObject } from "./create-object.js";

describe("createObject", () => {
    it("binds defaults without changing standalone functions", () => {
        const concatenated = createObject({
            arrayMerge: "concat",
            pathStyle: "json-pointer",
        });
        const replaced = createObject({ arrayMerge: "replace" });

        expect(
            concatenated.mergeDeep({ objects: [{ a: [1] }, { a: [2] }] }),
        ).toEqual({ a: [1, 2] });
        expect(
            replaced.mergeDeep({ objects: [{ a: [1] }, { a: [2] }] }),
        ).toEqual({ a: [2] });
        expect(mergeDeep({ objects: [{ a: [1] }, { a: [2] }] })).toEqual({
            a: [2],
        });
        expect(concatenated.getPath({ object: { a: 1 }, path: "/a" })).toBe(1);
        expect(
            concatenated.getPath({
                object: { a: 1 },
                path: "/a",
                pathStyle: "dot",
            }),
        ).toBeUndefined();
        expect(getPath({ object: { a: 1 }, path: "a" })).toBe(1);
        expect(Object.isFrozen(concatenated)).toBe(true);
        expect(
            concatenated.createObject().mergeDeep({
                objects: [{ a: [1] }, { a: [2] }],
            }),
        ).toEqual({ a: [1, 2] });
    });

    it("accepts every config field and lets a call replace it", () => {
        const object = createObject({
            arrayMerge: "index",
            circular: "skip",
            emptyValues: ["null", "undefined"],
            includeNonEnumerable: false,
            includeSymbols: false,
            keyCase: "snakeCase",
            locale: ["en"],
            maxDepth: 1,
            pathDelimiter: "/",
            pathStyle: "dot",
            preserveConsecutiveUppercase: false,
            prototypeKeys: "skip",
            prototypes: "strip",
        });

        expect(object.convertKeys({ object: { userName: 1 } })).toEqual({
            user_name: 1,
        });
        expect(
            object.convertKeys({
                case: "camelCase",
                object: { user_name: 1 },
            }),
        ).toEqual({ userName: 1 });
        expect(object.removeEmptyValues({ object: { a: null, b: 0 } })).toEqual(
            {
                b: 0,
            },
        );
        expect(object.flattenObject({ object: { a: { b: 1 } } })).toEqual({
            a: { b: 1 },
        });
        expect(object.getPath({ object: { a: { b: 1 } }, path: "a/b" })).toBe(
            1,
        );
        expect(object.cloneDeep({ nested: { id: 1 } })).toEqual({
            nested: { id: 1 },
        });
        expect(object.stringifyJSON({ self: 1 })).toBe('{"self":1}');
        expect(object.isPlainObject({})).toBe(true);
        expect(object.clone(1)).toBe(1);
        expect(object.parseJSON('{"a":1}')).toEqual({ a: 1 });
        expect(object.isValidJSON("{}")).toBe(true);
        expect(object.fromObjectEntries([["id", 1]])).toEqual({ id: 1 });
        expect(object.toMap({ id: 1 })?.get("id")).toBe(1);
        expect(object.createEmptyObject()).toEqual(Object.create(null));
        expect(object.assign({ objects: [{ a: 1 }, { b: 2 }] })).toEqual({
            a: 1,
            b: 2,
        });
        expect(object.pick({ keys: ["a"], object: { a: 1, b: 2 } })).toEqual({
            a: 1,
        });
        expect(object.sortKeys({ object: { b: 1, a: 2 } })).toEqual({
            a: 2,
            b: 1,
        });
        expect(object.isEqual({ first: 1, second: 1 })).toBe(true);
        expect(
            object.walkObject({ object: { a: 1 }, visitor: () => undefined }),
        ).toBeUndefined();
        expect(
            createObject({ maxDepth: Number.POSITIVE_INFINITY }).flattenObject({
                object: { a: 1 },
            }),
        ).toEqual({ a: 1 });
        expect(
            createObject({ locale: "en" }).sortKeys({ object: { b: 1, a: 2 } }),
        ).toEqual({
            a: 2,
            b: 1,
        });
    });

    it("throws when the config is not a plain object or a field is invalid", () => {
        expect(() => createObject(null as never)).toThrow(TypeError);
        expect(() => createObject([] as never)).toThrow(TypeError);
        expect(() => createObject({ pathDelimiter: "" })).toThrow(RangeError);
        expect(() => createObject({ pathStyle: "dots" as "dot" })).toThrow(
            RangeError,
        );
        expect(() => createObject({ keyCase: "camel" as "camelCase" })).toThrow(
            RangeError,
        );
        expect(() => createObject({ arrayMerge: "zip" as "replace" })).toThrow(
            RangeError,
        );
        expect(() => createObject({ prototypeKeys: "drop" as "skip" })).toThrow(
            RangeError,
        );
        expect(() => createObject({ circular: "loop" as "skip" })).toThrow(
            RangeError,
        );
        expect(() => createObject({ prototypes: "copy" as "strip" })).toThrow(
            RangeError,
        );
        expect(() =>
            createObject({ includeSymbols: "yes" as unknown as boolean }),
        ).toThrow(RangeError);
        expect(() =>
            createObject({
                includeNonEnumerable: "yes" as unknown as boolean,
            }),
        ).toThrow(RangeError);
        expect(() =>
            createObject({
                preserveConsecutiveUppercase: "yes" as unknown as boolean,
            }),
        ).toThrow(RangeError);
        expect(() =>
            createObject({ emptyValues: "null" as unknown as [] }),
        ).toThrow(RangeError);
        expect(() =>
            createObject({ emptyValues: ["missing" as "null"] }),
        ).toThrow(RangeError);
        expect(() => createObject({ locale: 1 as unknown as string })).toThrow(
            RangeError,
        );
        expect(() => createObject({ maxDepth: -1 })).toThrow(RangeError);
        expect(() => createObject({ maxDepth: Number.NaN })).toThrow(
            RangeError,
        );
        const object = createObject({ arrayMerge: "concat" });
        expect(() => object.createObject(1 as never)).toThrow(TypeError);
    });
});
