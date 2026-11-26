<a id="readme-top"></a>

<div align="center">
    <a href="https://github.com/sgx4u/sgx4u-toolkit">
        <img src="https://github.com/sgx4u/sgx4u-toolkit/blob/develop/logo.svg?raw=true" width="75" alt="SGX4U" />
    </a>

<h1 align="center">🌟 @sgx4u/date-time 🌟</h1>

<h3 align="center">Dates, durations, intervals, calendars, and time zones.</h3>

<p align="center">
    <a href="../../.github/workflows/ci.yml"><img src="https://img.shields.io/github/actions/workflow/status/sgx4u/sgx4u-toolkit/ci.yml?branch=develop&style=for-the-badge&label=ci&labelColor=353535" alt="ci" /></a>
    <a href="../../LICENSE"><img src="https://img.shields.io/github/license/sgx4u/sgx4u-toolkit?style=for-the-badge&labelColor=353535&color=4f46e5" alt="License: MIT" /></a>
    <a href="./package.json"><img src="https://img.shields.io/badge/node-%3E%3D22.12-339933?style=for-the-badge&logo=nodedotjs&logoColor=white&labelColor=353535" alt="Node &gt;=22.12" /></a>
    <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
</p>

<p align="center">Part of <a href="../../README.md">@sgx4u/toolkit</a>.</p>
</div>

<br />

<h2 id="about">💫 About</h2>

`@sgx4u/date-time` creates, compares, formats, and parses dates. It also covers durations, half-open intervals, business days, holiday rules, time zones, and opening hours. Recurrence, cron, English date phrases, sunrise and moon phase, and country holiday lists are separate imports.

Experimental (`0.x`). Breaking changes may land in minor versions until 1.0.0.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br />

<h2 id="installation">📥 Installation</h2>

```sh
pnpm add @sgx4u/date-time       # pnpm
npm install @sgx4u/date-time    # npm
yarn add @sgx4u/date-time       # yarn
```

Requires Node `>=22.12`. The package publishes ESM (`import`) and CommonJS (`require`).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br />

<h2 id="usage">💡 Usage</h2>

```ts
import { isValidDate } from "@sgx4u/date-time";

isValidDate("2024-02-29"); // true
isValidDate("2024-02-30"); // false
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br />

<h2 id="conventions">🧭 API conventions</h2>

A function that needs one value takes that value directly: `isValidDate(value)`, `isLeapYear(year)`. A function that needs several values takes one flat object, and options are fields of that same object: `addDuration({ date, duration, timeZone })`.

Standard abbreviations are written in all capitals inside identifiers: `formatISODate`, `parseISODuration`, `toUTC`, `formatRFC2822Date`, `formatHTTPDate`. File names stay kebab-case.

Invalid data returns `undefined`. An `is*` function returns `false` for invalid input. A parser returns `undefined` when the text does not match. A function throws when `undefined` would hide a programming mistake: an unknown unit, an unusable time zone or locale, an invalid `weekStartsOn`, an invalid enum, an invalid `createDateTime` config, or a call whose `undefined` already means that nothing was found. The functions that throw are listed under Errors. Each guide names the case in `@throws`.

`createDateTime(config)` returns every root function with that config bound in. A field on the call replaces the config for that call. Standalone functions keep working with the built-in defaults. `createRecurrence`, `createCron`, `createNaturalLanguage`, and `createAstronomy` take the same config. The config is checked once and frozen. Instances do not share state, so two callers can keep different zones and holiday lists.

```ts
import { createDateTime } from "@sgx4u/date-time";

