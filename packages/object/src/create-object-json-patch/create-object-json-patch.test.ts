import { afterEach, describe, expect, it } from "vitest";
import { createObjectJSONPatch } from "./create-object-json-patch.js";

function polluted(): unknown {
    return ({} as { polluted?: unknown }).polluted;
}

afterEach(() => {
    delete (Object.prototype as { polluted?: unknown }).polluted;
});

describe("createObjectJSONPatch", () => {
    it("returns a frozen API that parses and applies", () => {
        const api = createObjectJSONPatch();
        expect(Object.isFrozen(api)).toBe(true);
        expect(api.parseJSONPointer("/a/0")).toEqual(["a", 0]);
        expect(api.formatJSONPointer(["a", 0])).toBe("/a/0");
        expect(api.isValidJSONPatch([{ op: "remove", path: "/a" }])).toBe(true);
        expect(
            api.applyJSONPatch({
                object: { a: 1 },
                patch: api.createJSONPatch({
                    first: { a: 1 },
                    second: { b: 2 },
                }),
            }),
        ).toEqual({ b: 2 });
        expect(
            api.applyJSONMergePatch({
                object: { a: 1 },
                patch: api.createJSONMergePatch({
                    first: { a: 1 },
                    second: { c: 3 },
                }),
            }),
        ).toEqual({ c: 3 });
    });

    it("binds prototypeKeys and lets a call override it", () => {
        const config: { prototypeKeys: "keep" | "skip" } = {
            prototypeKeys: "keep",
        };
        const keeping = createObjectJSONPatch(config);
        config.prototypeKeys = "skip";
        const skipping = createObjectJSONPatch({ prototypeKeys: "skip" });
        const patch = [
            {
                op: "add" as const,
                path: "/__proto__",
                value: { polluted: true },
            },
        ];

        const kept = keeping.applyJSONPatch({ object: {}, patch });
        const skipped = skipping.applyJSONPatch({ object: {}, patch });
        const overridden = skipping.applyJSONPatch({
            object: {},
            patch,
            prototypeKeys: "keep",
        });

        expect(Object.hasOwn(kept as object, "__proto__")).toBe(true);
        expect(Object.hasOwn(skipped as object, "__proto__")).toBe(false);
        expect(Object.hasOwn(overridden as object, "__proto__")).toBe(true);
        expect(polluted()).toBeUndefined();
    });

    it("binds prototypeKeys for merge patch too", () => {
        const api = createObjectJSONPatch({ prototypeKeys: "throw" });
        const patch = JSON.parse('{"__proto__": {"polluted": true}}') as object;
        expect(() => api.applyJSONMergePatch({ object: {}, patch })).toThrow(
            RangeError,
        );
        expect(
            Object.hasOwn(
                api.applyJSONMergePatch({
                    object: {},
                    patch,
                    prototypeKeys: "keep",
                }) as object,
                "__proto__",
            ),
        ).toBe(true);
        expect(polluted()).toBeUndefined();
    });

    it("validates config and ignores unknown keys", () => {
        expect(
            createObjectJSONPatch({
                pathStyle: "json-pointer",
                extra: 1,
            } as never).parseJSONPointer("/a"),
        ).toEqual(["a"]);
        expect(() => createObjectJSONPatch(null as never)).toThrow(TypeError);
        expect(() => createObjectJSONPatch([] as never)).toThrow(TypeError);
        expect(() =>
            createObjectJSONPatch({ pathStyle: "nope" } as never),
        ).toThrow(RangeError);
        expect(() => createObjectJSONPatch({ pathDelimiter: "" })).toThrow(
            RangeError,
        );
        expect(() =>
            createObjectJSONPatch({ prototypeKeys: "nope" } as never),
        ).toThrow(RangeError);
    });

    it("does not let one instance change the other", () => {
        const first = createObjectJSONPatch({ prototypeKeys: "skip" });
        const second = createObjectJSONPatch({ prototypeKeys: "keep" });
        const patch = [{ op: "add" as const, path: "/constructor", value: 1 }];
        expect(
            Object.hasOwn(
                first.applyJSONPatch({ object: {}, patch }) as object,
                "constructor",
            ),
        ).toBe(false);
        expect(
            Object.hasOwn(
                second.applyJSONPatch({ object: {}, patch }) as object,
                "constructor",
            ),
        ).toBe(true);
    });
});
