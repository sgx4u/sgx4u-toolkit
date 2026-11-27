// Tests live beside the implementation: `<name>.test.ts` in the same folder.
import { describe, expect, it } from "vitest";
import { packageIdentifier, type PackageIdentifier } from "../index.js";

describe("packageIdentifier", () => {
    it("returns the public package name", () => {
        const packageName: PackageIdentifier = packageIdentifier();
        expect(packageName).toBe("@sgx4u/object");
    });
});
