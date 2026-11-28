import { describe, expect, it } from "vitest";
import type { KeyCase } from "../types/object-config.types.js";
import { convertKeys } from "./convert-keys.js";

const caseExamples = [
    ["HTTPServer", false, "camelCase", "httpServer"],
    ["HTTPServer", false, "pascalCase", "HttpServer"],
    ["HTTPServer", false, "snakeCase", "http_server"],
    ["HTTPServer", false, "kebabCase", "http-server"],
    ["HTTPServer", false, "constantCase", "HTTP_SERVER"],
    ["HTTPServer", true, "camelCase", "HTTPServer"],
    ["HTTPServer", true, "pascalCase", "HTTPServer"],
    ["HTTPServer", true, "snakeCase", "http_server"],
    ["HTTPServer", true, "kebabCase", "http-server"],
    ["HTTPServer", true, "constantCase", "HTTP_SERVER"],
    ["userID", false, "camelCase", "userId"],
    ["userID", false, "snakeCase", "user_id"],
    ["userID", false, "constantCase", "USER_ID"],
    ["userID", true, "camelCase", "userID"],
    ["userID", true, "pascalCase", "UserID"],
    ["userID", true, "snakeCase", "user_id"],
    ["userID", true, "constantCase", "USER_ID"],
    ["_privateKey", false, "camelCase", "_privateKey"],
    ["_privateKey", false, "snakeCase", "_private_key"],
    ["userID", false, "upper", "USERID"],
    ["userID", false, "lower", "userid"],
    ["_privateKey", false, "upper", "_PRIVATEKEY"],
    ["_privateKey", false, "lower", "_privatekey"],
    ["HTTPServer", false, "upper", "HTTPSERVER"],
    ["HTTPServer", false, "lower", "httpserver"],
    ["foo-bar", false, "upper", "FOO-BAR"],
    ["$$userID", false, "camelCase", "$$userId"],
    ["$$userID", false, "snakeCase", "$$user_id"],
    ["version2Name", false, "camelCase", "version2Name"],
    ["version2Name", false, "snakeCase", "version_2_name"],
    ["XMLHttpRequest", false, "camelCase", "xmlHttpRequest"],
    ["XMLHttpRequest", true, "camelCase", "XMLHttpRequest"],
] as const;

describe("convertKeys", () => {
    it.each(caseExamples)(
        "converts %s with preserve %s to %s as %s",
        (key, preserveConsecutiveUppercase, keyCase, expected) => {
            expect(
                convertKeys({
                    object: { [key]: 1 },
                    case: keyCase satisfies KeyCase,
                    preserveConsecutiveUppercase,
                }),
            ).toEqual({ [expected]: 1 });
        },
    );

    it("converts nested objects and objects inside arrays by default", () => {
        expect(
            convertKeys({
                object: { item_list: [{ zip_code: "1" }], user_name: "Ada" },
            }),
        ).toEqual({
            itemList: [{ zipCode: "1" }],
            userName: "Ada",
        });
    });

    it("leaves nested keys unchanged when deep is false", () => {
        const nested = { first_name: "Ada" };
        const result = convertKeys({
            object: { user_name: nested },
            deep: false,
        });

        expect(result).toEqual({ userName: { first_name: "Ada" } });
        expect(result?.userName).toBe(nested);
    });

    it("leaves an excluded key unchanged", () => {
        const pattern = /meta_/g;
        pattern.lastIndex = 2;

        expect(
            convertKeys({
                object: { user_id: 1, user_name: 2, meta_tag: 3 },
                exclude: ["user_id", pattern],
            }),
        ).toEqual({ user_id: 1, userName: 2, meta_tag: 3 });
        expect(pattern.lastIndex).toBe(2);
    });

    it("converts the stop path key and leaves the subtree unchanged", () => {
        const address = { zip_code: "1" };
        const result = convertKeys({
            object: {
                user_name: { first_name: "A", address_info: address },
            },
            stopPaths: ["user_name.address_info"],
        });

        expect(result).toEqual({
            userName: {
                firstName: "A",
                addressInfo: { zip_code: "1" },
            },
        });
        expect(result?.userName).toMatchObject({
            addressInfo: address,
        });
        expect((result?.userName as { addressInfo: object }).addressInfo).toBe(
            address,
        );
    });

    it("matches a stop path against the original key, including array indexes", () => {
        expect(
            convertKeys({
                object: { item_list: [{ zip_code: "1", city_name: "X" }] },
                stopPaths: ["item_list.0"],
            }),
        ).toEqual({
            itemList: [{ zip_code: "1", city_name: "X" }],
        });
    });

    it("reads a JSON Pointer stop path", () => {
        expect(
            convertKeys({
                object: { user_name: { first_name: "Ada" } },
                stopPaths: ["/user_name"],
                pathStyle: "json-pointer",
            }),
        ).toEqual({
            userName: { first_name: "Ada" },
        });
    });

    it("skips a dangerous converted key and does not mutate the input", () => {
        const input = { constructor: 1, user_id: 2 };
        const result = convertKeys({ object: input });

        expect(result).toEqual({ userId: 2 });
        expect(input).toEqual({ constructor: 1, user_id: 2 });
        expect(({} as { polluted?: unknown }).polluted).toBeUndefined();
    });

    it("throws for an unknown case and an unparsable stop path", () => {
        expect(() =>
            convertKeys({
                object: { a: 1 },
                case: "title" as "camelCase",
            }),
        ).toThrow(RangeError);
        expect(() =>
            convertKeys({
                object: { a: 1 },
                stopPaths: ["."],
            }),
        ).toThrow(RangeError);
    });

    it("returns undefined for null, primitives, and arrays", () => {
        expect(convertKeys({ object: null })).toBeUndefined();
        expect(convertKeys({ object: 1 })).toBeUndefined();
        expect(convertKeys({ object: [] })).toBeUndefined();
    });
});
