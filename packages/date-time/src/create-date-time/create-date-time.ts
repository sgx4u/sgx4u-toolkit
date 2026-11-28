import {
    applyDateTimeConfig,
    freezeDateTimeConfig,
} from "../utils/config.utils.js";
import type {
    DateTimeConfig,
    RequiredConfigKeys,
    WithConfig,
} from "../types/date-time-config.types.js";
import type { FormatDateParams } from "../format-date/format-date.types.js";
import { addBusinessDays as addBusinessDaysFunction } from "../add-business-days/add-business-days.js";
import { addBusinessHours as addBusinessHoursFunction } from "../add-business-hours/add-business-hours.js";
import { addDurations as addDurationsFunction } from "../add-durations/add-durations.js";
import { addToTimeOfDay as addToTimeOfDayFunction } from "../add-to-time-of-day/add-to-time-of-day.js";
import { addDuration as addDurationFunction } from "../add-duration/add-duration.js";
import { clampDate as clampDateFunction } from "../clamp-date/clamp-date.js";
import { differenceInBusinessDays as differenceInBusinessDaysFunction } from "../difference-in-business-days/difference-in-business-days.js";
import { differenceInBusinessHours as differenceInBusinessHoursFunction } from "../difference-in-business-hours/difference-in-business-hours.js";
import { changeTimeZoneKeepingWallTime as changeTimeZoneKeepingWallTimeFunction } from "../change-time-zone-keeping-wall-time/change-time-zone-keeping-wall-time.js";
import { compareDates as compareDatesFunction } from "../compare-dates/compare-dates.js";
import { compareDurations as compareDurationsFunction } from "../compare-durations/compare-durations.js";
import { compareTimesOfDay as compareTimesOfDayFunction } from "../compare-times-of-day/compare-times-of-day.js";
import { createDate as createDateFunction } from "../create-date/create-date.js";
import { createHolidayPredicate as createHolidayPredicateFunction } from "../create-holiday-predicate/create-holiday-predicate.js";
import { createInterval as createIntervalFunction } from "../create-interval/create-interval.js";
import { divideInterval as divideIntervalFunction } from "../divide-interval/divide-interval.js";
import { getIntervalDuration as getIntervalDurationFunction } from "../get-interval-duration/get-interval-duration.js";
import { getIntervalGaps as getIntervalGapsFunction } from "../get-interval-gaps/get-interval-gaps.js";
import { doIntervalsOverlap as doIntervalsOverlapFunction } from "../do-intervals-overlap/do-intervals-overlap.js";
import { getIntervalIntersection as getIntervalIntersectionFunction } from "../get-interval-intersection/get-interval-intersection.js";
import { isValidInterval as isValidIntervalFunction } from "../is-valid-interval/is-valid-interval.js";
import { isTimeOfDayInRange as isTimeOfDayInRangeFunction } from "../is-time-of-day-in-range/is-time-of-day-in-range.js";
import { isWithinInterval as isWithinIntervalFunction } from "../is-within-interval/is-within-interval.js";
import { listDatesInInterval as listDatesInIntervalFunction } from "../list-dates-in-interval/list-dates-in-interval.js";
import { matchesDatePattern as matchesDatePatternFunction } from "../matches-date-pattern/matches-date-pattern.js";
import { mergeIntervals as mergeIntervalsFunction } from "../merge-intervals/merge-intervals.js";
import { splitInterval as splitIntervalFunction } from "../split-interval/split-interval.js";
import { subtractIntervals as subtractIntervalsFunction } from "../subtract-intervals/subtract-intervals.js";
import { endOfUnit as endOfUnitFunction } from "../end-of-unit/end-of-unit.js";
import { findAvailableSlots as findAvailableSlotsFunction } from "../find-available-slots/find-available-slots.js";
import { findClosestDate as findClosestDateFunction } from "../find-closest-date/find-closest-date.js";
import { findClosestDateIndex as findClosestDateIndexFunction } from "../find-closest-date-index/find-closest-date-index.js";
import { getDateParts as getDatePartsFunction } from "../get-date-parts/get-date-parts.js";
import { getEasterSunday as getEasterSundayFunction } from "../get-easter-sunday/get-easter-sunday.js";
import { getHoliday as getHolidayFunction } from "../get-holiday/get-holiday.js";
import { getHolidaysInYear as getHolidaysInYearFunction } from "../get-holidays-in-year/get-holidays-in-year.js";
import { getObservedDate as getObservedDateFunction } from "../get-observed-date/get-observed-date.js";
import { getDaysInMonth as getDaysInMonthFunction } from "../get-days-in-month/get-days-in-month.js";
import { getDaysInYear as getDaysInYearFunction } from "../get-days-in-year/get-days-in-year.js";
import { getEarliestDate as getEarliestDateFunction } from "../get-earliest-date/get-earliest-date.js";
import { getLatestDate as getLatestDateFunction } from "../get-latest-date/get-latest-date.js";
import { getLocalTimeZone as getLocalTimeZoneFunction } from "../get-local-time-zone/get-local-time-zone.js";
import { getNextBusinessDay as getNextBusinessDayFunction } from "../get-next-business-day/get-next-business-day.js";
import { getNextBusinessHoursStart as getNextBusinessHoursStartFunction } from "../get-next-business-hours-start/get-next-business-hours-start.js";
import { getPreviousBusinessDay as getPreviousBusinessDayFunction } from "../get-previous-business-day/get-previous-business-day.js";
import { getNextClosingTime as getNextClosingTimeFunction } from "../get-next-closing-time/get-next-closing-time.js";
import { getNextOpeningTime as getNextOpeningTimeFunction } from "../get-next-opening-time/get-next-opening-time.js";
import { getNextTimeZoneTransition as getNextTimeZoneTransitionFunction } from "../get-next-time-zone-transition/get-next-time-zone-transition.js";
import { getPreviousTimeZoneTransition as getPreviousTimeZoneTransitionFunction } from "../get-previous-time-zone-transition/get-previous-time-zone-transition.js";
import { getTimeZoneTransitions as getTimeZoneTransitionsFunction } from "../get-time-zone-transitions/get-time-zone-transitions.js";
import { getWallTimeStatus as getWallTimeStatusFunction } from "../get-wall-time-status/get-wall-time-status.js";
import { getNextWeekday as getNextWeekdayFunction } from "../get-next-weekday/get-next-weekday.js";
import { getNthWeekdayOfMonth as getNthWeekdayOfMonthFunction } from "../get-nth-weekday-of-month/get-nth-weekday-of-month.js";
import { getPreviousWeekday as getPreviousWeekdayFunction } from "../get-previous-weekday/get-previous-weekday.js";
import { getTimeZoneDifference as getTimeZoneDifferenceFunction } from "../get-time-zone-difference/get-time-zone-difference.js";
import { getUTCOffset as getUTCOffsetFunction } from "../get-utc-offset/get-utc-offset.js";
import { isAfter as isAfterFunction } from "../is-after/is-after.js";
import { isBusinessDay as isBusinessDayFunction } from "../is-business-day/is-business-day.js";
import { isWithinBusinessHours as isWithinBusinessHoursFunction } from "../is-within-business-hours/is-within-business-hours.js";
import { listBusinessDaysInInterval as listBusinessDaysInIntervalFunction } from "../list-business-days-in-interval/list-business-days-in-interval.js";
import { isBefore as isBeforeFunction } from "../is-before/is-before.js";
import { isBetween as isBetweenFunction } from "../is-between/is-between.js";
import { isDate as isDateFunction } from "../is-date/is-date.js";
import { isDaylightSavingTime as isDaylightSavingTimeFunction } from "../is-daylight-saving-time/is-daylight-saving-time.js";
import { isHoliday as isHolidayFunction } from "../is-holiday/is-holiday.js";
import { isLeapYear as isLeapYearFunction } from "../is-leap-year/is-leap-year.js";
import { isOpenAt as isOpenAtFunction } from "../is-open-at/is-open-at.js";
import { isSameInstant as isSameInstantFunction } from "../is-same-instant/is-same-instant.js";
import { isSameUnit as isSameUnitFunction } from "../is-same-unit/is-same-unit.js";
import { isValidDate as isValidDateFunction } from "../is-valid-date/is-valid-date.js";
import { isValidTimeZone as isValidTimeZoneFunction } from "../is-valid-time-zone/is-valid-time-zone.js";
import { removeDuplicateDates as removeDuplicateDatesFunction } from "../remove-duplicate-dates/remove-duplicate-dates.js";
import { roundDuration as roundDurationFunction } from "../round-duration/round-duration.js";
import { roundToUnit as roundToUnitFunction } from "../round-to-unit/round-to-unit.js";
import { setDateParts as setDatePartsFunction } from "../set-date-parts/set-date-parts.js";
import { sortDates as sortDatesFunction } from "../sort-dates/sort-dates.js";
import { startOfUnit as startOfUnitFunction } from "../start-of-unit/start-of-unit.js";
import { subtractDuration as subtractDurationFunction } from "../subtract-duration/subtract-duration.js";
import { toDate as toDateFunction } from "../to-date/to-date.js";
import { differenceInUnit as differenceInUnitFunction } from "../difference-in-unit/difference-in-unit.js";
import { durationToMilliseconds as durationToMillisecondsFunction } from "../duration-to-milliseconds/duration-to-milliseconds.js";
import { differenceInCalendarUnit as differenceInCalendarUnitFunction } from "../difference-in-calendar-unit/difference-in-calendar-unit.js";
import { differenceAsDuration as differenceAsDurationFunction } from "../difference-as-duration/difference-as-duration.js";
import { getAge as getAgeFunction } from "../get-age/get-age.js";
import { getAgeAsDuration as getAgeAsDurationFunction } from "../get-age-as-duration/get-age-as-duration.js";
import { getNextAnniversary as getNextAnniversaryFunction } from "../get-next-anniversary/get-next-anniversary.js";
import { getCountdownParts as getCountdownPartsFunction } from "../get-countdown-parts/get-countdown-parts.js";
import { isToday as isTodayFunction } from "../is-today/is-today.js";
import { isTomorrow as isTomorrowFunction } from "../is-tomorrow/is-tomorrow.js";
import { isYesterday as isYesterdayFunction } from "../is-yesterday/is-yesterday.js";
import { isPast as isPastFunction } from "../is-past/is-past.js";
import { isFuture as isFutureFunction } from "../is-future/is-future.js";
import { isWeekend as isWeekendFunction } from "../is-weekend/is-weekend.js";
import { isWithinNext as isWithinNextFunction } from "../is-within-next/is-within-next.js";
import { isWithinLast as isWithinLastFunction } from "../is-within-last/is-within-last.js";
import { getMillisecondsUntilNextUnit as getMillisecondsUntilNextUnitFunction } from "../get-milliseconds-until-next-unit/get-milliseconds-until-next-unit.js";
import { getDayOfYear as getDayOfYearFunction } from "../get-day-of-year/get-day-of-year.js";
import { getISOWeek as getISOWeekFunction } from "../get-iso-week/get-iso-week.js";
import { getISOWeekYear as getISOWeekYearFunction } from "../get-iso-week-year/get-iso-week-year.js";
import { getISOWeeksInYear as getISOWeeksInYearFunction } from "../get-iso-weeks-in-year/get-iso-weeks-in-year.js";
import { getWeekOfYear as getWeekOfYearFunction } from "../get-week-of-year/get-week-of-year.js";
import { getWeekOfMonth as getWeekOfMonthFunction } from "../get-week-of-month/get-week-of-month.js";
import { getWeekdayNames as getWeekdayNamesFunction } from "../get-weekday-names/get-weekday-names.js";
import { getQuarter as getQuarterFunction } from "../get-quarter/get-quarter.js";
import { getSeason as getSeasonFunction } from "../get-season/get-season.js";
import { getTimeOfDay as getTimeOfDayFunction } from "../get-time-of-day/get-time-of-day.js";
import { listTimeZones as listTimeZonesFunction } from "../list-time-zones/list-time-zones.js";
import { millisecondsToDuration as millisecondsToDurationFunction } from "../milliseconds-to-duration/milliseconds-to-duration.js";
import { negateDuration as negateDurationFunction } from "../negate-duration/negate-duration.js";
import { normalizeDuration as normalizeDurationFunction } from "../normalize-duration/normalize-duration.js";
import { parseLocaleDate as parseLocaleDateFunction } from "../parse-locale-date/parse-locale-date.js";
import { parseTimeOfDay as parseTimeOfDayFunction } from "../parse-time-of-day/parse-time-of-day.js";
import { parseUTCOffset as parseUTCOffsetFunction } from "../parse-utc-offset/parse-utc-offset.js";
import { getFiscalYear as getFiscalYearFunction } from "../get-fiscal-year/get-fiscal-year.js";
import { getFiscalQuarter as getFiscalQuarterFunction } from "../get-fiscal-quarter/get-fiscal-quarter.js";
import { getFiscalYearInterval as getFiscalYearIntervalFunction } from "../get-fiscal-year-interval/get-fiscal-year-interval.js";
import { getLocaleDatePattern as getLocaleDatePatternFunction } from "../get-locale-date-pattern/get-locale-date-pattern.js";
import { getLocaleHourCycle as getLocaleHourCycleFunction } from "../get-locale-hour-cycle/get-locale-hour-cycle.js";
import { getLocaleWeekInfo as getLocaleWeekInfoFunction } from "../get-locale-week-info/get-locale-week-info.js";
import { getMonthNames as getMonthNamesFunction } from "../get-month-names/get-month-names.js";
import { createMonthCalendarGrid as createMonthCalendarGridFunction } from "../create-month-calendar-grid/create-month-calendar-grid.js";
import { formatISODate as formatISODateFunction } from "../format-iso-date/format-iso-date.js";
import { formatISODateTime as formatISODateTimeFunction } from "../format-iso-date-time/format-iso-date-time.js";
import { fromJulianDate as fromJulianDateFunction } from "../from-julian-date/from-julian-date.js";
import { fromUnixSeconds as fromUnixSecondsFunction } from "../from-unix-seconds/from-unix-seconds.js";
import { parseDateWithPattern as parseDateWithPatternFunction } from "../parse-date-with-pattern/parse-date-with-pattern.js";
import { parseISODate as parseISODateFunction } from "../parse-iso-date/parse-iso-date.js";
import { parseISODateTime as parseISODateTimeFunction } from "../parse-iso-date-time/parse-iso-date-time.js";
import { reviveISODateTimes as reviveISODateTimesFunction } from "../revive-iso-date-times/revive-iso-date-times.js";
import { toJulianDate as toJulianDateFunction } from "../to-julian-date/to-julian-date.js";
import { toTemporalInstant as toTemporalInstantFunction } from "../to-temporal-instant/to-temporal-instant.js";
import { toUnixSeconds as toUnixSecondsFunction } from "../to-unix-seconds/to-unix-seconds.js";
import { formatDate as formatDateFunction } from "../format-date/format-date.js";
import { formatDateRange as formatDateRangeFunction } from "../format-date-range/format-date-range.js";
import { formatTimeOfDay as formatTimeOfDayFunction } from "../format-time-of-day/format-time-of-day.js";
import { formatTimeZoneName as formatTimeZoneNameFunction } from "../format-time-zone-name/format-time-zone-name.js";
import { formatDateWithStyle as formatDateWithStyleFunction } from "../format-date-with-style/format-date-with-style.js";
import { formatUTCOffset as formatUTCOffsetFunction } from "../format-utc-offset/format-utc-offset.js";
import { formatRelativeCalendarDay as formatRelativeCalendarDayFunction } from "../format-relative-calendar-day/format-relative-calendar-day.js";
import { formatRelativeTime as formatRelativeTimeFunction } from "../format-relative-time/format-relative-time.js";
import { getRelativeTimeParts as getRelativeTimePartsFunction } from "../get-relative-time-parts/get-relative-time-parts.js";
import { formatDuration as formatDurationFunction } from "../format-duration/format-duration.js";
import { formatDurationAsClock as formatDurationAsClockFunction } from "../format-duration-as-clock/format-duration-as-clock.js";
import { formatDurationCompact as formatDurationCompactFunction } from "../format-duration-compact/format-duration-compact.js";
import { formatISODuration as formatISODurationFunction } from "../format-iso-duration/format-iso-duration.js";
import { isValidDuration as isValidDurationFunction } from "../is-valid-duration/is-valid-duration.js";
import { parseDurationText as parseDurationTextFunction } from "../parse-duration-text/parse-duration-text.js";
import { parseISODuration as parseISODurationFunction } from "../parse-iso-duration/parse-iso-duration.js";
import { formatHTTPDate as formatHTTPDateFunction } from "../format-http-date/format-http-date.js";
import { parseHTTPDate as parseHTTPDateFunction } from "../parse-http-date/parse-http-date.js";
import { toExcelSerialDate as toExcelSerialDateFunction } from "../to-excel-serial-date/to-excel-serial-date.js";
import { fromExcelSerialDate as fromExcelSerialDateFunction } from "../from-excel-serial-date/from-excel-serial-date.js";
import { fromTemporal as fromTemporalFunction } from "../from-temporal/from-temporal.js";
import { formatRFC2822Date as formatRFC2822DateFunction } from "../format-rfc2822-date/format-rfc2822-date.js";
import { parseRFC2822Date as parseRFC2822DateFunction } from "../parse-rfc2822-date/parse-rfc2822-date.js";
import type { AddBusinessDaysParams } from "../add-business-days/add-business-days.types.js";
import type { AddBusinessHoursParams } from "../add-business-hours/add-business-hours.types.js";
import type { AddDurationsParams } from "../add-durations/add-durations.types.js";
import type { AddToTimeOfDayParams } from "../add-to-time-of-day/add-to-time-of-day.types.js";
import type { AddDurationParams } from "../add-duration/add-duration.types.js";
import type { ClampDateParams } from "../clamp-date/clamp-date.types.js";
import type { DifferenceInBusinessDaysParams } from "../difference-in-business-days/difference-in-business-days.types.js";
import type { DifferenceInBusinessHoursParams } from "../difference-in-business-hours/difference-in-business-hours.types.js";
import type { ChangeTimeZoneKeepingWallTimeParams } from "../change-time-zone-keeping-wall-time/change-time-zone-keeping-wall-time.types.js";
import type { CompareDatesParams } from "../compare-dates/compare-dates.types.js";
import type { CompareDurationsParams } from "../compare-durations/compare-durations.types.js";
import type { CompareTimesOfDayParams } from "../compare-times-of-day/compare-times-of-day.types.js";
import type { CreateDateParams } from "../create-date/create-date.types.js";
import type { CreateHolidayPredicateParams } from "../create-holiday-predicate/create-holiday-predicate.types.js";
import type { CreateIntervalParams } from "../create-interval/create-interval.types.js";
import type { DivideIntervalParams } from "../divide-interval/divide-interval.types.js";
import type { GetIntervalDurationParams } from "../get-interval-duration/get-interval-duration.types.js";
import type { GetIntervalGapsParams } from "../get-interval-gaps/get-interval-gaps.types.js";
import type { DoIntervalsOverlapParams } from "../do-intervals-overlap/do-intervals-overlap.types.js";
import type { GetIntervalIntersectionParams } from "../get-interval-intersection/get-interval-intersection.types.js";
import type { IsTimeOfDayInRangeParams } from "../is-time-of-day-in-range/is-time-of-day-in-range.types.js";
import type { IsWithinIntervalParams } from "../is-within-interval/is-within-interval.js";
import type { ListDatesInIntervalParams } from "../list-dates-in-interval/list-dates-in-interval.types.js";
import type { MatchesDatePatternParams } from "../matches-date-pattern/matches-date-pattern.js";
import type { MergeIntervalsParams } from "../merge-intervals/merge-intervals.types.js";
import type { SplitIntervalParams } from "../split-interval/split-interval.js";
import type { SubtractIntervalsParams } from "../subtract-intervals/subtract-intervals.js";
import type { EndOfUnitParams } from "../end-of-unit/end-of-unit.types.js";
import type { FindAvailableSlotsParams } from "../find-available-slots/find-available-slots.types.js";
import type { FindClosestDateParams } from "../find-closest-date/find-closest-date.types.js";
import type { FindClosestDateIndexParams } from "../find-closest-date-index/find-closest-date-index.types.js";
import type { GetDatePartsParams } from "../get-date-parts/get-date-parts.types.js";
import type { GetEasterSundayParams } from "../get-easter-sunday/get-easter-sunday.types.js";
import type { GetHolidayParams } from "../get-holiday/get-holiday.types.js";
import type { GetHolidaysInYearParams } from "../get-holidays-in-year/get-holidays-in-year.types.js";
import type { GetObservedDateParams } from "../get-observed-date/get-observed-date.types.js";
import type { GetDaysInMonthParams } from "../get-days-in-month/get-days-in-month.types.js";
import type { GetEarliestDateParams } from "../get-earliest-date/get-earliest-date.types.js";
import type { GetLatestDateParams } from "../get-latest-date/get-latest-date.types.js";
import type { GetNextBusinessDayParams } from "../get-next-business-day/get-next-business-day.js";
import type { GetNextBusinessHoursStartParams } from "../get-next-business-hours-start/get-next-business-hours-start.js";
import type { GetPreviousBusinessDayParams } from "../get-previous-business-day/get-previous-business-day.js";
import type { GetNextClosingTimeParams } from "../get-next-closing-time/get-next-closing-time.js";
import type { GetNextOpeningTimeParams } from "../get-next-opening-time/get-next-opening-time.js";
import type { GetNextTimeZoneTransitionParams } from "../get-next-time-zone-transition/get-next-time-zone-transition.js";
import type { GetPreviousTimeZoneTransitionParams } from "../get-previous-time-zone-transition/get-previous-time-zone-transition.js";
import type { GetTimeZoneTransitionsParams } from "../get-time-zone-transitions/get-time-zone-transitions.js";
import type { GetWallTimeStatusParams } from "../get-wall-time-status/get-wall-time-status.js";
import type { GetNthWeekdayOfMonthParams } from "../get-nth-weekday-of-month/get-nth-weekday-of-month.js";
import type { GetTimeZoneDifferenceParams } from "../get-time-zone-difference/get-time-zone-difference.types.js";
import type { GetUTCOffsetParams } from "../get-utc-offset/get-utc-offset.js";
import type { IsAfterParams } from "../is-after/is-after.js";
import type { IsBusinessDayParams } from "../is-business-day/is-business-day.js";
import type { IsWithinBusinessHoursParams } from "../is-within-business-hours/is-within-business-hours.js";
import type { ListBusinessDaysInIntervalParams } from "../list-business-days-in-interval/list-business-days-in-interval.js";
import type { IsBeforeParams } from "../is-before/is-before.js";
import type { IsBetweenParams } from "../is-between/is-between.types.js";
import type { IsDaylightSavingTimeParams } from "../is-daylight-saving-time/is-daylight-saving-time.js";
import type {
    HolidayCheck,
    IsHolidayParams,
} from "../is-holiday/is-holiday.js";
import type { DateInput } from "../types/date-input.types.js";
import type { IsOpenAtParams } from "../is-open-at/is-open-at.js";
import type { IsSameInstantParams } from "../is-same-instant/is-same-instant.js";
import type { IsSameUnitParams } from "../is-same-unit/is-same-unit.js";
import type { RemoveDuplicateDatesParams } from "../remove-duplicate-dates/remove-duplicate-dates.types.js";
import type { RoundDurationParams } from "../round-duration/round-duration.types.js";
import type { RoundToUnitParams } from "../round-to-unit/round-to-unit.types.js";
import type { SetDatePartsParams } from "../set-date-parts/set-date-parts.js";
import type { SortDatesParams } from "../sort-dates/sort-dates.types.js";
import type { StartOfUnitParams } from "../start-of-unit/start-of-unit.js";
import type { SubtractDurationParams } from "../subtract-duration/subtract-duration.js";
import type { ToDateParams } from "../to-date/to-date.js";
import type { DifferenceInUnitParams } from "../difference-in-unit/difference-in-unit.types.js";
import type { DurationToMillisecondsParams } from "../duration-to-milliseconds/duration-to-milliseconds.types.js";
import type { DifferenceInCalendarUnitParams } from "../difference-in-calendar-unit/difference-in-calendar-unit.types.js";
import type { DifferenceAsDurationParams } from "../difference-as-duration/difference-as-duration.types.js";
import type { GetAgeParams } from "../get-age/get-age.types.js";
import type { GetNextAnniversaryParams } from "../get-next-anniversary/get-next-anniversary.types.js";
import type { GetCountdownPartsParams } from "../get-countdown-parts/get-countdown-parts.types.js";
import type { IsTodayParams } from "../is-today/is-today.js";
import type { IsTomorrowParams } from "../is-tomorrow/is-tomorrow.js";
import type { IsYesterdayParams } from "../is-yesterday/is-yesterday.js";
import type { IsPastParams } from "../is-past/is-past.js";
import type { IsFutureParams } from "../is-future/is-future.js";
import type { IsWeekendParams } from "../is-weekend/is-weekend.types.js";
import type { IsWithinNextParams } from "../is-within-next/is-within-next.js";
import type { IsWithinLastParams } from "../is-within-last/is-within-last.js";
import type { GetMillisecondsUntilNextUnitParams } from "../get-milliseconds-until-next-unit/get-milliseconds-until-next-unit.js";
import type { GetDayOfYearParams } from "../get-day-of-year/get-day-of-year.types.js";
import type { GetISOWeekParams } from "../get-iso-week/get-iso-week.types.js";
import type { GetISOWeekYearParams } from "../get-iso-week-year/get-iso-week-year.types.js";
import type { GetWeekOfYearParams } from "../get-week-of-year/get-week-of-year.types.js";
import type { GetWeekOfMonthParams } from "../get-week-of-month/get-week-of-month.js";
import type { GetQuarterParams } from "../get-quarter/get-quarter.js";
import type { GetSeasonParams } from "../get-season/get-season.types.js";
import type { GetTimeOfDayParams } from "../get-time-of-day/get-time-of-day.js";
import type { MillisecondsToDurationParams } from "../milliseconds-to-duration/milliseconds-to-duration.types.js";
import type { NormalizeDurationParams } from "../normalize-duration/normalize-duration.types.js";
import type { ParseLocaleDateParams } from "../parse-locale-date/parse-locale-date.js";
import type { GetLocaleDatePatternParams } from "../get-locale-date-pattern/get-locale-date-pattern.types.js";
import type { CreateMonthCalendarGridParams } from "../create-month-calendar-grid/create-month-calendar-grid.types.js";
import type { FormatISODateParams } from "../format-iso-date/format-iso-date.js";
import type { FormatISODateTimeParams } from "../format-iso-date-time/format-iso-date-time.types.js";
import type { ParseDateWithPatternParams } from "../parse-date-with-pattern/parse-date-with-pattern.types.js";
import type { ParseISODateParams } from "../parse-iso-date/parse-iso-date.js";
import type { ParseISODateTimeParams } from "../parse-iso-date-time/parse-iso-date-time.types.js";
import type { FormatDateRangeParams } from "../format-date-range/format-date-range.types.js";
import type { FormatTimeOfDayParams } from "../format-time-of-day/format-time-of-day.types.js";
import type { FormatTimeZoneNameParams } from "../format-time-zone-name/format-time-zone-name.types.js";
import type { FormatDateWithStyleParams } from "../format-date-with-style/format-date-with-style.types.js";
import type { FormatUTCOffsetParams } from "../format-utc-offset/format-utc-offset.types.js";
import type { FormatRelativeCalendarDayParams } from "../format-relative-calendar-day/format-relative-calendar-day.types.js";
import type { FormatRelativeTimeParams } from "../format-relative-time/format-relative-time.types.js";
import type { GetRelativeTimePartsParams } from "../get-relative-time-parts/get-relative-time-parts.types.js";
import type { FormatDurationParams } from "../format-duration/format-duration.types.js";
import type { FormatDurationAsClockParams } from "../format-duration-as-clock/format-duration-as-clock.types.js";
import type { FormatDurationCompactParams } from "../format-duration-compact/format-duration-compact.types.js";
import type { ToExcelSerialDateParams } from "../to-excel-serial-date/to-excel-serial-date.types.js";
import type { FromExcelSerialDateParams } from "../from-excel-serial-date/from-excel-serial-date.types.js";
import type { FormatRFC2822DateParams } from "../format-rfc2822-date/format-rfc2822-date.types.js";

