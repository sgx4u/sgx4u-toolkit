import { describe, expect, it } from "vitest";
import { measureDisplayWidth } from "../utils/display-width.utils.js";
import { truncateToDisplayWidth } from "./truncate-to-display-width.js";
describe("truncateToDisplayWidth", () => {
    it("stays within the column budget", () => {
        const result = truncateToDisplayWidth({
            value: "hello world",
            maximumWidth: 6,
        });
        expect(measureDisplayWidth(result ?? "", false)).toBeLessThanOrEqual(6);
        expect(truncateToDisplayWidth({ value: "hi", maximumWidth: 5 })).toBe(
            "hi",
        );
        expect(
            truncateToDisplayWidth({ value: "あいう", maximumWidth: 3 }),
        ).toBe("あ…");
        expect(
            truncateToDisplayWidth({
                value: "👋",
                maximumWidth: 1,
                omission: "",
            }),
        ).toBe("");
        expect(truncateToDisplayWidth({ value: "👋", maximumWidth: 1 })).toBe(
            "…",
        );
        expect(() =>
            truncateToDisplayWidth({ value: "a", maximumWidth: -1 }),
        ).toThrow(RangeError);
        expect(
            truncateToDisplayWidth({
                value: 1 as unknown as string,
                maximumWidth: 1,
            }),
        ).toBeUndefined();
    });
});
