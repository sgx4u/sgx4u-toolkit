import type { CalendarDate, Weekday } from "./time.types.js";

/**
 * How a holiday is classified.
 */
export type HolidayType = "public" | "bank" | "optional" | "observance";

/**
 * How a holiday moves when it falls on a weekend.
 */
export type ObservancePolicy =
    "none" | "nearest-weekday" | "next-weekday" | "next-monday";

/**
 * A rule that places one holiday on the calendar.
 */
export type HolidayDateRule =
    | { kind: "fixed"; month: number; day: number }
    | {
          kind: "nth-weekday";
          month: number;
          weekday: Weekday;
          occurrence: number;
      }
    | {
          kind: "easter-offset";
          days: number;
          tradition?: "western" | "orthodox";
      }
    | {
          kind: "intl-calendar";
          calendar: string;
          month: number;
          day: number;
      }
    | { kind: "year-table"; dates: Readonly<Record<number, CalendarDate>> };

/**
 * One named holiday and the rule that places it.
 */
export interface HolidayRule {
    name: string;
    /**
     * Classification shown to callers.
     *
     * @defaultValue `"public"`
     */
    type?: HolidayType;
    date: HolidayDateRule;
    /**
     * Substitute day when the holiday falls on a weekend.
     *
     * @defaultValue `"none"`
     */
    observed?: ObservancePolicy;
    /**
     * First year the rule is active, inclusive.
     *
     * @defaultValue No lower bound.
     */
    activeFromYear?: number;
    /**
     * Last year the rule is active, inclusive.
     *
     * @defaultValue No upper bound.
     */
    activeUntilYear?: number;
}

/**
 * A holiday as it falls in one year, including the substitute day.
 */
export interface Holiday {
    name: string;
    type: HolidayType;
    date: CalendarDate;
    observedDate: CalendarDate;
}