/**
 * `formatDate` params. `pattern` is optional when the config sets one.
 */
type FormatDateCall<Config extends DateTimeConfig> =
    "formatPattern" extends RequiredConfigKeys<Config>
        ? Omit<WithConfig<FormatDateParams, Config>, "pattern"> & {
              pattern?: string;
          }
        : WithConfig<FormatDateParams, Config>;

/**
 * The root functions with one config's defaults already applied.
 */
export interface DateTimeInstance<Config extends DateTimeConfig> {
    addBusinessDays(
        params: WithConfig<AddBusinessDaysParams, Config>,
    ): ReturnType<typeof addBusinessDaysFunction>;
    addBusinessHours(
        params: WithConfig<AddBusinessHoursParams, Config>,
    ): ReturnType<typeof addBusinessHoursFunction>;
    addDurations(
        params: WithConfig<AddDurationsParams, Config>,
    ): ReturnType<typeof addDurationsFunction>;
    addToTimeOfDay(
        params: WithConfig<AddToTimeOfDayParams, Config>,
    ): ReturnType<typeof addToTimeOfDayFunction>;
    addDuration(
        params: WithConfig<AddDurationParams, Config>,
    ): ReturnType<typeof addDurationFunction>;
    clampDate(
        params: WithConfig<ClampDateParams, Config>,
    ): ReturnType<typeof clampDateFunction>;
    differenceInBusinessDays(
        params: WithConfig<DifferenceInBusinessDaysParams, Config>,
    ): ReturnType<typeof differenceInBusinessDaysFunction>;
    differenceInBusinessHours(
        params: WithConfig<DifferenceInBusinessHoursParams, Config>,
    ): ReturnType<typeof differenceInBusinessHoursFunction>;
    changeTimeZoneKeepingWallTime(
        params: WithConfig<ChangeTimeZoneKeepingWallTimeParams, Config>,
    ): ReturnType<typeof changeTimeZoneKeepingWallTimeFunction>;
    compareDates(
        params: WithConfig<CompareDatesParams, Config>,
    ): ReturnType<typeof compareDatesFunction>;
    compareDurations(
        params: WithConfig<CompareDurationsParams, Config>,
    ): ReturnType<typeof compareDurationsFunction>;
    compareTimesOfDay(
        params: WithConfig<CompareTimesOfDayParams, Config>,
    ): ReturnType<typeof compareTimesOfDayFunction>;
    createDate(
        params: WithConfig<CreateDateParams, Config>,
    ): ReturnType<typeof createDateFunction>;
    createHolidayPredicate(
        params: WithConfig<CreateHolidayPredicateParams, Config>,
    ): ReturnType<typeof createHolidayPredicateFunction>;
    createInterval(
        params: WithConfig<CreateIntervalParams, Config>,
    ): ReturnType<typeof createIntervalFunction>;
    divideInterval(
        params: WithConfig<DivideIntervalParams, Config>,
    ): ReturnType<typeof divideIntervalFunction>;
    getIntervalDuration(
        params: WithConfig<GetIntervalDurationParams, Config>,
    ): ReturnType<typeof getIntervalDurationFunction>;
    getIntervalGaps(
        params: WithConfig<GetIntervalGapsParams, Config>,
    ): ReturnType<typeof getIntervalGapsFunction>;
    doIntervalsOverlap(
        params: WithConfig<DoIntervalsOverlapParams, Config>,
    ): ReturnType<typeof doIntervalsOverlapFunction>;
    getIntervalIntersection(
        params: WithConfig<GetIntervalIntersectionParams, Config>,
    ): ReturnType<typeof getIntervalIntersectionFunction>;
    isValidInterval: typeof isValidIntervalFunction;
    isTimeOfDayInRange(
        params: WithConfig<IsTimeOfDayInRangeParams, Config>,
    ): ReturnType<typeof isTimeOfDayInRangeFunction>;
    isWithinInterval(
        params: WithConfig<IsWithinIntervalParams, Config>,
    ): ReturnType<typeof isWithinIntervalFunction>;
    listDatesInInterval(
        params: WithConfig<ListDatesInIntervalParams, Config>,
    ): ReturnType<typeof listDatesInIntervalFunction>;
    matchesDatePattern(
        params: WithConfig<MatchesDatePatternParams, Config>,
    ): ReturnType<typeof matchesDatePatternFunction>;
    mergeIntervals(
        params: WithConfig<MergeIntervalsParams, Config>,
    ): ReturnType<typeof mergeIntervalsFunction>;
    splitInterval(
        params: WithConfig<SplitIntervalParams, Config>,
    ): ReturnType<typeof splitIntervalFunction>;
    subtractIntervals(
        params: WithConfig<SubtractIntervalsParams, Config>,
    ): ReturnType<typeof subtractIntervalsFunction>;
    endOfUnit(
        params: WithConfig<EndOfUnitParams, Config>,
    ): ReturnType<typeof endOfUnitFunction>;
    findAvailableSlots(
        params: WithConfig<FindAvailableSlotsParams, Config>,
    ): ReturnType<typeof findAvailableSlotsFunction>;
    findClosestDate(
        params: WithConfig<FindClosestDateParams, Config>,
    ): ReturnType<typeof findClosestDateFunction>;
    findClosestDateIndex(
        params: WithConfig<FindClosestDateIndexParams, Config>,
    ): ReturnType<typeof findClosestDateIndexFunction>;
    getDateParts(
        params: WithConfig<GetDatePartsParams, Config>,
    ): ReturnType<typeof getDatePartsFunction>;
    getEasterSunday(
        params: WithConfig<GetEasterSundayParams, Config>,
    ): ReturnType<typeof getEasterSundayFunction>;
    getHoliday(
        params: WithConfig<GetHolidayParams, Config>,
    ): ReturnType<typeof getHolidayFunction>;
    getHolidaysInYear(
        params: WithConfig<GetHolidaysInYearParams, Config>,
    ): ReturnType<typeof getHolidaysInYearFunction>;
    getObservedDate(
        params: WithConfig<GetObservedDateParams, Config>,
    ): ReturnType<typeof getObservedDateFunction>;
    getDaysInMonth(
        params: WithConfig<GetDaysInMonthParams, Config>,
    ): ReturnType<typeof getDaysInMonthFunction>;
    getDaysInYear: typeof getDaysInYearFunction;
    getEarliestDate(
        params: WithConfig<GetEarliestDateParams, Config>,
    ): ReturnType<typeof getEarliestDateFunction>;
    getLatestDate(
        params: WithConfig<GetLatestDateParams, Config>,
    ): ReturnType<typeof getLatestDateFunction>;
    getLocalTimeZone: typeof getLocalTimeZoneFunction;
    getNextBusinessDay(
        params: WithConfig<GetNextBusinessDayParams, Config>,
    ): ReturnType<typeof getNextBusinessDayFunction>;
    getNextBusinessHoursStart(
        params: WithConfig<GetNextBusinessHoursStartParams, Config>,
    ): ReturnType<typeof getNextBusinessHoursStartFunction>;
    getPreviousBusinessDay(
        params: WithConfig<GetPreviousBusinessDayParams, Config>,
    ): ReturnType<typeof getPreviousBusinessDayFunction>;
    getNextClosingTime(
        params: WithConfig<GetNextClosingTimeParams, Config>,
    ): ReturnType<typeof getNextClosingTimeFunction>;
    getNextOpeningTime(
        params: WithConfig<GetNextOpeningTimeParams, Config>,
    ): ReturnType<typeof getNextOpeningTimeFunction>;
    getNextTimeZoneTransition(
        params: WithConfig<GetNextTimeZoneTransitionParams, Config>,
    ): ReturnType<typeof getNextTimeZoneTransitionFunction>;
    getPreviousTimeZoneTransition(
        params: WithConfig<GetPreviousTimeZoneTransitionParams, Config>,
    ): ReturnType<typeof getPreviousTimeZoneTransitionFunction>;
    getTimeZoneTransitions(
        params: WithConfig<GetTimeZoneTransitionsParams, Config>,
    ): ReturnType<typeof getTimeZoneTransitionsFunction>;
    getWallTimeStatus(
        params: WithConfig<GetWallTimeStatusParams, Config>,
    ): ReturnType<typeof getWallTimeStatusFunction>;
    getNextWeekday: typeof getNextWeekdayFunction;
    getNthWeekdayOfMonth(
        params: WithConfig<GetNthWeekdayOfMonthParams, Config>,
    ): ReturnType<typeof getNthWeekdayOfMonthFunction>;
    getPreviousWeekday: typeof getPreviousWeekdayFunction;
    getTimeZoneDifference(
        params: WithConfig<GetTimeZoneDifferenceParams, Config>,
    ): ReturnType<typeof getTimeZoneDifferenceFunction>;
    getUTCOffset(
        params: WithConfig<GetUTCOffsetParams, Config>,
    ): ReturnType<typeof getUTCOffsetFunction>;
    isAfter(
        params: WithConfig<IsAfterParams, Config>,
    ): ReturnType<typeof isAfterFunction>;
    isBusinessDay(
        params: WithConfig<IsBusinessDayParams, Config>,
    ): ReturnType<typeof isBusinessDayFunction>;
    isWithinBusinessHours(
        params: WithConfig<IsWithinBusinessHoursParams, Config>,
    ): ReturnType<typeof isWithinBusinessHoursFunction>;
    listBusinessDaysInInterval(
        params: WithConfig<ListBusinessDaysInIntervalParams, Config>,
    ): ReturnType<typeof listBusinessDaysInIntervalFunction>;
    isBefore(
        params: WithConfig<IsBeforeParams, Config>,
    ): ReturnType<typeof isBeforeFunction>;
    isBetween(
        params: WithConfig<IsBetweenParams, Config>,
    ): ReturnType<typeof isBetweenFunction>;
    isDate: typeof isDateFunction;
    isDaylightSavingTime(
        params: WithConfig<IsDaylightSavingTimeParams, Config>,
    ): ReturnType<typeof isDaylightSavingTimeFunction>;
    isHoliday(date: DateInput): boolean;
    isHoliday(
        params: WithConfig<IsHolidayParams, Config> & { includeName: true },
    ): HolidayCheck;
    isHoliday(
        params: WithConfig<IsHolidayParams, Config> & { includeName?: false },
    ): boolean;
    isLeapYear: typeof isLeapYearFunction;
    isOpenAt(
        params: WithConfig<IsOpenAtParams, Config>,
    ): ReturnType<typeof isOpenAtFunction>;
    isSameInstant(
        params: WithConfig<IsSameInstantParams, Config>,
    ): ReturnType<typeof isSameInstantFunction>;
    isSameUnit(
        params: WithConfig<IsSameUnitParams, Config>,
    ): ReturnType<typeof isSameUnitFunction>;
    isValidDate: typeof isValidDateFunction;
    isValidTimeZone: typeof isValidTimeZoneFunction;
    removeDuplicateDates(
        params: WithConfig<RemoveDuplicateDatesParams, Config>,
    ): ReturnType<typeof removeDuplicateDatesFunction>;
    roundDuration(
        params: WithConfig<RoundDurationParams, Config>,
    ): ReturnType<typeof roundDurationFunction>;
    roundToUnit(
        params: WithConfig<RoundToUnitParams, Config>,
    ): ReturnType<typeof roundToUnitFunction>;
    setDateParts(
        params: WithConfig<SetDatePartsParams, Config>,
    ): ReturnType<typeof setDatePartsFunction>;
    sortDates(
        params: WithConfig<SortDatesParams, Config>,
    ): ReturnType<typeof sortDatesFunction>;
    startOfUnit(
        params: WithConfig<StartOfUnitParams, Config>,
    ): ReturnType<typeof startOfUnitFunction>;
    subtractDuration(
        params: WithConfig<SubtractDurationParams, Config>,
    ): ReturnType<typeof subtractDurationFunction>;
    toDate(
        params: WithConfig<ToDateParams, Config>,
    ): ReturnType<typeof toDateFunction>;
    differenceInUnit(
        params: WithConfig<DifferenceInUnitParams, Config>,
    ): ReturnType<typeof differenceInUnitFunction>;
    durationToMilliseconds(
        params: WithConfig<DurationToMillisecondsParams, Config>,
    ): ReturnType<typeof durationToMillisecondsFunction>;
    differenceInCalendarUnit(
        params: WithConfig<DifferenceInCalendarUnitParams, Config>,
    ): ReturnType<typeof differenceInCalendarUnitFunction>;
    differenceAsDuration(
        params: WithConfig<DifferenceAsDurationParams, Config>,
    ): ReturnType<typeof differenceAsDurationFunction>;
    getAge(
        params: WithConfig<GetAgeParams, Config>,
    ): ReturnType<typeof getAgeFunction>;
    getAgeAsDuration: typeof getAgeAsDurationFunction;
    getNextAnniversary(
        params: WithConfig<GetNextAnniversaryParams, Config>,
    ): ReturnType<typeof getNextAnniversaryFunction>;
    getCountdownParts(
        params: WithConfig<GetCountdownPartsParams, Config>,
    ): ReturnType<typeof getCountdownPartsFunction>;
    isToday(
        params: WithConfig<IsTodayParams, Config>,
    ): ReturnType<typeof isTodayFunction>;
    isTomorrow(
        params: WithConfig<IsTomorrowParams, Config>,
    ): ReturnType<typeof isTomorrowFunction>;
    isYesterday(
        params: WithConfig<IsYesterdayParams, Config>,
    ): ReturnType<typeof isYesterdayFunction>;
    isPast(
        params: WithConfig<IsPastParams, Config>,
    ): ReturnType<typeof isPastFunction>;
    isFuture(
        params: WithConfig<IsFutureParams, Config>,
    ): ReturnType<typeof isFutureFunction>;
    isWeekend(
        params: WithConfig<IsWeekendParams, Config>,
    ): ReturnType<typeof isWeekendFunction>;
    isWithinNext(
        params: WithConfig<IsWithinNextParams, Config>,
    ): ReturnType<typeof isWithinNextFunction>;
    isWithinLast(
        params: WithConfig<IsWithinLastParams, Config>,
    ): ReturnType<typeof isWithinLastFunction>;
    getMillisecondsUntilNextUnit(
        params: WithConfig<GetMillisecondsUntilNextUnitParams, Config>,
    ): ReturnType<typeof getMillisecondsUntilNextUnitFunction>;
    getDayOfYear(
        params: WithConfig<GetDayOfYearParams, Config>,
    ): ReturnType<typeof getDayOfYearFunction>;
    getISOWeek(
        params: WithConfig<GetISOWeekParams, Config>,
    ): ReturnType<typeof getISOWeekFunction>;
    getISOWeekYear(
        params: WithConfig<GetISOWeekYearParams, Config>,
    ): ReturnType<typeof getISOWeekYearFunction>;
    getISOWeeksInYear: typeof getISOWeeksInYearFunction;
    getWeekOfYear(
        params: WithConfig<GetWeekOfYearParams, Config>,
    ): ReturnType<typeof getWeekOfYearFunction>;
    getWeekOfMonth(
        params: WithConfig<GetWeekOfMonthParams, Config>,
    ): ReturnType<typeof getWeekOfMonthFunction>;
    getWeekdayNames: typeof getWeekdayNamesFunction;
    getQuarter(
        params: WithConfig<GetQuarterParams, Config>,
    ): ReturnType<typeof getQuarterFunction>;
    getSeason(
        params: WithConfig<GetSeasonParams, Config>,
    ): ReturnType<typeof getSeasonFunction>;
    getTimeOfDay(
        params: WithConfig<GetTimeOfDayParams, Config>,
    ): ReturnType<typeof getTimeOfDayFunction>;
    listTimeZones: typeof listTimeZonesFunction;
    millisecondsToDuration(
        params: WithConfig<MillisecondsToDurationParams, Config>,
    ): ReturnType<typeof millisecondsToDurationFunction>;
    negateDuration: typeof negateDurationFunction;
    normalizeDuration(
        params: WithConfig<NormalizeDurationParams, Config>,
    ): ReturnType<typeof normalizeDurationFunction>;
    parseLocaleDate(
        params: WithConfig<ParseLocaleDateParams, Config>,
    ): ReturnType<typeof parseLocaleDateFunction>;
    parseTimeOfDay: typeof parseTimeOfDayFunction;
    parseUTCOffset: typeof parseUTCOffsetFunction;
    getFiscalYear: typeof getFiscalYearFunction;
    getFiscalQuarter: typeof getFiscalQuarterFunction;
    getFiscalYearInterval: typeof getFiscalYearIntervalFunction;
    getLocaleDatePattern(
        params: WithConfig<GetLocaleDatePatternParams, Config>,
    ): ReturnType<typeof getLocaleDatePatternFunction>;
    getLocaleHourCycle: typeof getLocaleHourCycleFunction;
    getLocaleWeekInfo: typeof getLocaleWeekInfoFunction;
    getMonthNames: typeof getMonthNamesFunction;
    createMonthCalendarGrid(
        params: WithConfig<CreateMonthCalendarGridParams, Config>,
    ): ReturnType<typeof createMonthCalendarGridFunction>;
    formatISODate(
        params: WithConfig<FormatISODateParams, Config>,
    ): ReturnType<typeof formatISODateFunction>;
    formatISODateTime(
        params: WithConfig<FormatISODateTimeParams, Config>,
    ): ReturnType<typeof formatISODateTimeFunction>;
    fromJulianDate: typeof fromJulianDateFunction;
    fromUnixSeconds: typeof fromUnixSecondsFunction;
    parseDateWithPattern(
        params: WithConfig<ParseDateWithPatternParams, Config>,
    ): ReturnType<typeof parseDateWithPatternFunction>;
    parseISODate(
        params: WithConfig<ParseISODateParams, Config>,
    ): ReturnType<typeof parseISODateFunction>;
    parseISODateTime(
        params: WithConfig<ParseISODateTimeParams, Config>,
    ): ReturnType<typeof parseISODateTimeFunction>;
    reviveISODateTimes: typeof reviveISODateTimesFunction;
    toJulianDate: typeof toJulianDateFunction;
    toTemporalInstant: typeof toTemporalInstantFunction;
    toUnixSeconds: typeof toUnixSecondsFunction;
    formatDate(
        params: FormatDateCall<Config>,
    ): ReturnType<typeof formatDateFunction>;
    formatDateRange(
        params: WithConfig<FormatDateRangeParams, Config>,
    ): ReturnType<typeof formatDateRangeFunction>;
    formatTimeOfDay(
        params: WithConfig<FormatTimeOfDayParams, Config>,
    ): ReturnType<typeof formatTimeOfDayFunction>;
    formatTimeZoneName(
        params: WithConfig<FormatTimeZoneNameParams, Config>,
    ): ReturnType<typeof formatTimeZoneNameFunction>;
    formatDateWithStyle(
        params: WithConfig<FormatDateWithStyleParams, Config>,
    ): ReturnType<typeof formatDateWithStyleFunction>;
    formatUTCOffset(
        params: WithConfig<FormatUTCOffsetParams, Config>,
    ): ReturnType<typeof formatUTCOffsetFunction>;
    formatRelativeCalendarDay(
        params: WithConfig<FormatRelativeCalendarDayParams, Config>,
    ): ReturnType<typeof formatRelativeCalendarDayFunction>;
    formatRelativeTime(
        params: WithConfig<FormatRelativeTimeParams, Config>,
    ): ReturnType<typeof formatRelativeTimeFunction>;
    getRelativeTimeParts(
        params: WithConfig<GetRelativeTimePartsParams, Config>,
    ): ReturnType<typeof getRelativeTimePartsFunction>;
    formatDuration(
        params: WithConfig<FormatDurationParams, Config>,
    ): ReturnType<typeof formatDurationFunction>;
    formatDurationAsClock(
        params: WithConfig<FormatDurationAsClockParams, Config>,
    ): ReturnType<typeof formatDurationAsClockFunction>;
    formatDurationCompact(
        params: WithConfig<FormatDurationCompactParams, Config>,
    ): ReturnType<typeof formatDurationCompactFunction>;
    formatISODuration: typeof formatISODurationFunction;
    isValidDuration: typeof isValidDurationFunction;
    parseDurationText: typeof parseDurationTextFunction;
    parseISODuration: typeof parseISODurationFunction;
    formatHTTPDate: typeof formatHTTPDateFunction;
    parseHTTPDate: typeof parseHTTPDateFunction;
    toExcelSerialDate(
        params: WithConfig<ToExcelSerialDateParams, Config>,
    ): ReturnType<typeof toExcelSerialDateFunction>;
    fromExcelSerialDate(
        params: WithConfig<FromExcelSerialDateParams, Config>,
    ): ReturnType<typeof fromExcelSerialDateFunction>;
    fromTemporal: typeof fromTemporalFunction;
    formatRFC2822Date(
        params: WithConfig<FormatRFC2822DateParams, Config>,
    ): ReturnType<typeof formatRFC2822DateFunction>;
    parseRFC2822Date: typeof parseRFC2822DateFunction;
}

