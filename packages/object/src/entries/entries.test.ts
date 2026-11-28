import { describe, expect, it } from "vitest";
import { canonicalizeJSON, hashObject, type HashAlgorithm } from "../hash.js";
import {
    applyJSONPatch,
    createJSONPatch,
    type JSONPatchOperation,
    type JSONValue,
} from "../json-patch.js";

describe("json-patch and hash entries", () => {
    it("re-exports the patch and hash functions", () => {
        const value: JSONValue = { a: 1 };
        const patch: JSONPatchOperation[] = createJSONPatch({
            first: value,
            second: { a: 2 },
        });
        const algorithm: HashAlgorithm = "fnv1a64";

        expect(applyJSONPatch({ object: value, patch })).toEqual({ a: 2 });
        expect(canonicalizeJSON(value)).toBe('{"a":1}');
        expect(hashObject({ value, algorithm })).toMatch(/^[0-9a-f]{16}$/);
    });
});
