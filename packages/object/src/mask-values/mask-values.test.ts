import { describe, expect, it } from "vitest";
import { maskValues } from "./mask-values.js";

describe("maskValues", () => {
    it("replaces a found path and keeps the rest by reference", () => {
        const shared = { id: 1 };
        const source = { password: "secret", shared };
        const masked = maskValues({
            object: source,
            paths: ["password"],
        }) as { password: string; shared: { id: number } };
        expect(masked.password).toBe("[Redacted]");
        expect(masked.shared).toBe(shared);
        expect(source.password).toBe("secret");
    });

    it("ignores a missing path and an illegal path", () => {
        const source = { id: 1 };
        expect(maskValues({ object: source, paths: ["missing", "a..b"] })).toBe(
            source,
        );
    });

    it("uses a custom replacement and a JSON pointer", () => {
        const masked = maskValues({
            object: { user: { token: "abc" } },
            pathStyle: "json-pointer",
            paths: ["/user/token"],
            replaceWith: "hidden",
        }) as { user: { token: string } };
        expect(masked.user.token).toBe("hidden");
    });

    it("masks an array index", () => {
        expect(
            maskValues({
                object: ["a", "b"],
                paths: [[1]],
            }),
        ).toEqual(["a", "[Redacted]"]);
    });

    it("returns undefined for a non-object", () => {
        expect(maskValues({ object: null, paths: ["a"] })).toBeUndefined();
        expect(maskValues({ object: "ada", paths: [] })).toBeUndefined();
    });

    it("throws when pathStyle is invalid", () => {
        expect(() =>
            maskValues({
                object: { id: 1 },
                pathStyle: "nope" as "dot",
                paths: ["id"],
            }),
        ).toThrow(RangeError);
    });
});