/**
 * Builds a date-time toolkit with defaults bound in.
 *
 * The returned object has no shared mutable state. Two instances can use
 * different zones, calendars, and clocks at the same time. The config is
 * checked once and then frozen. Standalone functions keep the built-in
 * defaults: Monday week start, the system time zone, an empty holiday
 * list, and Monday through Friday business days.
 *
 * @param config - Defaults for every call. Omit it to keep the built-in defaults.
 * @returns The root functions with those defaults applied.
 * @throws {@link TypeError} When a config field has the wrong type.
 * @throws {@link RangeError} When a zone, locale, weekday, or other setting is unusable.
 * @example
 * const dateTime = createDateTime({
 *   weekStartsOn: 7,
 *   timeZone: "Asia/Kolkata",
 * });
 */
export function createDateTime<
    const Config extends DateTimeConfig = DateTimeConfig,
>(config?: Config): DateTimeInstance<Config> {
    const frozen = freezeDateTimeConfig(config);
    return {
        addBusinessDays(params) {
            return addBusinessDaysFunction(
                applyDateTimeConfig(frozen, params) as Parameters<
                    typeof addBusinessDaysFunction
                >[0],
            );
        },
        addBusinessHours(params) {
            return addBusinessHoursFunction(
                applyDateTimeConfig(frozen, params) as Parameters<
                    typeof addBusinessHoursFunction
                >[0],
            );
        },
        addDurations(params) {
            return addDurationsFunction(
                applyDateTimeConfig(frozen, params) as Parameters<
                    typeof addDurationsFunction
                >[0],
            );
        },
        addToTimeOfDay(params) {
            return addToTimeOfDayFunction(
                applyDateTimeConfig(frozen, params) as Parameters<
                    typeof addToTimeOfDayFunction
                >[0],
            );
        },
        addDuration(params) {
            return addDurationFunction(
                applyDateTimeConfig(frozen, params) as Parameters<
                    typeof addDurationFunction
                >[0],
            );
        },
        clampDate(params) {
            return clampDateFunction(
                applyDateTimeConfig(frozen, params) as Parameters<
                    typeof clampDateFunction
                >[0],
            );
        },
        differenceInBusinessDays(params) {
            return differenceInBusinessDaysFunction(
                applyDateTimeConfig(frozen, params) as Parameters<
                    typeof differenceInBusinessDaysFunction
                >[0],
            );
        },
        differenceInBusinessHours(params) {
            return differenceInBusinessHoursFunction(
                applyDateTimeConfig(frozen, params) as Parameters<
                    typeof differenceInBusinessHoursFunction
                >[0],
            );
        },
        changeTimeZoneKeepingWallTime(params) {
            return changeTimeZoneKeepingWallTimeFunction(
                applyDateTimeConfig(frozen, params) as Parameters<
                    typeof changeTimeZoneKeepingWallTimeFunction
                >[0],
            );
        },
        compareDates(params) {
            return compareDatesFunction(
                applyDateTimeConfig(frozen, params) as Parameters<
                    typeof compareDatesFunction
                >[0],
            );
        },
        compareDurations(params) {
            return compareDurationsFunction(
                applyDateTimeConfig(frozen, params) as Parameters<
                    typeof compareDurationsFunction
                >[0],
            );
        },
        compareTimesOfDay(params) {
            return compareTimesOfDayFunction(
                applyDateTimeConfig(frozen, params) as Parameters<
                    typeof compareTimesOfDayFunction
                >[0],
            );
        },
        createDate(params) {
            return createDateFunction(
                applyDateTimeConfig(frozen, params) as Parameters<
                    typeof createDateFunction
                >[0],
            );
        },
        createHolidayPredicate(params) {
            return createHolidayPredicateFunction(
                applyDateTimeConfig(frozen, params) as Parameters<
                    typeof createHolidayPredicateFunction
                >[0],
            );
        },
        createInterval(params) {
            return createIntervalFunction(
                applyDateTimeConfig(frozen, params) as Parameters<
                    typeof createIntervalFunction
                >[0],
            );
        },
        divideInterval(params) {
            return divideIntervalFunction(
                applyDateTimeConfig(frozen, params) as Parameters<
                    typeof divideIntervalFunction
                >[0],
            );
        },
        getIntervalDuration(params) {
            return getIntervalDurationFunction(
                applyDateTimeConfig(frozen, params) as Parameters<
                    typeof getIntervalDurationFunction
                >[0],
            );
        },
        getIntervalGaps(params) {
            return getIntervalGapsFunction(
                applyDateTimeConfig(frozen, params) as Parameters<
                    typeof getIntervalGapsFunction
                >[0],
            );
        },
        doIntervalsOverlap(params) {
            return doIntervalsOverlapFunction(
                applyDateTimeConfig(frozen, params) as Parameters<
                    typeof doIntervalsOverlapFunction
                >[0],
            );
        },
        getIntervalIntersection(params) {
            return getIntervalIntersectionFunction(
                applyDateTimeConfig(frozen, params) as Parameters<
                    typeof getIntervalIntersectionFunction
                >[0],
            );
        },
        isValidInterval: isValidIntervalFunction,
        isTimeOfDayInRange(params) {
            return isTimeOfDayInRangeFunction(
                applyDateTimeConfig(frozen, params) as Parameters<
                    typeof isTimeOfDayInRangeFunction
                >[0],
            );
        },
        isWithinInterval(params) {
            return isWithinIntervalFunction(
                applyDateTimeConfig(frozen, params) as Parameters<
                    typeof isWithinIntervalFunction
                >[0],
            );
        },
        listDatesInInterval(params) {
            return listDatesInIntervalFunction(
                applyDateTimeConfig(frozen, params) as Parameters<
                    typeof listDatesInIntervalFunction
                >[0],
            );
        },
        matchesDatePattern(params) {
            return matchesDatePatternFunction(
                applyDateTimeConfig(frozen, params) as Parameters<
                    typeof matchesDatePatternFunction
                >[0],
            );
        },
        mergeIntervals(params) {
            return mergeIntervalsFunction(
                applyDateTimeConfig(frozen, params) as Parameters<
                    typeof mergeIntervalsFunction
                >[0],
            );
        },
        splitInterval(params) {
            return splitIntervalFunction(
                applyDateTimeConfig(frozen, params) as Parameters<
                    typeof splitIntervalFunction
                >[0],
            );
        },
        subtractIntervals(params) {
            return subtractIntervalsFunction(
                applyDateTimeConfig(frozen, params) as Parameters<
                    typeof subtractIntervalsFunction
                >[0],
            );
        },
        endOfUnit(params) {
            return endOfUnitFunction(
                applyDateTimeConfig(frozen, params) as Parameters<
                    typeof endOfUnitFunction
                >[0],
            );
        },
        findAvailableSlots(params) {
            return findAvailableSlotsFunction(
                applyDateTimeConfig(frozen, params) as Parameters<
                    typeof findAvailableSlotsFunction
                >[0],
            );
        },
        findClosestDate(params) {
            return findClosestDateFunction(
                applyDateTimeConfig(frozen, params) as Parameters<
                    typeof findClosestDateFunction
                >[0],
            );
        },
        findClosestDateIndex(params) {
            return findClosestDateIndexFunction(
                applyDateTimeConfig(frozen, params) as Parameters<
                    typeof findClosestDateIndexFunction
                >[0],
            );
        },
        getDateParts(params) {
            return getDatePartsFunction(
                applyDateTimeConfig(frozen, params) as Parameters<
                    typeof getDatePartsFunction
                >[0],
            );
        },
        getEasterSunday(params) {
            return getEasterSundayFunction(
                applyDateTimeConfig(frozen, params) as Parameters<
                    typeof getEasterSundayFunction
                >[0],
            );
        },
        getHoliday(params) {
            return getHolidayFunction(
                applyDateTimeConfig(frozen, params) as Parameters<
                    typeof getHolidayFunction
                >[0],
            );
        },
        getHolidaysInYear(params) {
            return getHolidaysInYearFunction(
                applyDateTimeConfig(frozen, params) as Parameters<
                    typeof getHolidaysInYearFunction
                >[0],
            );
        },
        getObservedDate(params) {
            return getObservedDateFunction(
                applyDateTimeConfig(frozen, params) as Parameters<
                    typeof getObservedDateFunction
                >[0],
            );
        },
        getDaysInMonth(params) {
            return getDaysInMonthFunction(
                applyDateTimeConfig(frozen, params) as Parameters<
                    typeof getDaysInMonthFunction
                >[0],
            );
        },
        getDaysInYear: getDaysInYearFunction,
        getEarliestDate(params) {
            return getEarliestDateFunction(
                applyDateTimeConfig(frozen, params) as Parameters<
                    typeof getEarliestDateFunction
                >[0],
            );
        },
        getLatestDate(params) {
            return getLatestDateFunction(
                applyDateTimeConfig(frozen, params) as Parameters<
                    typeof getLatestDateFunction
                >[0],
            );
        },
        getLocalTimeZone: getLocalTimeZoneFunction,
        getNextBusinessDay(params) {
            return getNextBusinessDayFunction(
                applyDateTimeConfig(frozen, params) as Parameters<
                    typeof getNextBusinessDayFunction
                >[0],
            );
        },
        getNextBusinessHoursStart(params) {
            return getNextBusinessHoursStartFunction(
                applyDateTimeConfig(frozen, params) as Parameters<
                    typeof getNextBusinessHoursStartFunction
                >[0],
            );
        },
        getPreviousBusinessDay(params) {
            return getPreviousBusinessDayFunction(
                applyDateTimeConfig(frozen, params) as Parameters<
                    typeof getPreviousBusinessDayFunction
                >[0],
            );
        },
        getNextClosingTime(params) {
            return getNextClosingTimeFunction(
                applyDateTimeConfig(frozen, params) as Parameters<
                    typeof getNextClosingTimeFunction
                >[0],
            );
        },
        getNextOpeningTime(params) {
            return getNextOpeningTimeFunction(
                applyDateTimeConfig(frozen, params) as Parameters<
                    typeof getNextOpeningTimeFunction
                >[0],
            );
        },
        getNextTimeZoneTransition(params) {
            return getNextTimeZoneTransitionFunction(
                applyDateTimeConfig(frozen, params) as Parameters<
                    typeof getNextTimeZoneTransitionFunction
                >[0],
            );
        },
        getPreviousTimeZoneTransition(params) {
            return getPreviousTimeZoneTransitionFunction(
                applyDateTimeConfig(frozen, params) as Parameters<
                    typeof getPreviousTimeZoneTransitionFunction
                >[0],
            );
        },
        getTimeZoneTransitions(params) {
            return getTimeZoneTransitionsFunction(
                applyDateTimeConfig(frozen, params) as Parameters<
                    typeof getTimeZoneTransitionsFunction
                >[0],
            );
        },
        getWallTimeStatus(params) {
            return getWallTimeStatusFunction(
                applyDateTimeConfig(frozen, params) as Parameters<
                    typeof getWallTimeStatusFunction
                >[0],
            );
        },
        getNextWeekday: getNextWeekdayFunction,
        getNthWeekdayOfMonth(params) {
            return getNthWeekdayOfMonthFunction(
                applyDateTimeConfig(frozen, params) as Parameters<
                    typeof getNthWeekdayOfMonthFunction
                >[0],
            );
        },
        getPreviousWeekday: getPreviousWeekdayFunction,
        getTimeZoneDifference(params) {
            return getTimeZoneDifferenceFunction(
                applyDateTimeConfig(frozen, params) as Parameters<
                    typeof getTimeZoneDifferenceFunction
                >[0],
            );
        },
        getUTCOffset(params) {
            return getUTCOffsetFunction(
                applyDateTimeConfig(frozen, params) as Parameters<
                    typeof getUTCOffsetFunction
                >[0],
            );
        },
        isAfter(params) {
            return isAfterFunction(
                applyDateTimeConfig(frozen, params) as Parameters<
                    typeof isAfterFunction
                >[0],
            );
        },
        isBusinessDay(params) {
            return isBusinessDayFunction(
                applyDateTimeConfig(frozen, params) as Parameters<
                    typeof isBusinessDayFunction
                >[0],
            );
        },
        isWithinBusinessHours(params) {
            return isWithinBusinessHoursFunction(
                applyDateTimeConfig(frozen, params) as Parameters<
                    typeof isWithinBusinessHoursFunction
                >[0],
            );
        },
        listBusinessDaysInInterval(params) {
            return listBusinessDaysInIntervalFunction(
                applyDateTimeConfig(frozen, params) as Parameters<
                    typeof listBusinessDaysInIntervalFunction
                >[0],
            );
        },
        isBefore(params) {
            return isBeforeFunction(
                applyDateTimeConfig(frozen, params) as Parameters<
                    typeof isBeforeFunction
                >[0],
            );
        },
        isBetween(params) {
            return isBetweenFunction(
                applyDateTimeConfig(frozen, params) as Parameters<
                    typeof isBetweenFunction
                >[0],
            );
        },
        isDate: isDateFunction,
        isDaylightSavingTime(params) {
            return isDaylightSavingTimeFunction(
                applyDateTimeConfig(frozen, params) as Parameters<
                    typeof isDaylightSavingTimeFunction
                >[0],
            );
        },
        isHoliday: ((
            dateOrParams:
                | DateInput
                | WithConfig<IsHolidayParams, Config>
                | (WithConfig<IsHolidayParams, Config> & { includeName: true }),
        ) => {
            if (
                typeof dateOrParams === "object" &&
                dateOrParams !== null &&
                !(dateOrParams instanceof Date) &&
                "date" in dateOrParams
            ) {
                return isHolidayFunction(
                    applyDateTimeConfig(frozen, dateOrParams) as Parameters<
                        typeof isHolidayFunction
                    >[0],
                );
            }
            return isHolidayFunction(
                applyDateTimeConfig(frozen, {
                    date: dateOrParams,
                }) as Parameters<typeof isHolidayFunction>[0],
            );
        }) as DateTimeInstance<Config>["isHoliday"],
        isLeapYear: isLeapYearFunction,
        isOpenAt(params) {
            return isOpenAtFunction(
                applyDateTimeConfig(frozen, params) as Parameters<
                    typeof isOpenAtFunction
                >[0],
            );
        },
        isSameInstant(params) {
            return isSameInstantFunction(
                applyDateTimeConfig(frozen, params) as Parameters<
                    typeof isSameInstantFunction
                >[0],
            );
        },
        isSameUnit(params) {
            return isSameUnitFunction(
                applyDateTimeConfig(frozen, params) as Parameters<
                    typeof isSameUnitFunction
                >[0],
            );
        },
        isValidDate: isValidDateFunction,
        isValidTimeZone: isValidTimeZoneFunction,
        removeDuplicateDates(params) {
            return removeDuplicateDatesFunction(
                applyDateTimeConfig(frozen, params) as Parameters<
                    typeof removeDuplicateDatesFunction
                >[0],
            );
        },
        roundDuration(params) {
            return roundDurationFunction(
                applyDateTimeConfig(frozen, params) as Parameters<
                    typeof roundDurationFunction
                >[0],
            );
        },
        roundToUnit(params) {
            return roundToUnitFunction(
                applyDateTimeConfig(frozen, params) as Parameters<
                    typeof roundToUnitFunction
                >[0],
            );
        },
        setDateParts(params) {
            return setDatePartsFunction(
                applyDateTimeConfig(frozen, params) as Parameters<
                    typeof setDatePartsFunction
                >[0],
            );
        },
        sortDates(params) {
            return sortDatesFunction(
                applyDateTimeConfig(frozen, params) as Parameters<
                    typeof sortDatesFunction
                >[0],
            );
        },
        startOfUnit(params) {
            return startOfUnitFunction(
                applyDateTimeConfig(frozen, params) as Parameters<
                    typeof startOfUnitFunction
                >[0],
            );
        },
        subtractDuration(params) {
            return subtractDurationFunction(
                applyDateTimeConfig(frozen, params) as Parameters<
                    typeof subtractDurationFunction
                >[0],
            );
        },
        toDate(params) {
            return toDateFunction(
                applyDateTimeConfig(frozen, params) as Parameters<
                    typeof toDateFunction
                >[0],
            );
        },
        differenceInUnit(params) {
            return differenceInUnitFunction(
                applyDateTimeConfig(frozen, params) as Parameters<
                    typeof differenceInUnitFunction
                >[0],
            );
        },
        durationToMilliseconds(params) {
            return durationToMillisecondsFunction(
                applyDateTimeConfig(frozen, params) as Parameters<
                    typeof durationToMillisecondsFunction
                >[0],
            );
        },
        differenceInCalendarUnit(params) {
            return differenceInCalendarUnitFunction(
                applyDateTimeConfig(frozen, params) as Parameters<
                    typeof differenceInCalendarUnitFunction
                >[0],
            );
        },
        differenceAsDuration(params) {
            return differenceAsDurationFunction(
                applyDateTimeConfig(frozen, params) as Parameters<
                    typeof differenceAsDurationFunction
                >[0],
            );
        },
        getAge(params) {
            return getAgeFunction(
                applyDateTimeConfig(frozen, params) as Parameters<
                    typeof getAgeFunction
                >[0],
            );
        },
        getAgeAsDuration: getAgeAsDurationFunction,
        getNextAnniversary(params) {
            return getNextAnniversaryFunction(
                applyDateTimeConfig(frozen, params) as Parameters<
                    typeof getNextAnniversaryFunction
                >[0],
            );
        },
        getCountdownParts(params) {
            return getCountdownPartsFunction(
                applyDateTimeConfig(frozen, params) as Parameters<
                    typeof getCountdownPartsFunction
                >[0],
            );
        },
        isToday(params) {
            return isTodayFunction(
                applyDateTimeConfig(frozen, params) as Parameters<
                    typeof isTodayFunction
                >[0],
            );
        },
        isTomorrow(params) {
            return isTomorrowFunction(
                applyDateTimeConfig(frozen, params) as Parameters<
                    typeof isTomorrowFunction
                >[0],
            );
        },
        isYesterday(params) {
            return isYesterdayFunction(
                applyDateTimeConfig(frozen, params) as Parameters<
                    typeof isYesterdayFunction
                >[0],
            );
        },
        isPast(params) {
            return isPastFunction(
                applyDateTimeConfig(frozen, params) as Parameters<
                    typeof isPastFunction
                >[0],
            );
        },
        isFuture(params) {
            return isFutureFunction(
                applyDateTimeConfig(frozen, params) as Parameters<
                    typeof isFutureFunction
                >[0],
            );
        },
        isWeekend(params) {
            return isWeekendFunction(
                applyDateTimeConfig(frozen, params) as Parameters<
                    typeof isWeekendFunction
                >[0],
            );
        },
        isWithinNext(params) {
            return isWithinNextFunction(
                applyDateTimeConfig(frozen, params) as Parameters<
                    typeof isWithinNextFunction
                >[0],
            );
        },
        isWithinLast(params) {
            return isWithinLastFunction(
                applyDateTimeConfig(frozen, params) as Parameters<
                    typeof isWithinLastFunction
                >[0],
            );
        },
        getMillisecondsUntilNextUnit(params) {
            return getMillisecondsUntilNextUnitFunction(
                applyDateTimeConfig(frozen, params) as Parameters<
                    typeof getMillisecondsUntilNextUnitFunction
                >[0],
            );
        },
        getDayOfYear(params) {
            return getDayOfYearFunction(
                applyDateTimeConfig(frozen, params) as Parameters<
                    typeof getDayOfYearFunction
                >[0],
            );
        },
        getISOWeek(params) {
            return getISOWeekFunction(
                applyDateTimeConfig(frozen, params) as Parameters<
                    typeof getISOWeekFunction
                >[0],
            );
        },
        getISOWeekYear(params) {
            return getISOWeekYearFunction(
                applyDateTimeConfig(frozen, params) as Parameters<
                    typeof getISOWeekYearFunction
                >[0],
            );
        },
        getISOWeeksInYear: getISOWeeksInYearFunction,
        getWeekOfYear(params) {
            return getWeekOfYearFunction(
                applyDateTimeConfig(frozen, params) as Parameters<
                    typeof getWeekOfYearFunction
                >[0],
            );
        },
        getWeekOfMonth(params) {
            return getWeekOfMonthFunction(
                applyDateTimeConfig(frozen, params) as Parameters<
                    typeof getWeekOfMonthFunction
                >[0],
            );
        },
        getWeekdayNames: getWeekdayNamesFunction,
        getQuarter(params) {
            return getQuarterFunction(
                applyDateTimeConfig(frozen, params) as Parameters<
                    typeof getQuarterFunction
                >[0],
            );
        },
        getSeason(params) {
            return getSeasonFunction(
                applyDateTimeConfig(frozen, params) as Parameters<
                    typeof getSeasonFunction
                >[0],
            );
        },
        getTimeOfDay(params) {
            return getTimeOfDayFunction(
                applyDateTimeConfig(frozen, params) as Parameters<
                    typeof getTimeOfDayFunction
                >[0],
            );
        },
        listTimeZones: listTimeZonesFunction,
        millisecondsToDuration(params) {
            return millisecondsToDurationFunction(
                applyDateTimeConfig(frozen, params) as Parameters<
                    typeof millisecondsToDurationFunction
                >[0],
            );
        },
        negateDuration: negateDurationFunction,
        normalizeDuration(params) {
            return normalizeDurationFunction(
                applyDateTimeConfig(frozen, params) as Parameters<
                    typeof normalizeDurationFunction
                >[0],
            );
        },
        parseLocaleDate(params) {
            return parseLocaleDateFunction(
                applyDateTimeConfig(frozen, params) as Parameters<
                    typeof parseLocaleDateFunction
                >[0],
            );
        },
        parseTimeOfDay: parseTimeOfDayFunction,
        parseUTCOffset: parseUTCOffsetFunction,
        getFiscalYear: getFiscalYearFunction,
        getFiscalQuarter: getFiscalQuarterFunction,
        getFiscalYearInterval: getFiscalYearIntervalFunction,
        getLocaleDatePattern(params) {
            return getLocaleDatePatternFunction(
                applyDateTimeConfig(frozen, params) as Parameters<
                    typeof getLocaleDatePatternFunction
                >[0],
            );
        },
        getLocaleHourCycle(locale) {
            const configured =
                typeof frozen.locale === "string" ? frozen.locale : undefined;
            return getLocaleHourCycleFunction(locale ?? configured);
        },
        getLocaleWeekInfo(locale) {
            const configured =
                typeof frozen.locale === "string" ? frozen.locale : undefined;
            return getLocaleWeekInfoFunction(locale ?? configured);
        },
        getMonthNames: getMonthNamesFunction,
        createMonthCalendarGrid(params) {
            return createMonthCalendarGridFunction(
                applyDateTimeConfig(frozen, params) as Parameters<
                    typeof createMonthCalendarGridFunction
                >[0],
            );
        },
        formatISODate(params) {
            return formatISODateFunction(
                applyDateTimeConfig(frozen, params) as Parameters<
                    typeof formatISODateFunction
                >[0],
            );
        },
        formatISODateTime(params) {
            return formatISODateTimeFunction(
                applyDateTimeConfig(frozen, params) as Parameters<
                    typeof formatISODateTimeFunction
                >[0],
            );
        },
        fromJulianDate: fromJulianDateFunction,
        fromUnixSeconds: fromUnixSecondsFunction,
        parseDateWithPattern(params) {
            return parseDateWithPatternFunction(
                applyDateTimeConfig(frozen, params) as Parameters<
                    typeof parseDateWithPatternFunction
                >[0],
            );
        },
        parseISODate(params) {
            return parseISODateFunction(
                applyDateTimeConfig(frozen, params) as Parameters<
                    typeof parseISODateFunction
                >[0],
            );
        },
        parseISODateTime(params) {
            return parseISODateTimeFunction(
                applyDateTimeConfig(frozen, params) as Parameters<
                    typeof parseISODateTimeFunction
                >[0],
            );
        },
        reviveISODateTimes: reviveISODateTimesFunction,
        toJulianDate: toJulianDateFunction,
        toTemporalInstant: toTemporalInstantFunction,
        toUnixSeconds: toUnixSecondsFunction,
        formatDate(params) {
            return formatDateFunction(
                applyDateTimeConfig(frozen, params, {
                    pattern: true,
                }) as Parameters<typeof formatDateFunction>[0],
            );
        },
        formatDateRange(params) {
            return formatDateRangeFunction(
                applyDateTimeConfig(frozen, params) as Parameters<
                    typeof formatDateRangeFunction
                >[0],
            );
        },
        formatTimeOfDay(params) {
            return formatTimeOfDayFunction(
                applyDateTimeConfig(frozen, params) as Parameters<
                    typeof formatTimeOfDayFunction
                >[0],
            );
        },
        formatTimeZoneName(params) {
            return formatTimeZoneNameFunction(
                applyDateTimeConfig(frozen, params) as Parameters<
                    typeof formatTimeZoneNameFunction
                >[0],
            );
        },
        formatDateWithStyle(params) {
            return formatDateWithStyleFunction(
                applyDateTimeConfig(frozen, params) as Parameters<
                    typeof formatDateWithStyleFunction
                >[0],
            );
        },
        formatUTCOffset(params) {
            return formatUTCOffsetFunction(
                applyDateTimeConfig(frozen, params) as Parameters<
                    typeof formatUTCOffsetFunction
                >[0],
            );
        },
        formatRelativeCalendarDay(params) {
            return formatRelativeCalendarDayFunction(
                applyDateTimeConfig(frozen, params, {
                    style: true,
                }) as Parameters<typeof formatRelativeCalendarDayFunction>[0],
            );
        },
        formatRelativeTime(params) {
            return formatRelativeTimeFunction(
                applyDateTimeConfig(frozen, params, {
                    style: true,
                }) as Parameters<typeof formatRelativeTimeFunction>[0],
            );
        },
        getRelativeTimeParts(params) {
            return getRelativeTimePartsFunction(
                applyDateTimeConfig(frozen, params, {
                    style: true,
                }) as Parameters<typeof getRelativeTimePartsFunction>[0],
            );
        },
        formatDuration(params) {
            return formatDurationFunction(
                applyDateTimeConfig(frozen, params) as Parameters<
                    typeof formatDurationFunction
                >[0],
            );
        },
        formatDurationAsClock(params) {
            return formatDurationAsClockFunction(
                applyDateTimeConfig(frozen, params) as Parameters<
                    typeof formatDurationAsClockFunction
                >[0],
            );
        },
        formatDurationCompact(params) {
            return formatDurationCompactFunction(
                applyDateTimeConfig(frozen, params) as Parameters<
                    typeof formatDurationCompactFunction
                >[0],
            );
        },
        formatISODuration: formatISODurationFunction,
        isValidDuration: isValidDurationFunction,
        parseDurationText: parseDurationTextFunction,
        parseISODuration: parseISODurationFunction,
        formatHTTPDate: formatHTTPDateFunction,
        parseHTTPDate: parseHTTPDateFunction,
        toExcelSerialDate(params) {
            return toExcelSerialDateFunction(
                applyDateTimeConfig(frozen, params) as Parameters<
                    typeof toExcelSerialDateFunction
                >[0],
            );
        },
        fromExcelSerialDate(params) {
            return fromExcelSerialDateFunction(
                applyDateTimeConfig(frozen, params) as Parameters<
                    typeof fromExcelSerialDateFunction
                >[0],
            );
        },
        fromTemporal: fromTemporalFunction,
        formatRFC2822Date(params) {
            return formatRFC2822DateFunction(
                applyDateTimeConfig(frozen, params) as Parameters<
                    typeof formatRFC2822DateFunction
                >[0],
            );
        },
        parseRFC2822Date: parseRFC2822DateFunction,
    };
}
