import { describe, expect, it } from "vitest";
import * as root from "../index.js";

describe("root entry", () => {
    it("does not export JSON Patch or hash functions", () => {
        expect("createJSONPatch" in root).toBe(false);
        expect("applyJSONPatch" in root).toBe(false);
        expect("canonicalizeJSON" in root).toBe(false);
        expect("hashObject" in root).toBe(false);
        expect("createObjectJSONPatch" in root).toBe(false);
        expect("createObjectHash" in root).toBe(false);
        expect(typeof root.createObject).toBe("function");
        expect(typeof root.isPlainObject).toBe("function");
    });
});
