/**
 * English date phrases.
 *
 * Import this entry when a program needs natural-language dates. It is
 * separate from the root entry so a program that never parses prose does
 * not load it.
 */
export { findDatesInText } from "./find-dates-in-text/find-dates-in-text.js";
export { parseNaturalDate } from "./parse-natural-date/parse-natural-date.js";
export { parseNaturalDateRange } from "./parse-natural-date-range/parse-natural-date-range.js";
export type { FoundDate } from "./types/natural-language.types.js";