export const dateTime = createDateTime({
    weekStartsOn: 7,
    timeZone: "Asia/Kolkata",
    holidays: [{ date: "2026-01-26", name: "Republic Day" }],
});
```

| Config field             | Default                                                                 |
| ------------------------ | ----------------------------------------------------------------------- |
| `timeZone`               | System zone, read on each call                                          |
| `locale`                 | Runtime locale                                                          |
| `weekStartsOn`           | `1` (Monday)                                                            |
| `minimumDaysInFirstWeek` | `1`. ISO week functions always use Monday and `4`                       |
| `workingDays`            | `[1, 2, 3, 4, 5]`                                                       |
| `businessHours`          | `[{ start: "09:00", end: "17:00" }]`. An empty list means the whole day |
| `disambiguation`         | `"compatible"`                                                          |
| `now`                    | `() => new Date()`, read on each call that omits `now`                  |
| `holidays`               | `[]`                                                                    |
| `numeric`                | `"auto"`                                                                |
| `overflow`               | `"constrain"`                                                           |
| `formatPattern`          | None. `formatDate` requires `pattern` unless this is set                |
| `fiscalYearStartMonth`   | None. Fiscal calls require it unless this is set                        |
| `fiscalYearLabel`        | `"end-year"`                                                            |
| `relativeTimeStyle`      | `"long"`                                                                |

`holidays` entries are `{ date, name? }`. A date-only string is that calendar date in the configured time zone. `isHoliday(date)` on an instance uses the configured list. `isHoliday({ date, includeName: true })` returns `{ isHoliday, name? }`. Business-day and business-hour functions use the configured holidays. `indiaHolidays(year)`, `unitedStatesHolidays(year)`, and `unitedKingdomHolidays(year)` return the same `{ date, name }` shape.

Recurrence, cron, English phrases, astronomy, and country holidays stay on subpath imports. The root entry does not load them.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br />

<h2 id="functions">📘 Functions</h2>

The [function reference](./FUNCTIONS.md) lists every export with its subpath, parameters, return type, and a one-line description. Each name below links to that function's guide.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br />

### `@sgx4u/date-time`

- [`addBusinessDays`](./src/add-business-days/add-business-days.md) Moves a date by a number of business days, keeping the time of day.
- [`addBusinessHours`](./src/add-business-hours/add-business-hours.md) Adds working time, skipping nights, weekends, and holidays.
- [`addDuration`](./src/add-duration/add-duration.md) Adds a duration to a date.
- [`addDurations`](./src/add-durations/add-durations.md) Adds two durations field by field.
- [`addToTimeOfDay`](./src/add-to-time-of-day/add-to-time-of-day.md) Adds a duration to a time of day, wrapping past midnight.
- [`changeTimeZoneKeepingWallTime`](./src/change-time-zone-keeping-wall-time/change-time-zone-keeping-wall-time.md) Keeps the clock reading and moves it into another time zone.
- [`clampDate`](./src/clamp-date/clamp-date.md) Limits a date to an inclusive range.
- [`compareDates`](./src/compare-dates/compare-dates.md) Compares two instants.
- [`compareDurations`](./src/compare-durations/compare-durations.md) Compares two durations by their length.
- [`compareTimesOfDay`](./src/compare-times-of-day/compare-times-of-day.md) Compares two times of day.
- [`createDate`](./src/create-date/create-date.md) Builds the instant for wall-clock fields in a time zone.
- [`createDateTime`](./src/create-date-time/create-date-time.md) Builds a date-time toolkit with defaults bound in.
- [`createHolidayPredicate`](./src/create-holiday-predicate/create-holiday-predicate.md) Builds a holiday predicate that caches each year the first time it is asked.
- [`createInterval`](./src/create-interval/create-interval.md) Builds a half-open interval.
- [`createMonthCalendarGrid`](./src/create-month-calendar-grid/create-month-calendar-grid.md) Builds the weeks that cover one month, for a calendar UI.
- [`differenceAsDuration`](./src/difference-as-duration/difference-as-duration.md) Breaks the distance from `earlier` to `later` into a duration.
- [`differenceInBusinessDays`](./src/difference-in-business-days/difference-in-business-days.md) Counts business days in `[earlier, later)` by calendar day.
- [`differenceInBusinessHours`](./src/difference-in-business-hours/difference-in-business-hours.md) Returns the working hours between two dates.
- [`differenceInCalendarUnit`](./src/difference-in-calendar-unit/difference-in-calendar-unit.md) Counts calendar boundaries crossed between two dates.
- [`differenceInUnit`](./src/difference-in-unit/difference-in-unit.md) Counts whole units from `earlier` to `later`.
- [`divideInterval`](./src/divide-interval/divide-interval.md) Splits an interval into equal parts.
- [`doIntervalsOverlap`](./src/do-intervals-overlap/do-intervals-overlap.md) Reports whether two half-open intervals overlap.
- [`durationToMilliseconds`](./src/duration-to-milliseconds/duration-to-milliseconds.md) Returns the exact length of a duration in milliseconds.
- [`endOfUnit`](./src/end-of-unit/end-of-unit.md) Returns the last millisecond of the unit that contains a date.
- [`findAvailableSlots`](./src/find-available-slots/find-available-slots.md) Finds free slots of a fixed length inside a window.
- [`findClosestDate`](./src/find-closest-date/find-closest-date.md) Returns the candidate nearest to a target.
- [`findClosestDateIndex`](./src/find-closest-date-index/find-closest-date-index.md) Returns the index of the candidate nearest to a target.
- [`formatDate`](./src/format-date/format-date.md) Formats a date with Unicode CLDR field tokens.
- [`formatDateRange`](./src/format-date-range/format-date-range.md) Formats two dates as a range, collapsing shared parts.
- [`formatDateWithStyle`](./src/format-date-with-style/format-date-with-style.md) Formats a date with `Intl` date and time styles.
- [`formatDuration`](./src/format-duration/format-duration.md) Formats a duration as text such as `1 hour, 30 minutes`.
- [`formatDurationAsClock`](./src/format-duration-as-clock/format-duration-as-clock.md) Formats a duration as `H:mm:ss` for a timer.
- [`formatDurationCompact`](./src/format-duration-compact/format-duration-compact.md) Formats a duration with compact unit symbols such as `1h 30m`.
- [`formatHTTPDate`](./src/format-http-date/format-http-date.md) Formats a date as an HTTP IMF-fixdate in GMT.
- [`formatISODate`](./src/format-iso-date/format-iso-date.md) Formats the calendar date in a time zone as `YYYY-MM-DD`.
- [`formatISODateTime`](./src/format-iso-date-time/format-iso-date-time.md) Formats an instant as an ISO date-time with a numeric offset.
- [`formatISODuration`](./src/format-iso-duration/format-iso-duration.md) Formats a duration as an ISO 8601 duration.
- [`formatRelativeCalendarDay`](./src/format-relative-calendar-day/format-relative-calendar-day.md) Formats a date as a nearby day plus a time, then as a full date.
- [`formatRelativeTime`](./src/format-relative-time/format-relative-time.md) Formats a date as relative time, such as `3 days ago` or `in 2 hours`.
- [`formatRFC2822Date`](./src/format-rfc2822-date/format-rfc2822-date.md) Formats a date as an RFC 2822 date with a numeric offset.
- [`formatTimeOfDay`](./src/format-time-of-day/format-time-of-day.md) Formats a time of day in a locale.
- [`formatTimeZoneName`](./src/format-time-zone-name/format-time-zone-name.md) Returns the localized name of a time zone at an instant.
- [`formatUTCOffset`](./src/format-utc-offset/format-utc-offset.md) Formats a UTC offset in minutes.
- [`fromExcelSerialDate`](./src/from-excel-serial-date/from-excel-serial-date.md) Returns the date named by a spreadsheet serial number.
- [`fromJulianDate`](./src/from-julian-date/from-julian-date.md) Returns a date from an astronomical Julian Date.
- [`fromTemporal`](./src/from-temporal/from-temporal.md) Returns a `Date` from a Temporal instant or zoned date-time.
- [`fromUnixSeconds`](./src/from-unix-seconds/from-unix-seconds.md) Returns a date from whole or fractional Unix seconds.
- [`getAge`](./src/get-age/get-age.md) Returns the number of completed years since a birth date.
- [`getAgeAsDuration`](./src/get-age-as-duration/get-age-as-duration.md) Returns an age as years, months, and days.
- [`getCountdownParts`](./src/get-countdown-parts/get-countdown-parts.md) Splits the time remaining until a target into countdown fields.
- [`getDateParts`](./src/get-date-parts/get-date-parts.md) Returns the wall-clock fields of an instant in a time zone.
- [`getDayOfYear`](./src/get-day-of-year/get-day-of-year.md) Returns the day of the year, from 1 through 366.
- [`getDaysInMonth`](./src/get-days-in-month/get-days-in-month.md) Returns the number of days in a Gregorian month.
- [`getDaysInYear`](./src/get-days-in-year/get-days-in-year.md) Returns the number of days in a Gregorian year.
- [`getEarliestDate`](./src/get-earliest-date/get-earliest-date.md) Returns the earliest date in a list.
- [`getEasterSunday`](./src/get-easter-sunday/get-easter-sunday.md) Returns Easter Sunday as a Gregorian calendar date.
- [`getFiscalQuarter`](./src/get-fiscal-quarter/get-fiscal-quarter.md) Returns the quarter inside the fiscal year, from 1 through 4.
- [`getFiscalYear`](./src/get-fiscal-year/get-fiscal-year.md) Returns the fiscal year label for a date.
- [`getFiscalYearInterval`](./src/get-fiscal-year-interval/get-fiscal-year-interval.md) Returns the half-open interval of a fiscal year.
- [`getHoliday`](./src/get-holiday/get-holiday.md) Returns the holiday that falls on a date, if any.
- [`getHolidaysInYear`](./src/get-holidays-in-year/get-holidays-in-year.md) Expands holiday rules for one Gregorian year.
- [`getIntervalDuration`](./src/get-interval-duration/get-interval-duration.md) Returns the length of an interval as a duration.
- [`getIntervalGaps`](./src/get-interval-gaps/get-interval-gaps.md) Returns the uncovered time between intervals.
- [`getIntervalIntersection`](./src/get-interval-intersection/get-interval-intersection.md) Returns the shared part of two intervals.
- [`getISOWeek`](./src/get-iso-week/get-iso-week.md) Returns the ISO 8601 week number, from 1 through 53.
- [`getISOWeeksInYear`](./src/get-iso-weeks-in-year/get-iso-weeks-in-year.md) Returns the number of ISO weeks in a year.
- [`getISOWeekYear`](./src/get-iso-week-year/get-iso-week-year.md) Returns the year the ISO week belongs to.
- [`getLatestDate`](./src/get-latest-date/get-latest-date.md) Returns the latest date in a list.
- [`getLocaleDatePattern`](./src/get-locale-date-pattern/get-locale-date-pattern.md) Returns the locale's numeric date pattern, such as `dd/MM/yyyy`.
- [`getLocaleHourCycle`](./src/get-locale-hour-cycle/get-locale-hour-cycle.md) Reports whether a locale uses a 12-hour or 24-hour clock.
- [`getLocaleWeekInfo`](./src/get-locale-week-info/get-locale-week-info.md) Returns the week rules `Intl` reports for a locale.
- [`getLocalTimeZone`](./src/get-local-time-zone/get-local-time-zone.md) Returns the system's IANA time zone.
- [`getMillisecondsUntilNextUnit`](./src/get-milliseconds-until-next-unit/get-milliseconds-until-next-unit.md) Returns the delay until the next unit boundary.
- [`getMonthNames`](./src/get-month-names/get-month-names.md) Returns the 12 month names, January first.
- [`getNextAnniversary`](./src/get-next-anniversary/get-next-anniversary.md) Returns the start of the next anniversary of a date.
- [`getNextBusinessDay`](./src/get-next-business-day/get-next-business-day.md) Returns the start of the next business day.
- [`getNextBusinessHoursStart`](./src/get-next-business-hours-start/get-next-business-hours-start.md) Returns the date itself when it is inside working hours, otherwise the next opening.
- [`getNextClosingTime`](./src/get-next-closing-time/get-next-closing-time.md) Returns the next time a weekly schedule closes.
- [`getNextOpeningTime`](./src/get-next-opening-time/get-next-opening-time.md) Returns the next time a weekly schedule opens.
- [`getNextTimeZoneTransition`](./src/get-next-time-zone-transition/get-next-time-zone-transition.md) Returns the next offset change, searching up to two years ahead.
- [`getNextWeekday`](./src/get-next-weekday/get-next-weekday.md) Returns the start of the next day that falls on `weekday`.
- [`getNthWeekdayOfMonth`](./src/get-nth-weekday-of-month/get-nth-weekday-of-month.md) Returns the start of the nth weekday in a month.
- [`getObservedDate`](./src/get-observed-date/get-observed-date.md) Returns the substitute day when a holiday falls on a weekend.
- [`getPreviousBusinessDay`](./src/get-previous-business-day/get-previous-business-day.md) Returns the start of the previous business day.
- [`getPreviousTimeZoneTransition`](./src/get-previous-time-zone-transition/get-previous-time-zone-transition.md) Returns the previous offset change, searching up to two years back.
- [`getPreviousWeekday`](./src/get-previous-weekday/get-previous-weekday.md) Returns the start of the previous day that falls on `weekday`.
- [`getQuarter`](./src/get-quarter/get-quarter.md) Returns the calendar quarter, from 1 through 4.
- [`getRelativeTimeParts`](./src/get-relative-time-parts/get-relative-time-parts.md) Returns the signed relative-time value and the unit that was chosen.
- [`getSeason`](./src/get-season/get-season.md) Returns the season for a date.
- [`getTimeOfDay`](./src/get-time-of-day/get-time-of-day.md) Returns the wall-clock time of a date in a zone.
- [`getTimeZoneDifference`](./src/get-time-zone-difference/get-time-zone-difference.md) Returns how many minutes the first zone is ahead of the second.
- [`getTimeZoneTransitions`](./src/get-time-zone-transitions/get-time-zone-transitions.md) Returns every offset change inside an interval.
- [`getUTCOffset`](./src/get-utc-offset/get-utc-offset.md) Returns the offset from UTC, in minutes, for an instant in a zone.
- [`getWallTimeStatus`](./src/get-wall-time-status/get-wall-time-status.md) Reports whether a wall time exists once, never, or twice.
- [`getWeekdayNames`](./src/get-weekday-names/get-weekday-names.md) Returns the 7 weekday names, starting on `startsOn`.
- [`getWeekOfMonth`](./src/get-week-of-month/get-week-of-month.md) Returns the week of the month, from 1 through 6.
- [`getWeekOfYear`](./src/get-week-of-year/get-week-of-year.md) Returns a locale-style week number.
- [`isAfter`](./src/is-after/is-after.md) Reports whether `date` is strictly later than `reference`.
- [`isBefore`](./src/is-before/is-before.md) Reports whether `date` is strictly earlier than `reference`.
- [`isBetween`](./src/is-between/is-between.md) Reports whether `date` lies between `start` and `end`.
- [`isBusinessDay`](./src/is-business-day/is-business-day.md) Reports whether a date falls on a business day.
- [`isDate`](./src/is-date/is-date.md) Reports whether `value` is a `Date` object.
- [`isDaylightSavingTime`](./src/is-daylight-saving-time/is-daylight-saving-time.md) Reports whether an instant is in daylight saving time.
- [`isFuture`](./src/is-future/is-future.md) Reports whether a date is strictly after now.
- [`isHoliday`](./src/is-holiday/is-holiday.md) Reports whether a date is one of the given holidays.
- [`isLeapYear`](./src/is-leap-year/is-leap-year.md) Reports whether a year has a February 29.
- [`isOpenAt`](./src/is-open-at/is-open-at.md) Reports whether a weekly schedule is open at a date.
- [`isPast`](./src/is-past/is-past.md) Reports whether a date is strictly before now.
- [`isSameInstant`](./src/is-same-instant/is-same-instant.md) Reports whether two values are the same millisecond.
- [`isSameUnit`](./src/is-same-unit/is-same-unit.md) Reports whether two dates fall in the same unit in a time zone.
- [`isTimeOfDayInRange`](./src/is-time-of-day-in-range/is-time-of-day-in-range.md) Reports whether a time falls in a daily range.
- [`isToday`](./src/is-today/is-today.md) Reports whether a date falls on today's calendar day in a time zone.
- [`isTomorrow`](./src/is-tomorrow/is-tomorrow.md) Reports whether a date falls on the calendar day after today.
- [`isValidDate`](./src/is-valid-date/is-valid-date.md) Reports whether `value` is a real date.
- [`isValidDuration`](./src/is-valid-duration/is-valid-duration.md) Reports whether a value is a duration.
- [`isValidInterval`](./src/is-valid-interval/is-valid-interval.md) Reports whether a value is a half-open interval.
- [`isValidTimeZone`](./src/is-valid-time-zone/is-valid-time-zone.md) Reports whether `timeZone` is a zone this runtime can use.
- [`isWeekend`](./src/is-weekend/is-weekend.md) Reports whether a date falls on a weekend day.
- [`isWithinBusinessHours`](./src/is-within-business-hours/is-within-business-hours.md) Reports whether a date is inside working hours on a business day.
- [`isWithinInterval`](./src/is-within-interval/is-within-interval.md) Reports whether a date is inside a half-open interval.
- [`isWithinLast`](./src/is-within-last/is-within-last.md) Reports whether a date is between now minus a duration and now.
- [`isWithinNext`](./src/is-within-next/is-within-next.md) Reports whether a date is between now and now plus a duration.
- [`isYesterday`](./src/is-yesterday/is-yesterday.md) Reports whether a date falls on the calendar day before today.
- [`listBusinessDaysInInterval`](./src/list-business-days-in-interval/list-business-days-in-interval.md) Lists the start of each business day that overlaps an interval.
- [`listDatesInInterval`](./src/list-dates-in-interval/list-dates-in-interval.md) Lists the dates inside an interval.
- [`listTimeZones`](./src/list-time-zones/list-time-zones.md) Returns the IANA time zones this runtime knows.
- [`matchesDatePattern`](./src/matches-date-pattern/matches-date-pattern.md) Reports whether text fits a date pattern and is a real date.
- [`mergeIntervals`](./src/merge-intervals/merge-intervals.md) Returns the sorted union of intervals, with overlaps joined.
- [`millisecondsToDuration`](./src/milliseconds-to-duration/milliseconds-to-duration.md) Splits a millisecond length into duration fields.
- [`negateDuration`](./src/negate-duration/negate-duration.md) Returns a duration with every field's sign flipped.
- [`normalizeDuration`](./src/normalize-duration/normalize-duration.md) Balances a duration so smaller units do not overflow.
- [`parseDateWithPattern`](./src/parse-date-with-pattern/parse-date-with-pattern.md) Parses text written with the same tokens as `formatDate`.
- [`parseDurationText`](./src/parse-duration-text/parse-duration-text.md) Parses English duration text.
- [`parseHTTPDate`](./src/parse-http-date/parse-http-date.md) Parses an HTTP date in IMF-fixdate, RFC 850, or asctime form.
- [`parseISODate`](./src/parse-iso-date/parse-iso-date.md) Parses `YYYY-MM-DD` as midnight in a time zone.
- [`parseISODateTime`](./src/parse-iso-date-time/parse-iso-date-time.md) Parses an ISO 8601, RFC 3339, or RFC 9557 date-time.
- [`parseISODuration`](./src/parse-iso-duration/parse-iso-duration.md) Parses an ISO 8601 duration such as `P1Y2M3DT4H5M6.5S`.
- [`parseLocaleDate`](./src/parse-locale-date/parse-locale-date.md) Parses a numeric date written the way the locale writes it.
- [`parseRFC2822Date`](./src/parse-rfc2822-date/parse-rfc2822-date.md) Parses an email date header.
- [`parseTimeOfDay`](./src/parse-time-of-day/parse-time-of-day.md) Parses a time of day.
- [`parseUTCOffset`](./src/parse-utc-offset/parse-utc-offset.md) Parses a UTC offset into minutes.
- [`removeDuplicateDates`](./src/remove-duplicate-dates/remove-duplicate-dates.md) Returns the first date of each unit, in input order.
- [`reviveISODateTimes`](./src/revive-iso-date-times/revive-iso-date-times.md) A `JSON.parse` reviver that turns strict ISO date-times into dates.
- [`roundDuration`](./src/round-duration/round-duration.md) Rounds a duration to a unit.
- [`roundToUnit`](./src/round-to-unit/round-to-unit.md) Rounds a date to a unit increment.
- [`setDateParts`](./src/set-date-parts/set-date-parts.md) Returns a date with some wall-clock fields replaced.
- [`sortDates`](./src/sort-dates/sort-dates.md) Returns a new array of dates in time order.
- [`splitInterval`](./src/split-interval/split-interval.md) Splits an interval into consecutive pieces of `step`.
- [`startOfUnit`](./src/start-of-unit/start-of-unit.md) Returns the first millisecond of the unit that contains a date.
- [`subtractDuration`](./src/subtract-duration/subtract-duration.md) Subtracts a duration from a date.
- [`subtractIntervals`](./src/subtract-intervals/subtract-intervals.md) Returns the parts of the source interval that `removed` does not cover.
- [`toDate`](./src/to-date/to-date.md) Returns a new `Date` for `date`.
- [`toExcelSerialDate`](./src/to-excel-serial-date/to-excel-serial-date.md) Returns the spreadsheet serial number of a date.
- [`toJulianDate`](./src/to-julian-date/to-julian-date.md) Returns the astronomical Julian Date of an instant.
- [`toTemporalInstant`](./src/to-temporal-instant/to-temporal-instant.md) Returns a Temporal instant for a date.
- [`toUnixSeconds`](./src/to-unix-seconds/to-unix-seconds.md) Returns whole seconds since the Unix epoch, rounded toward minus infinity.

### `@sgx4u/date-time/recurrence`

- [`createRecurrence`](./src/create-recurrence.md) Builds recurrence functions with the same config as `createDateTime`.
- [`describeRecurrenceRule`](./src/describe-recurrence-rule/describe-recurrence-rule.md) Describes a recurrence rule in English.
- [`formatRecurrenceRule`](./src/format-recurrence-rule/format-recurrence-rule.md) Writes a recurrence rule as RFC 5545 text.
- [`getNextRecurrenceOccurrence`](./src/get-next-recurrence-occurrence/get-next-recurrence-occurrence.md) Returns the next occurrence of a rule.
- [`getPreviousRecurrenceOccurrence`](./src/get-previous-recurrence-occurrence/get-previous-recurrence-occurrence.md) Returns the previous occurrence of a rule.
- [`isValidRecurrenceRule`](./src/is-valid-recurrence-rule/is-valid-recurrence-rule.md) Reports whether text is a supported recurrence rule.
- [`listRecurrenceOccurrences`](./src/list-recurrence-occurrences/list-recurrence-occurrences.md) Lists occurrences inside an interval.
- [`parseRecurrenceRule`](./src/parse-recurrence-rule/parse-recurrence-rule.md) Parses an RFC 5545 recurrence.

### `@sgx4u/date-time/cron`

- [`createCron`](./src/create-cron.md) Builds cron functions with the same config as `createDateTime`.
- [`describeCronExpression`](./src/describe-cron-expression/describe-cron-expression.md) Describes a cron expression in English.
- [`doesCronMatch`](./src/does-cron-match/does-cron-match.md) Reports whether a schedule fires at a date.
- [`getNextCronRuns`](./src/get-next-cron-runs/get-next-cron-runs.md) Returns the next times a cron schedule fires.
- [`getPreviousCronRuns`](./src/get-previous-cron-runs/get-previous-cron-runs.md) Returns earlier times a cron schedule fired, newest first.
- [`isValidCronExpression`](./src/is-valid-cron-expression/is-valid-cron-expression.md) Reports whether text is a cron expression.
- [`parseCronExpression`](./src/parse-cron-expression/parse-cron-expression.md) Parses a cron expression.

### `@sgx4u/date-time/natural-language`

- [`createNaturalLanguage`](./src/create-natural-language.md) Builds English date functions with the same config as `createDateTime`.
- [`findDatesInText`](./src/find-dates-in-text/find-dates-in-text.md) Finds English date phrases in a longer text.
- [`parseNaturalDate`](./src/parse-natural-date/parse-natural-date.md) Parses an English date phrase.
- [`parseNaturalDateRange`](./src/parse-natural-date-range/parse-natural-date-range.md) Parses an English date range.

### `@sgx4u/date-time/astronomy`

- [`createAstronomy`](./src/create-astronomy.md) Builds astronomy functions with the same config as `createDateTime`.
- [`getMoonPhase`](./src/get-moon-phase/get-moon-phase.md) Returns the moon phase at an instant.
- [`getSunTimes`](./src/get-sun-times/get-sun-times.md) Returns sunrise, sunset, solar noon, and civil twilight for one day.

### `@sgx4u/date-time/holidays/india`

- [`indiaHolidayRules`](./src/holidays/india-holiday-rules/india-holiday-rules.md) National holidays of India.
- [`indiaHolidays`](./src/holidays/india-holidays/india-holidays.md) National holidays of India for one year, as `{ date, name }`.

### `@sgx4u/date-time/holidays/united-states`

- [`unitedStatesHolidayRules`](./src/holidays/united-states-holiday-rules/united-states-holiday-rules.md) United States federal holidays, with the observed weekday.
- [`unitedStatesHolidays`](./src/holidays/united-states-holidays/united-states-holidays.md) United States federal holidays for one year, as `{ date, name }`.

### `@sgx4u/date-time/holidays/united-kingdom`

- [`unitedKingdomHolidayRules`](./src/holidays/united-kingdom-holiday-rules/united-kingdom-holiday-rules.md) Bank holidays for England and Wales.
- [`unitedKingdomHolidays`](./src/holidays/united-kingdom-holidays/united-kingdom-holidays.md) England and Wales bank holidays for one year, as `{ date, name }`.

<h2 id="subpaths">📦 Subpaths</h2>

| Import                                     | What it contains                                                                                                                      |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| `@sgx4u/date-time`                         | Dates, durations, intervals, business time, holiday rules, time zones, opening hours, seasons, Temporal interop, and `createDateTime` |
| `@sgx4u/date-time/recurrence`              | RFC 5545 recurrence and `createRecurrence`                                                                                            |
| `@sgx4u/date-time/cron`                    | Cron expressions and `createCron`                                                                                                     |
| `@sgx4u/date-time/natural-language`        | English date phrases and `createNaturalLanguage`                                                                                      |
| `@sgx4u/date-time/holidays/india`          | `indiaHolidayRules` and `indiaHolidays(year)`                                                                                         |
| `@sgx4u/date-time/holidays/united-states`  | `unitedStatesHolidayRules` and `unitedStatesHolidays(year)`                                                                           |
| `@sgx4u/date-time/holidays/united-kingdom` | `unitedKingdomHolidayRules` and `unitedKingdomHolidays(year)`                                                                         |
| `@sgx4u/date-time/astronomy`               | Sunrise, sunset, moon phase, and `createAstronomy`                                                                                    |

<h2 id="inputs">📥 Inputs</h2>

A `DateInput` is a `Date`, a finite Unix millisecond timestamp inside ±8.64e15, or a strict `YYYY-MM-DD` or ISO date-time string. A date-only string is midnight in the function's `timeZone`. A date-time string must carry `Z` or an explicit offset, including `+0530`. Months are 1 through 12. Weekdays are ISO numbers, Monday 1 through Sunday 7. Functions do not mutate their inputs, and a function that returns a `Date` returns a new one.

<h2 id="time-zones">🌍 Time zones</h2>

A `timeZone` option accepts an IANA name, `UTC`, or a fixed offset `±HH:mm`, `±HHmm`, or `±HH`. Omitted, it is the system zone, read on each call. `disambiguation` chooses what happens at a daylight-saving gap or overlap: `compatible` (the default), `earlier`, `later`, or `reject`.

<h2 id="errors">⚠️ Errors</h2>

Invalid dates, durations, and unparseable text return `undefined`. `is*`, `does*`, and `matches*` return `false` for invalid input. These functions still throw. The reason is a programming mistake, or `undefined` already means that the search found nothing.

- `addBusinessDays` — RangeError When the calendar has no business day within the safety cap, or `workingDays`, `businessHours`, or `timeZone` is invalid.
- `addBusinessHours` — RangeError When the duration contains a calendar unit, the calendar has no business day within the safety cap, or `workingDays`, `businessHours`, or `timeZone` is invalid.
- `addDuration` — RangeError When `timeZone` is not a usable zone, `disambiguation` or `overflow` is not a known mode, the day does not exist and `overflow` is `"reject"`, or `"reject"` hits a gap or overlap.
- `addDurations` — RangeError When the sum mixes signs.
- `addToTimeOfDay` — RangeError When the duration contains months or years.
- `changeTimeZoneKeepingWallTime` — RangeError When a zone is unknown, `disambiguation` is not a known mode, or `"reject"` hits a gap or overlap.
- `clampDate` — RangeError When `start` is after `end`.
- `compareDurations` — RangeError When a calendar unit has no `relativeTo`, or `timeZone` is unusable.
- `createAstronomy` — TypeError When a config field has the wrong type. RangeError When a zone, locale, weekday, or other setting is unusable.
- `createCron` — TypeError When a config field has the wrong type. RangeError When a zone, locale, weekday, or other setting is unusable.
- `createDate` — RangeError When `timeZone` is unusable, `disambiguation` is not a known mode, or `"reject"` hits a gap or overlap.
- `createDateTime` — TypeError When a config field has the wrong type. RangeError When a zone, locale, weekday, or other setting is unusable.
- `createHolidayPredicate` — TypeError When `rules` is not an array. RangeError When `timeZone` is unusable.
- `createMonthCalendarGrid` — RangeError When `weekStartsOn` is invalid or `timeZone` is unusable.
- `createNaturalLanguage` — TypeError When a config field has the wrong type. RangeError When a zone, locale, weekday, or other setting is unusable.
- `createRecurrence` — TypeError When a config field has the wrong type. RangeError When a zone, locale, weekday, or other setting is unusable.
- `describeCronExpression` — RangeError When `hourCycle` is unknown.
- `differenceAsDuration` — TypeError When a unit is not a string. RangeError When a unit is unknown, or `smallestUnit` is larger than `largestUnit`.
- `differenceInBusinessDays` — RangeError When 3660 consecutive days have no business day, or business calendar fields are invalid.
- `differenceInBusinessHours` — RangeError When 3660 consecutive days have no business day, or business calendar fields are invalid.
- `differenceInCalendarUnit` — TypeError When `unit` is not a string. RangeError When `unit` is not a calendar unit, `weekStartsOn` is invalid, or `timeZone` is unusable.
- `differenceInUnit` — TypeError When `unit` is not a string. RangeError When `unit`, `rounding`, or `timeZone` is invalid.
- `divideInterval` — RangeError When `partCount` is not a positive integer.
- `doesCronMatch` — RangeError When `timeZone` is not a usable zone.
- `durationToMilliseconds` — RangeError When months or years are present without `relativeTo`, or `timeZone` is unusable.
- `endOfUnit` — TypeError When `unit` is not a string. RangeError When `unit`, `weekStartsOn`, or `timeZone` is invalid.
- `findAvailableSlots` — RangeError When the step does not move forward or the result would exceed 100000 slots, or `timeZone` is unusable.
- `findClosestDate` — TypeError When `candidates` is not an array. RangeError When `target` or a candidate is not a real date.
- `findDatesInText` — TypeError When `text` is not a string. RangeError When `timeZone` is not a usable zone.
- `formatDate` — TypeError When `pattern` is not a string. RangeError When the zone or a token is invalid.
- `formatDateRange` — RangeError When `start` is after `end`, or the zone is unusable.
- `formatDateWithStyle` — RangeError When the zone is unusable.
- `formatDuration` — RangeError When `style` is invalid.
- `formatDurationCompact` — RangeError When `maximumUnitCount` is not a positive integer.
- `formatISODate` — RangeError When `timeZone` is not a usable zone. TypeError When `timeZone` is not a string.
- `formatISODateTime` — RangeError When the zone or `precision` is invalid.
- `formatRelativeCalendarDay` — RangeError When `timeStyle` or `timeZone` is invalid.
- `formatRelativeTime` — RangeError When `unit`, `style`, or `numeric` is invalid.
- `formatRFC2822Date` — RangeError When the zone is unusable.
- `formatTimeOfDay` — RangeError When the precision or hour cycle is unknown.
- `formatTimeZoneName` — RangeError When the zone or style is invalid.
- `formatUTCOffset` — RangeError When `style` is not one of the three styles.
- `fromExcelSerialDate` — RangeError When `dateSystem` is not `1900` or `1904`, or `timeZone` is not usable.
- `getAge` — RangeError When `leapDayBirthdayInCommonYears` is unknown, or `timeZone` is not usable.
- `getAgeAsDuration` — RangeError When `leapDayBirthdayInCommonYears` is unknown, or `timeZone` is not usable.
- `getCountdownParts` — RangeError When `largestUnit` is unknown.
- `getDateParts` — RangeError When `timeZone` is not usable.
- `getDayOfYear` — RangeError When `timeZone` is not usable.
- `getEarliestDate` — TypeError When `dates` is not an array, or an entry has the wrong type. RangeError When an entry is not a real date.
- `getEasterSunday` — RangeError When `tradition` is unknown.
- `getFiscalQuarter` — TypeError When `fiscalYearStartMonth` is missing. RangeError When the start month or `timeZone` is not usable.
- `getFiscalYear` — TypeError When `fiscalYearStartMonth` is missing. RangeError When the start month or `timeZone` is not usable.
- `getFiscalYearInterval` — TypeError When `fiscalYearStartMonth` is missing. RangeError When the start month or `timeZone` is not usable.
- `getHoliday` — TypeError When `rules` is not an array. RangeError When `date` is not a real date, or `timeZone` is not usable.
- `getHolidaysInYear` — TypeError When `rules` is not an array.
- `getIntervalDuration` — RangeError When `largestUnit` is unknown or `timeZone` is not usable.
- `getIntervalGaps` — TypeError When `intervals` is not an array.
- `getIntervalIntersection` — TypeError When an interval has the wrong shape. RangeError When an interval is invalid.
- `getISOWeek` — RangeError When `timeZone` is not usable.
- `getISOWeekYear` — RangeError When `timeZone` is not usable.
- `getLatestDate` — TypeError When `dates` is not an array, or an entry has the wrong type. RangeError When an entry is not a real date.
- `getLocaleDatePattern` — RangeError When `style` is not `"short"` or `"medium"`, or `locale` is not a BCP 47 tag. TypeError When `locale` is not a string.
- `getLocaleHourCycle` — RangeError When `locale` is not a BCP 47 language tag. TypeError When `locale` is not a string.
- `getLocaleWeekInfo` — RangeError When `locale` is not a BCP 47 language tag. TypeError When `locale` is not a string.
- `getMillisecondsUntilNextUnit` — RangeError When `unit` is not a time unit or `timeZone` is not usable.
- `getMonthNames` — RangeError When `width` is not a known length.
- `getNextAnniversary` — RangeError When `timeZone` or leap-day policy options are invalid.
- `getNextBusinessDay` — RangeError When 3660 consecutive days have no business day.
- `getNextBusinessHoursStart` — RangeError When 3660 consecutive days have no business day.
- `getNextClosingTime` — RangeError When `date` is not a real date.
- `getNextCronRuns` — RangeError When `count` is not an integer from 1 through 1000.
- `getNextOpeningTime` — RangeError When `date` is not a real date.
- `getNextRecurrenceOccurrence` — RangeError When `now` is not a real date.
- `getNextTimeZoneTransition` — RangeError When the zone is unknown or `date` is not a real date.
- `getNextWeekday` — RangeError When `weekday` is outside 1 through 7 or `timeZone` is invalid.
- `getNthWeekdayOfMonth` — TypeError When a number argument is not a number. RangeError When `month`, `weekday`, or `occurrence` is out of range.
- `getObservedDate` — RangeError When `policy` is unknown. TypeError When `date` is not a calendar date or `workingDays` is not an array.
- `getPreviousBusinessDay` — RangeError When 3660 consecutive days have no business day.
- `getPreviousCronRuns` — RangeError When `count` is not an integer from 1 through 1000.
- `getPreviousRecurrenceOccurrence` — RangeError When `now` is not a real date.
- `getPreviousTimeZoneTransition` — RangeError When the zone is unknown or `date` is not a real date.
- `getPreviousWeekday` — RangeError When `weekday` is outside 1 through 7 or `timeZone` is invalid.
- `getQuarter` — RangeError When `timeZone` is not usable.
- `getRelativeTimeParts` — RangeError When `unit` is invalid.
- `getSeason` — RangeError When `hemisphere`, `method`, or `timeZone` is invalid.
- `getSunTimes` — TypeError When the location is not an object of numbers. RangeError When a coordinate is outside its range or `timeZone` is invalid.
- `getTimeOfDay` — RangeError When `timeZone` is not usable.
- `getTimeZoneDifference` — RangeError When a zone is unknown.
- `getTimeZoneTransitions` — RangeError When the interval is longer than 50 years, the interval is invalid, or the zone is unknown.
- `getUTCOffset` — RangeError When `timeZone` is not usable.
- `getWallTimeStatus` — RangeError When the zone is unknown or the calendar day does not exist.
- `getWeekdayNames` — RangeError When `width` or `startsOn` is invalid.
- `getWeekOfMonth` — RangeError When `timeZone` or `weekStartsOn` is invalid.
- `getWeekOfYear` — RangeError When `minimumDaysInFirstWeek` is outside 1 through 7.
- `isBusinessDay` — TypeError When `workingDays` or `businessHours` has the wrong type. RangeError When `timeZone` is not usable.
- `isDaylightSavingTime` — RangeError When `timeZone` is unknown.
- `isHoliday` — TypeError When `holidays` is not an array. RangeError When `timeZone` is not a usable zone.
- `isOpenAt` — RangeError When `timeZone` is not usable.
- `isSameUnit` — RangeError When the unit, zone, or `weekStartsOn` is invalid.
- `isTimeOfDayInRange` — TypeError When a bound cannot be read.
- `isToday` — RangeError When `timeZone` is not usable.
- `isTomorrow` — RangeError When `timeZone` is not usable.
- `isValidCronExpression` — TypeError When `expression` is not a string. RangeError When `seconds` is not a known mode.
- `isValidRecurrenceRule` — TypeError When `value` is not a string.
- `isWeekend` — TypeError When `workingDays` is not an array. RangeError When a working day is outside 1 through 7 or `timeZone` is not usable.
- `isWithinBusinessHours` — TypeError When `workingDays` or `businessHours` has the wrong type. RangeError When `timeZone` is not usable.
- `isWithinLast` — RangeError When `duration` is negative.
- `isWithinNext` — RangeError When `duration` is negative.
- `isYesterday` — RangeError When `timeZone` is not usable.
- `listBusinessDaysInInterval` — RangeError When the result would exceed 100000 days.
- `listDatesInInterval` — RangeError When the result would exceed 100000 dates, `alignToUnit` is unknown, or `weekStartsOn` or `timeZone` is invalid.
- `listRecurrenceOccurrences` — RangeError When more than `limit` occurrences fall in the interval.
- `matchesDatePattern` — TypeError When `value` or `pattern` is not a string. RangeError When the pattern contains an unknown token.
- `mergeIntervals` — RangeError When an interval is invalid.
- `millisecondsToDuration` — RangeError When a unit is unknown or `smallestUnit` is larger than `largestUnit`.
- `normalizeDuration` — RangeError When `largestUnit` is unknown or `timeZone` is invalid.
- `parseCronExpression` — TypeError When `expression` is not a string. RangeError When `seconds` is not a known mode.
- `parseDateWithPattern` — TypeError When `value` or `pattern` is not a string. RangeError When the pattern contains an unknown token, `timeZone` is invalid, or `locale` is invalid.
- `parseDurationText` — TypeError When `value` is not a string.
- `parseHTTPDate` — TypeError When `value` is not a string.
- `parseISODate` — TypeError When `value` is not a string. RangeError When `timeZone` is not usable.
- `parseISODateTime` — TypeError When `value` is not a string. RangeError When `disambiguation` is not one of the four modes.
- `parseISODuration` — TypeError When `value` is not a string.
- `parseLocaleDate` — TypeError When `value` is not a string. RangeError When `locale` or `timeZone` is invalid.
- `parseNaturalDate` — TypeError When `text` is not a string. RangeError When `timeZone` is invalid.
- `parseNaturalDateRange` — TypeError When `text` is not a string. RangeError When `timeZone` is invalid.
- `parseRecurrenceRule` — TypeError When `value` is not a string.
- `parseRFC2822Date` — TypeError When `value` is not a string.
- `parseTimeOfDay` — TypeError When `value` is not a string.
- `parseUTCOffset` — TypeError When `value` is not a string.
- `removeDuplicateDates` — RangeError When `unit` or `timeZone` is invalid.
- `roundDuration` — RangeError When a calendar unit has no `relativeTo`, `mode` is unknown, or `smallestUnit` is unknown.
- `roundToUnit` — RangeError When `increment` does not divide the next clock unit, `unit` is unknown, `mode` is unknown, or `timeZone` is invalid.
- `setDateParts` — TypeError When `parts` is not an object. RangeError When `overflow` or `disambiguation` is unknown, or `"reject"` hits a missing time.
- `sortDates` — RangeError When `order` is not a known direction.
- `splitInterval` — RangeError When `step` is zero or negative, or the result would exceed 100000 pieces.
- `startOfUnit` — RangeError When `unit`, `weekStartsOn`, or `timeZone` is invalid.
- `subtractDuration` — RangeError When `timeZone` is not a usable zone, `disambiguation` or `overflow` is not a known mode, the day does not exist and `overflow` is `"reject"`, or `"reject"` hits a gap or overlap.
- `subtractIntervals` — TypeError When `removed` is not an array. RangeError When an interval is invalid.
- `toDate` — RangeError When `timeZone` is not a usable zone.
- `toExcelSerialDate` — RangeError When the date is before the epoch, `dateSystem` is not 1900 or 1904, or `timeZone` is invalid.
- `toTemporalInstant` — TypeError When `Temporal` is not on the global object.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br />

<h2 id="runtime-support">🌐 Runtime support</h2>

Runtime: `universal`. The same source runs in browsers, workers, and Node. It uses `Date` and has no runtime dependencies.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br />

<h2 id="contributing">🤝 Contributing</h2>

Repository rules are in [CONTRIBUTING.md](../../CONTRIBUTING.md).

Owner: `@sgx4u`

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br />

<h2 id="license">📄 License</h2>

[MIT](../../LICENSE) © 2026 Subhajit Ghosh

<p align="right">(<a href="#readme-top">back to top</a>)</p>
