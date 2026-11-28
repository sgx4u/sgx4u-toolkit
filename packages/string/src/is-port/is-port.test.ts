import { describe, expect, it } from "vitest";
import { isPort } from "./is-port.js";
describe("isPort", () => {
    it("accepts 0 through 65535", () => {
        expect(isPort("0")).toBe(true);
        expect(isPort("65535")).toBe(true);
        expect(isPort("65536")).toBe(false);
        expect(isPort("08")).toBe(false);
        expect(isPort(null)).toBe(false);
    });
});
