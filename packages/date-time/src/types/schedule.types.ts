import type { CalendarDate, TimeRange, Weekday } from "./time.types.js";

/**
 * Weekly opening hours. A range whose end is not after its start continues
 * into the next day. `closures` removes a whole calendar day, including
 * the overnight part that starts that day.
 */
export interface WeeklySchedule {
    hours: Partial<Record<Weekday, readonly TimeRange[]>>;
    closures?: readonly CalendarDate[];
}
