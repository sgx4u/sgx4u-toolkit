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

<h2 id="functions">📘 Functions</h2>

The [function reference](./FUNCTIONS.md) lists every export with its subpath, parameters, return type, and a one-line description. Each name below links to that function's guide.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br />

### `@sgx4u/date-time`

- [`addBusinessDays`](./src/add-business-days/add-business-days.md) Moves a date by a number of business days, keeping the time of day.
- [`addBusinessHours`](./src/add-business-hours/add-business-hours.md) Adds working time, skipping nights, weekends, and holidays.
- [`addDurations`](./src/add-durations/add-durations.md) Adds two durations field by field.
- [`addToTimeOfDay`](./src/add-to-time-of-day/add-to-time-of-day.md) Adds a duration to a time of day, wrapping past midnight.
- [`addDuration`](./src/add-duration/add-duration.md) Adds a duration to a date.
- [`clampDate`](./src/clamp-date/clamp-date.md) Limits a date to an inclusive range.
- [`differenceInBusinessDays`](./src/difference-in-business-days/difference-in-business-days.md) Counts business days in `[earlier, later)` by calendar day.
- [`differenceInBusinessHours`](./src/difference-in-business-hours/difference-in-business-hours.md) Returns the working hours between two dates.
- [`changeTimeZoneKeepingWallTime`](./src/change-time-zone-keeping-wall-time/change-time-zone-keeping-wall-time.md) Keeps the clock reading and moves it into another time zone.
- [`compareDates`](./src/compare-dates/compare-dates.md) Compares two dates for `Array#sort`.
- [`compareDurations`](./src/compare-durations/compare-durations.md) Compares two durations by their length.
- [`compareTimesOfDay`](./src/compare-times-of-day/compare-times-of-day.md) Compares two times of day.
- [`createDate`](./src/create-date/create-date.md) Builds the instant for wall-clock fields in a time zone.
- [`createHolidayPredicate`](./src/create-holiday-predicate/create-holiday-predicate.md) Builds a holiday predicate that caches each year the first time it is asked.
- [`createInterval`](./src/create-interval/create-interval.md) Builds a half-open interval.
- [`divideInterval`](./src/divide-interval/divide-interval.md) Splits an interval into equal parts.
- [`getIntervalDuration`](./src/get-interval-duration/get-interval-duration.md) Returns the length of an interval as a duration.
- [`getIntervalGaps`](./src/get-interval-gaps/get-interval-gaps.md) Returns the uncovered time between intervals.
- [`doIntervalsOverlap`](./src/do-intervals-overlap/do-intervals-overlap.md) Reports whether two half-open intervals overlap.
- [`getIntervalIntersection`](./src/get-interval-intersection/get-interval-intersection.md) Returns the shared part of two intervals.
- [`isValidInterval`](./src/is-valid-interval/is-valid-interval.md) Reports whether a value is a half-open interval.
- [`isTimeOfDayInRange`](./src/is-time-of-day-in-range/is-time-of-day-in-range.md) Reports whether a time falls in a daily range.
- [`isWithinInterval`](./src/is-within-interval/is-within-interval.md) Reports whether a date is inside a half-open interval.
- [`listDatesInInterval`](./src/list-dates-in-interval/list-dates-in-interval.md) Lists the dates inside an interval.
- [`matchesDatePattern`](./src/matches-date-pattern/matches-date-pattern.md) Reports whether text fits a date pattern and is a real date.
- [`mergeIntervals`](./src/merge-intervals/merge-intervals.md) Returns the sorted union of intervals, with overlaps joined.
- [`splitInterval`](./src/split-interval/split-interval.md) Splits an interval into consecutive pieces of `step`.
- [`subtractIntervals`](./src/subtract-intervals/subtract-intervals.md) Returns the parts of `source` that `removed` does not cover.
- [`endOfUnit`](./src/end-of-unit/end-of-unit.md) Returns the last millisecond of the unit that contains a date.
- [`findAvailableSlots`](./src/find-available-slots/find-available-slots.md) Finds free slots of a fixed length inside a window.
- [`findClosestDate`](./src/find-closest-date/find-closest-date.md) Returns the candidate nearest to a target.
- [`findClosestDateIndex`](./src/find-closest-date-index/find-closest-date-index.md) Returns the index of the candidate nearest to a target.
- [`getDateParts`](./src/get-date-parts/get-date-parts.md) Returns the wall-clock fields of an instant in a time zone.
- [`getEasterSunday`](./src/get-easter-sunday/get-easter-sunday.md) Returns Easter Sunday as a Gregorian calendar date.
- [`getHoliday`](./src/get-holiday/get-holiday.md) Returns the holiday that falls on a date, if any.
- [`getHolidaysInYear`](./src/get-holidays-in-year/get-holidays-in-year.md) Expands holiday rules for one Gregorian year.
- [`getObservedDate`](./src/get-observed-date/get-observed-date.md) Returns the substitute day when a holiday falls on a weekend.
- [`getDaysInMonth`](./src/get-days-in-month/get-days-in-month.md) Returns the number of days in a Gregorian month.
- [`getDaysInYear`](./src/get-days-in-year/get-days-in-year.md) Returns the number of days in a Gregorian year.
- [`getEarliestDate`](./src/get-earliest-date/get-earliest-date.md) Returns the earliest date in a list.
- [`getLatestDate`](./src/get-latest-date/get-latest-date.md) Returns the latest date in a list.
- [`getLocalTimeZone`](./src/get-local-time-zone/get-local-time-zone.md) Returns the system's IANA time zone.
- [`getNextBusinessDay`](./src/get-next-business-day/get-next-business-day.md) Returns the start of the next business day.
- [`getNextBusinessHoursStart`](./src/get-next-business-hours-start/get-next-business-hours-start.md) Returns the date itself when it is inside working hours, otherwise the next opening.
- [`getPreviousBusinessDay`](./src/get-previous-business-day/get-previous-business-day.md) Returns the start of the previous business day.
- [`getNextClosingTime`](./src/get-next-closing-time/get-next-closing-time.md) Returns the next time a weekly schedule closes.
- [`getNextOpeningTime`](./src/get-next-opening-time/get-next-opening-time.md) Returns the next time a weekly schedule opens.
- [`getNextTimeZoneTransition`](./src/get-next-time-zone-transition/get-next-time-zone-transition.md) Returns the next offset change, searching up to two years ahead.
- [`getPreviousTimeZoneTransition`](./src/get-previous-time-zone-transition/get-previous-time-zone-transition.md) Returns the previous offset change, searching up to two years back.
- [`getTimeZoneTransitions`](./src/get-time-zone-transitions/get-time-zone-transitions.md) Returns every offset change inside an interval.
- [`getWallTimeStatus`](./src/get-wall-time-status/get-wall-time-status.md) Reports whether a wall time exists once, never, or twice.
- [`getNextWeekday`](./src/get-next-weekday/get-next-weekday.md) Returns the start of the next day that falls on `weekday`.
- [`getNthWeekdayOfMonth`](./src/get-nth-weekday-of-month/get-nth-weekday-of-month.md) Returns the start of the nth weekday in a month.
- [`getPreviousWeekday`](./src/get-previous-weekday/get-previous-weekday.md) Returns the start of the previous day that falls on `weekday`.
- [`getTimeZoneDifference`](./src/get-time-zone-difference/get-time-zone-difference.md) Returns how many minutes the first zone is ahead of the second.
- [`getUtcOffset`](./src/get-utc-offset/get-utc-offset.md) Returns the offset from UTC, in minutes, for an instant in a zone.
- [`isAfter`](./src/is-after/is-after.md) Reports whether `date` is strictly later than `reference`.
- [`isBusinessDay`](./src/is-business-day/is-business-day.md) Reports whether a date falls on a business day.
- [`isWithinBusinessHours`](./src/is-within-business-hours/is-within-business-hours.md) Reports whether a date is inside working hours on a business day.
- [`listBusinessDaysInInterval`](./src/list-business-days-in-interval/list-business-days-in-interval.md) Lists the start of each business day that overlaps an interval.
- [`isBefore`](./src/is-before/is-before.md) Reports whether `date` is strictly earlier than `reference`.
- [`isBetween`](./src/is-between/is-between.md) Reports whether `date` lies between `start` and `end`.
- [`isDate`](./src/is-date/is-date.md) Reports whether `value` is a `Date` object.
- [`isDaylightSavingTime`](./src/is-daylight-saving-time/is-daylight-saving-time.md) Reports whether an instant is in daylight saving time.
- [`isHoliday`](./src/is-holiday/is-holiday.md) Reports whether a holiday rule falls on a date.
- [`isLeapYear`](./src/is-leap-year/is-leap-year.md) Reports whether a year has a February 29.
- [`isOpenAt`](./src/is-open-at/is-open-at.md) Reports whether a weekly schedule is open at a date.
- [`isSameInstant`](./src/is-same-instant/is-same-instant.md) Reports whether two values are the same millisecond.
- [`isSameUnit`](./src/is-same-unit/is-same-unit.md) Reports whether two dates fall in the same unit in a time zone.
- [`isValidDate`](./src/is-valid-date/is-valid-date.md) Reports whether `value` is a real date.
- [`isValidTimeZone`](./src/is-valid-time-zone/is-valid-time-zone.md) Reports whether `timeZone` is a zone this runtime can use.
- [`removeDuplicateDates`](./src/remove-duplicate-dates/remove-duplicate-dates.md) Returns the first date of each unit, in input order.
- [`roundDuration`](./src/round-duration/round-duration.md) Rounds a duration to a unit.
- [`roundToUnit`](./src/round-to-unit/round-to-unit.md) Rounds a date to a unit increment.
- [`setDateParts`](./src/set-date-parts/set-date-parts.md) Returns a date with some wall-clock fields replaced.
- [`sortDates`](./src/sort-dates/sort-dates.md) Returns a new array of dates in time order.
- [`startOfUnit`](./src/start-of-unit/start-of-unit.md) Returns the first millisecond of the unit that contains a date.
- [`subtractDuration`](./src/subtract-duration/subtract-duration.md) Subtracts a duration from a date.
- [`toDate`](./src/to-date/to-date.md) Returns a new `Date` for `value`.
- [`differenceInUnit`](./src/difference-in-unit/difference-in-unit.md) Counts whole units from `earlier` to `later`.
- [`durationToMilliseconds`](./src/duration-to-milliseconds/duration-to-milliseconds.md) Options for measuring a duration in milliseconds.
- [`differenceInCalendarUnit`](./src/difference-in-calendar-unit/difference-in-calendar-unit.md) Counts calendar boundaries crossed between two dates.
- [`differenceAsDuration`](./src/difference-as-duration/difference-as-duration.md) Breaks the distance from `earlier` to `later` into a duration.
- [`getAge`](./src/get-age/get-age.md) Returns the number of completed years since a birth date.
- [`getAgeAsDuration`](./src/get-age-as-duration/get-age-as-duration.md) Returns an age as years, months, and days.
- [`getNextAnniversary`](./src/get-next-anniversary/get-next-anniversary.md) Returns the start of the next anniversary of a date.
- [`getCountdownParts`](./src/get-countdown-parts/get-countdown-parts.md) Splits the time remaining until a target into countdown fields.
- [`isToday`](./src/is-today/is-today.md) Reports whether a date falls on today's calendar day in a time zone.
- [`isTomorrow`](./src/is-tomorrow/is-tomorrow.md) Reports whether a date falls on the calendar day after today.
- [`isYesterday`](./src/is-yesterday/is-yesterday.md) Reports whether a date falls on the calendar day before today.
- [`isPast`](./src/is-past/is-past.md) Reports whether a date is strictly before now.
- [`isFuture`](./src/is-future/is-future.md) Reports whether a date is strictly after now.
- [`isWeekend`](./src/is-weekend/is-weekend.md) Reports whether a date falls on a weekend day.
- [`isWithinNext`](./src/is-within-next/is-within-next.md) Reports whether a date is between now and now plus a duration.
- [`isWithinLast`](./src/is-within-last/is-within-last.md) Reports whether a date is between now minus a duration and now.
- [`getMillisecondsUntilNextUnit`](./src/get-milliseconds-until-next-unit/get-milliseconds-until-next-unit.md) Returns the delay until the next unit boundary.
- [`getDayOfYear`](./src/get-day-of-year/get-day-of-year.md) Returns the day of the year, from 1 through 366.
- [`getIsoWeek`](./src/get-iso-week/get-iso-week.md) Returns the ISO 8601 week number, from 1 through 53.
- [`getIsoWeekYear`](./src/get-iso-week-year/get-iso-week-year.md) Returns the year the ISO week belongs to.
- [`getIsoWeeksInYear`](./src/get-iso-weeks-in-year/get-iso-weeks-in-year.md) Returns the number of ISO weeks in a year.
- [`getWeekOfYear`](./src/get-week-of-year/get-week-of-year.md) Returns a locale-style week number.
- [`getWeekOfMonth`](./src/get-week-of-month/get-week-of-month.md) Returns the week of the month, from 1 through 6.
- [`getWeekdayNames`](./src/get-weekday-names/get-weekday-names.md) Returns the 7 weekday names, starting on `startsOn`.
- [`getQuarter`](./src/get-quarter/get-quarter.md) Returns the calendar quarter, from 1 through 4.
- [`getSeason`](./src/get-season/get-season.md) Returns the season for a date.
- [`getTimeOfDay`](./src/get-time-of-day/get-time-of-day.md) Returns the wall-clock time of a date in a zone.
- [`listTimeZones`](./src/list-time-zones/list-time-zones.md) Returns the IANA time zones this runtime knows.
- [`millisecondsToDuration`](./src/milliseconds-to-duration/milliseconds-to-duration.md) Splits a millisecond length into duration fields.
- [`negateDuration`](./src/negate-duration/negate-duration.md) Returns a duration with every field's sign flipped.
- [`normalizeDuration`](./src/normalize-duration/normalize-duration.md) Balances a duration so smaller units do not overflow.
- [`parseLocaleDate`](./src/parse-locale-date/parse-locale-date.md) Parses a numeric date written the way the locale writes it.
- [`parseTimeOfDay`](./src/parse-time-of-day/parse-time-of-day.md) Parses a time of day.
- [`parseUtcOffset`](./src/parse-utc-offset/parse-utc-offset.md) Parses a UTC offset into minutes.
- [`getFiscalYear`](./src/get-fiscal-year/get-fiscal-year.md) Returns the fiscal year label for a date.
- [`getFiscalQuarter`](./src/get-fiscal-quarter/get-fiscal-quarter.md) Returns the quarter inside the fiscal year, from 1 through 4.
- [`getFiscalYearInterval`](./src/get-fiscal-year-interval/get-fiscal-year-interval.md) Returns the half-open interval of a fiscal year.
- [`getLocaleDatePattern`](./src/get-locale-date-pattern/get-locale-date-pattern.md) Returns the locale's numeric date pattern, such as `dd/MM/yyyy`.
- [`getLocaleHourCycle`](./src/get-locale-hour-cycle/get-locale-hour-cycle.md) Reports whether a locale uses a 12-hour or 24-hour clock.
- [`getLocaleWeekInfo`](./src/get-locale-week-info/get-locale-week-info.md) Returns the week rules `Intl` reports for a locale.
- [`getMonthNames`](./src/get-month-names/get-month-names.md) Returns the 12 month names, January first.
- [`createMonthCalendarGrid`](./src/create-month-calendar-grid/create-month-calendar-grid.md) Builds the weeks that cover one month, for a calendar UI.
- [`formatIsoDate`](./src/format-iso-date/format-iso-date.md) Formats the calendar date in a time zone as `YYYY-MM-DD`.
- [`formatIsoDateTime`](./src/format-iso-date-time/format-iso-date-time.md) Formats an instant as an ISO date-time with a numeric offset.
- [`fromJulianDate`](./src/from-julian-date/from-julian-date.md) Returns a date from an astronomical Julian Date.
- [`fromUnixSeconds`](./src/from-unix-seconds/from-unix-seconds.md) Returns a date from whole or fractional Unix seconds.
- [`parseDateWithPattern`](./src/parse-date-with-pattern/parse-date-with-pattern.md) Parses text written with the same tokens as `formatDate`.
- [`parseIsoDate`](./src/parse-iso-date/parse-iso-date.md) Parses `YYYY-MM-DD` as midnight in a time zone.
- [`parseIsoDateTime`](./src/parse-iso-date-time/parse-iso-date-time.md) Parses an ISO 8601, RFC 3339, or RFC 9557 date-time.
- [`reviveIsoDateTimes`](./src/revive-iso-date-times/revive-iso-date-times.md) A `JSON.parse` reviver that turns strict ISO date-times into dates.
- [`toJulianDate`](./src/to-julian-date/to-julian-date.md) Returns the astronomical Julian Date of an instant.
- [`toTemporalInstant`](./src/to-temporal-instant/to-temporal-instant.md) Returns a Temporal instant for a date.
- [`toUnixSeconds`](./src/to-unix-seconds/to-unix-seconds.md) Returns whole seconds since the Unix epoch, rounded toward minus infinity.
- [`formatDate`](./src/format-date/format-date.md) Formats a date with Unicode CLDR field tokens.
- [`formatDateRange`](./src/format-date-range/format-date-range.md) Formats two dates as a range, collapsing shared parts.
- [`formatTimeOfDay`](./src/format-time-of-day/format-time-of-day.md) Formats a time of day in a locale.
- [`formatTimeZoneName`](./src/format-time-zone-name/format-time-zone-name.md) Returns the localized name of a time zone at an instant.
- [`formatDateWithStyle`](./src/format-date-with-style/format-date-with-style.md) Formats a date with `Intl` date and time styles.
- [`formatUtcOffset`](./src/format-utc-offset/format-utc-offset.md) Formats a UTC offset in minutes.
- [`formatRelativeCalendarDay`](./src/format-relative-calendar-day/format-relative-calendar-day.md) Formats a date as a nearby day plus a time, then as a full date.
- [`formatRelativeTime`](./src/format-relative-time/format-relative-time.md) Formats a date as relative time, such as `3 days ago` or `in 2 hours`.
- [`getRelativeTimeParts`](./src/get-relative-time-parts/get-relative-time-parts.md) Returns the signed relative-time value and the unit that was chosen.
- [`formatDuration`](./src/format-duration/format-duration.md) Formats a duration as text such as `1 hour, 30 minutes`.
- [`formatDurationAsClock`](./src/format-duration-as-clock/format-duration-as-clock.md) Formats a duration as `H:mm:ss` for a timer.
- [`formatDurationCompact`](./src/format-duration-compact/format-duration-compact.md) Formats a duration with compact unit symbols such as `1h 30m`.
- [`formatIsoDuration`](./src/format-iso-duration/format-iso-duration.md) Formats a duration as an ISO 8601 duration.
- [`isValidDuration`](./src/is-valid-duration/is-valid-duration.md) Reports whether a value is a duration.
- [`parseDurationText`](./src/parse-duration-text/parse-duration-text.md) Parses English duration text.
- [`parseIsoDuration`](./src/parse-iso-duration/parse-iso-duration.md) Parses an ISO 8601 duration such as `P1Y2M3DT4H5M6.5S`.
- [`formatHttpDate`](./src/format-http-date/format-http-date.md) Formats a date as an HTTP IMF-fixdate in GMT.
- [`parseHttpDate`](./src/parse-http-date/parse-http-date.md) Parses an HTTP date in IMF-fixdate, RFC 850, or asctime form.
- [`toExcelSerialDate`](./src/to-excel-serial-date/to-excel-serial-date.md) Returns the spreadsheet serial number of a date.
- [`fromExcelSerialDate`](./src/from-excel-serial-date/from-excel-serial-date.md) Returns the date named by a spreadsheet serial number.
- [`fromTemporal`](./src/from-temporal/from-temporal.md) Returns a `Date` from a Temporal instant or zoned date-time.
- [`formatRfc2822Date`](./src/format-rfc2822-date/format-rfc2822-date.md) Formats a date as an RFC 2822 date with a numeric offset.
- [`parseRfc2822Date`](./src/parse-rfc2822-date/parse-rfc2822-date.md) Parses an email date header.

