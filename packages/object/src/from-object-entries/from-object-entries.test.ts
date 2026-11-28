import { describe, expect, it } from "vitest";
import { fromObjectEntries } from "./from-object-entries.js";

describe("fromObjectEntries", () => {
    it("builds an object and skips dangerous keys", () => {
        expect(
            fromObjectEntries([
                ["id", 1],
                ["name", "Ada"],
            ]),
        ).toEqual({ id: 1, name: "Ada" });
        const parsed = JSON.parse('{"__proto__": {"polluted": true}, "ok": 1}');
        const built = fromObjectEntries(Object.entries(parsed));
        expect(built).toEqual({ ok: 1 });
        expect(Object.hasOwn(Object.prototype, "polluted")).toBe(false);
        expect(fromObjectEntries(null as unknown as [])).toBeUndefined();
        expect(fromObjectEntries("ab" as unknown as [])).toBeUndefined();
        expect(
            fromObjectEntries([["only"] as unknown as [string, unknown]]),
        ).toEqual({});
    });
});
