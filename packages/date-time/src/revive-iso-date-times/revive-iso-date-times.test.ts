import { describe, expect, it } from "vitest";
import { reviveIsoDateTimes } from "../index.js";

describe("reviveIsoDateTimes", () => {
    it("converts a strict offset date-time and leaves a date-only string", () => {
        const revived = JSON.parse(
            JSON.stringify({
                at: "2026-11-26T03:30:00+05:30",
                day: "2026-11-26",
                plain: "hello",
                count: 1,
                flag: true,
                empty: null,
                nested: { floating: "2026-11-26T00:00:00" },
                list: ["2024-02-29T00:00:00Z", "2024-02-29"],
            }),
            reviveIsoDateTimes,
        ) as {
            at: Date;
            day: string;
            plain: string;
            count: number;
            flag: boolean;
            empty: null;
            nested: { floating: string };
            list: [Date, string];
        };

        expect(revived.at).toBeInstanceOf(Date);
        expect(revived.at.toISOString()).toBe("2026-11-25T22:00:00.000Z");
        expect(revived.day).toBe("2026-11-26");
        expect(revived.plain).toBe("hello");
        expect(revived.count).toBe(1);
        expect(revived.flag).toBe(true);
        expect(revived.empty).toBeNull();
        expect(revived.nested.floating).toBe("2026-11-26T00:00:00");
        expect(revived.list[0].toISOString()).toBe("2024-02-29T00:00:00.000Z");
        expect(revived.list[1]).toBe("2024-02-29");
    });

    it("accepts case, a basic offset, fractions, and the year bounds", () => {
        expect(reviveIsoDateTimes("at", "2026-11-26t00:00:00.5z")).toEqual(
            new Date("2026-11-26T00:00:00.500Z"),
        );
        expect(reviveIsoDateTimes("at", "2026-11-26T00:00:00+0530")).toEqual(
            new Date("2026-11-25T18:30:00.000Z"),
        );
        expect(reviveIsoDateTimes("at", "0000-01-01T00:00:00Z")).toEqual(
            new Date("0000-01-01T00:00:00.000Z"),
        );
        expect(reviveIsoDateTimes("at", "9999-12-31T23:59:59.999Z")).toEqual(
            new Date("9999-12-31T23:59:59.999Z"),
        );
        expect(reviveIsoDateTimes("at", "2026-01-31T23:59:59Z")).toEqual(
            new Date("2026-01-31T23:59:59.000Z"),
        );
        expect(reviveIsoDateTimes("at", "0000-02-29T00:00:00Z")).toEqual(
            new Date("0000-02-29T00:00:00.000Z"),
        );
    });

    it("leaves invalid text and every non-string unchanged", () => {
        expect(reviveIsoDateTimes("day", "2026-11-26")).toBe("2026-11-26");
        expect(reviveIsoDateTimes("bad", "2024-02-30T00:00:00Z")).toBe(
            "2024-02-30T00:00:00Z",
        );
        expect(reviveIsoDateTimes("bad", "2023-02-29T00:00:00Z")).toBe(
            "2023-02-29T00:00:00Z",
        );
        expect(reviveIsoDateTimes("bad", "2026-04-31T00:00:00Z")).toBe(
            "2026-04-31T00:00:00Z",
        );
        expect(reviveIsoDateTimes("bad", "2026-11-26T00:00:00")).toBe(
            "2026-11-26T00:00:00",
        );
        expect(reviveIsoDateTimes("bad", "")).toBe("");
        expect(reviveIsoDateTimes("n", 0)).toBe(0);
        expect(reviveIsoDateTimes("n", null)).toBeNull();
        expect(reviveIsoDateTimes("n", undefined)).toBeUndefined();
        expect(reviveIsoDateTimes("n", false)).toBe(false);

        const box = { keep: true };
        expect(reviveIsoDateTimes("n", box)).toBe(box);
    });
});