### `@sgx4u/date-time/recurrence`

- [`describeRecurrenceRule`](./src/describe-recurrence-rule/describe-recurrence-rule.md) Describes a recurrence rule in English.
- [`formatRecurrenceRule`](./src/format-recurrence-rule/format-recurrence-rule.md) Writes a recurrence rule as RFC 5545 text.
- [`getNextRecurrenceOccurrence`](./src/get-next-recurrence-occurrence/get-next-recurrence-occurrence.md) Returns the next occurrence of a rule.
- [`getPreviousRecurrenceOccurrence`](./src/get-previous-recurrence-occurrence/get-previous-recurrence-occurrence.md) Returns the previous occurrence of a rule.
- [`isValidRecurrenceRule`](./src/is-valid-recurrence-rule/is-valid-recurrence-rule.md) Reports whether text is a supported recurrence rule.
- [`listRecurrenceOccurrences`](./src/list-recurrence-occurrences/list-recurrence-occurrences.md) Lists occurrences inside an interval.
- [`parseRecurrenceRule`](./src/parse-recurrence-rule/parse-recurrence-rule.md) Parses an RFC 5545 recurrence.

### `@sgx4u/date-time/cron`

- [`describeCronExpression`](./src/describe-cron-expression/describe-cron-expression.md) Describes a cron expression in English.
- [`doesCronMatch`](./src/does-cron-match/does-cron-match.md) Reports whether a schedule fires at a date.
- [`getNextCronRuns`](./src/get-next-cron-runs/get-next-cron-runs.md) Returns the next times a cron schedule fires.
- [`getPreviousCronRuns`](./src/get-previous-cron-runs/get-previous-cron-runs.md) Returns earlier times a cron schedule fired, newest first.
- [`isValidCronExpression`](./src/is-valid-cron-expression/is-valid-cron-expression.md) Reports whether text is a cron expression.
- [`parseCronExpression`](./src/parse-cron-expression/parse-cron-expression.md) Parses a cron expression.

