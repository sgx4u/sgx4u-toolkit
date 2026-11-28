import { describe, expect, it } from "vitest";
import { isJSONObject } from "./is-json-object.js";

describe("isJSONObject", () => {
    it("requires a JSON object", () => {
        expect(isJSONObject({ a: 1 })).toBe(true);
        expect(isJSONObject([])).toBe(false);
        expect(isJSONObject({ a: undefined })).toBe(false);
        expect(isJSONObject(null)).toBe(false);
    });
});
