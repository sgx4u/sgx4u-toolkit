---
"@sgx4u/date-time": minor
---

Summary: `@sgx4u/date-time` takes flat arguments, returns `undefined` for invalid input, and can bind defaults with `createDateTime`.

A function that needs one value takes that value directly. A function that needs several values takes one object, and options are fields of that object. Invalid dates and unparseable text return `undefined`. `is*` functions return `false`. A bad time zone, locale, unit, or config still throws.

`createDateTime({ timeZone, locale, weekStartsOn, holidays, ... })` returns the root functions with those defaults. A field on a call replaces the default. `createRecurrence`, `createCron`, `createNaturalLanguage`, and `createAstronomy` take the same config. Business-day functions use the configured holidays. `indiaHolidays`, `unitedStatesHolidays`, and `unitedKingdomHolidays` return `{ date, name }` entries that can be passed as `holidays`.