### `@sgx4u/date-time/natural-language`

- [`findDatesInText`](./src/find-dates-in-text/find-dates-in-text.md) Finds English date phrases in a longer text.
- [`parseNaturalDate`](./src/parse-natural-date/parse-natural-date.md) Parses an English date phrase.
- [`parseNaturalDateRange`](./src/parse-natural-date-range/parse-natural-date-range.md) Parses an English date range.

### `@sgx4u/date-time/astronomy`

- [`getMoonPhase`](./src/get-moon-phase/get-moon-phase.md) Returns the moon phase at an instant.
- [`getSunTimes`](./src/get-sun-times/get-sun-times.md) A place on Earth.

### `@sgx4u/date-time/holidays/india`

- [`indiaHolidayRules`](./src/holidays/india-holiday-rules/india-holiday-rules.md) A published calendar date used by a year table.

### `@sgx4u/date-time/holidays/united-states`

- [`unitedStatesHolidayRules`](./src/holidays/united-states-holiday-rules/united-states-holiday-rules.md) United States federal holidays, with the observed weekday.

### `@sgx4u/date-time/holidays/united-kingdom`

- [`unitedKingdomHolidayRules`](./src/holidays/united-kingdom-holiday-rules/united-kingdom-holiday-rules.md) Bank holidays for England and Wales.

