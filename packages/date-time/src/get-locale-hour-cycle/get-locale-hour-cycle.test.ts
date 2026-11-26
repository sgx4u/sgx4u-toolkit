import { describe, expect, it } from "vitest";
import { getLocaleHourCycle } from "../index.js";

describe("getLocaleHourCycle", () => {
    it("reports a 12-hour cycle for en-US and a 24-hour cycle for en-GB", () => {
        expect(getLocaleHourCycle("en-US")).toBe("h12");
        expect(getLocaleHourCycle("en-GB")).toBe("h23");
        expect(getLocaleHourCycle("ja-JP")).toBe("h23");
        expect(getLocaleHourCycle("de-DE")).toBe("h23");
    });

    it("uses the runtime locale when the argument is omitted", () => {
        expect(getLocaleHourCycle()).toBe("h12");
    });

    it("throws when the locale tag is invalid", () => {
        expect(() => getLocaleHourCycle("not a locale")).toThrow(RangeError);
        expect(() => getLocaleHourCycle("not a locale")).toThrow(
            "Incorrect locale information provided",
        );
    });
});
