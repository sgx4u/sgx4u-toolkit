import { describe, expect, it } from "vitest";
import { cloneContinue, cloneDeepWith } from "./clone-deep-with.js";
import type { CloneDeepWithParams } from "./clone-deep-with.types.js";

describe("cloneDeepWith", () => {
    it("continues the default clone when the customizer returns cloneContinue", () => {
        const source = { a: 1, b: { c: 2 } };
        const cloned = cloneDeepWith({
            customizer: ({ value }) => (value === 1 ? 10 : cloneContinue),
            value: source,
        }) as { a: number; b: { c: number } };

        expect(cloned).toEqual({ a: 10, b: { c: 2 } });
        expect(cloned).not.toBe(source);
        expect(cloned.b).not.toBe(source.b);
    });

    it("stores undefined when the customizer returns undefined", () => {
        const result = cloneDeepWith({
            customizer: ({ key }) => (key === "a" ? undefined : cloneContinue),
            value: { a: 1, b: 2 },
        }) as { a?: number; b?: number };

        expect(Object.hasOwn(result, "a")).toBe(true);
        expect(result.a).toBeUndefined();
        expect(result.b).toBe(2);
    });

    it("uses a customizer object as-is", () => {
        const replacement = { replaced: true };
        const result = cloneDeepWith({
            customizer: ({ key }) =>
                key === "a" ? replacement : cloneContinue,
            value: { a: { nested: 1 } },
        }) as { a: { replaced?: boolean } };

        expect(result.a).toBe(replacement);
    });

    it("throws TypeError when customizer is not a function", () => {
        expect(() =>
            cloneDeepWith({
                customizer:
                    "no" as unknown as CloneDeepWithParams["customizer"],
                value: {},
            }),
        ).toThrow(TypeError);
        expect(() =>
            cloneDeepWith(null as unknown as CloneDeepWithParams),
        ).toThrow(TypeError);
    });

    it("throws RangeError for an unknown policy or a rejected cycle", () => {
        const box: { self?: object } = {};
        box.self = box;

        expect(() =>
            cloneDeepWith({
                circular: "nope",
                customizer: () => cloneContinue,
                value: {},
            } as unknown as CloneDeepWithParams),
        ).toThrow(RangeError);
        expect(() =>
            cloneDeepWith({
                circular: "throw",
                customizer: () => cloneContinue,
                value: box,
            }),
        ).toThrow(RangeError);
    });

    it("keeps a class prototype when asked", () => {
        const source = new Box(1);
        const cloned = cloneDeepWith({
            customizer: () => cloneContinue,
            prototypes: "keep",
            value: source,
        });

        expect(Object.getPrototypeOf(cloned)).toBe(Box.prototype);
        expect(cloned).not.toBe(source);
    });
});

/**
 * A class instance used to show the prototype policy.
 */
class Box {
    public id: number;

    public constructor(id: number) {
        this.id = id;
    }
}