<h2 id="subpaths">📦 Subpaths</h2>

| Import                                     | What it contains                                                                                                    |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------- |
| `@sgx4u/date-time`                         | Dates, durations, intervals, business time, holiday rules, time zones, opening hours, seasons, and Temporal interop |
| `@sgx4u/date-time/recurrence`              | RFC 5545 recurrence                                                                                                 |
| `@sgx4u/date-time/cron`                    | Cron expressions                                                                                                    |
| `@sgx4u/date-time/natural-language`        | English date phrases                                                                                                |
| `@sgx4u/date-time/holidays/india`          | `indiaHolidayRules`                                                                                                 |
| `@sgx4u/date-time/holidays/united-states`  | `unitedStatesHolidayRules`                                                                                          |
| `@sgx4u/date-time/holidays/united-kingdom` | `unitedKingdomHolidayRules`                                                                                         |
| `@sgx4u/date-time/astronomy`               | Sunrise, sunset, and moon phase                                                                                     |

<h2 id="inputs">📥 Inputs</h2>

A `DateInput` is a `Date`, a finite Unix millisecond timestamp inside ±8.64e15, or a strict `YYYY-MM-DD` or ISO date-time string. A date-only string is midnight in the function's `timeZone`. A date-time string must carry `Z` or an explicit offset, including `+0530`. Months are 1 through 12. Weekdays are ISO numbers, Monday 1 through Sunday 7. Functions do not mutate their inputs, and a function that returns a `Date` returns a new one.

<h2 id="time-zones">🌍 Time zones</h2>

A `timeZone` option accepts an IANA name, `UTC`, or a fixed offset `±HH:mm`, `±HHmm`, or `±HH`. Omitted, it is the system zone, read on each call. `disambiguation` chooses what happens at a daylight-saving gap or overlap: `compatible` (the default), `earlier`, `later`, or `reject`.

<h2 id="errors">⚠️ Errors</h2>

`is*`, `does*`, and `matches*` functions return `false` instead of throwing. `parse*` functions return `undefined` when the text does not match. Other functions throw `TypeError` for the wrong type and `RangeError` for a value that has the right type but is not usable. The message names the argument and the value received.

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
