---
"@sgx4u/date-time": minor
---

Summary: First release of dates, durations, intervals, business time, and time zones.

Added: `createDateTime` binds a time zone, locale, week start, holiday list, and business hours, then returns the root functions with those defaults. A field on a call replaces the bound value. `createRecurrence`, `createCron`, `createNaturalLanguage`, and `createAstronomy` take the same config.

Added: `addDuration` and every other function that needs several values takes one flat object. A function that needs one value takes that value directly. Invalid dates and unparseable text return `undefined`. `isValidDate` and the other `is*` functions return `false` for invalid input.

Added: `indiaHolidays`, `unitedStatesHolidays`, and `unitedKingdomHolidays` return `{ date, name }` entries for one year. Business-day functions use a `holidays` list in that shape.
