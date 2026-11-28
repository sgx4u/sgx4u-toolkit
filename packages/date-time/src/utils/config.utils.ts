import type { ConfiguredHoliday } from "../types/configured-holiday.types.js";
import type { DateTimeConfig } from "../types/date-time-config.types.js";
import type { DateInput } from "../types/date-input.types.js";
import type { Disambiguation, Overflow } from "../types/options.types.js";
import type { TimeRange, Weekday } from "../types/time.types.js";
import { assertIntegerInRange } from "./assert.utils.js";
import {
    assertBusinessHours,
    assertWorkingDays,
} from "./business-config.utils.js";
import { readDateInput } from "./date-input.utils.js";
import { isDateValue } from "./date-value.utils.js";
import { rangeError, typeError } from "./error.utils.js";
import { assertLocale } from "./locale.utils.js";
import {
    assertTimeZoneName,
    resolveDisambiguation,
    resolveWeekStartsOn,
} from "./time-zone.utils.js";

/**
 * A config object frozen at `createDateTime` time.
 *
 * Only fields the caller set are present. Built-in defaults stay inside
 * each function until a call or a later config supplies them.
 */
export interface FrozenDateTimeConfig {
    readonly timeZone?: string;
    readonly locale?: string | readonly string[];
    readonly weekStartsOn?: Weekday;
    readonly minimumDaysInFirstWeek?: number;
    readonly workingDays?: readonly Weekday[];
    readonly businessHours?: readonly TimeRange[];
    readonly disambiguation?: Disambiguation;
    readonly now?: () => Date;
    readonly holidays?: readonly ConfiguredHoliday[];
    readonly numeric?: "always" | "auto";
    readonly overflow?: Overflow;
    readonly formatPattern?: string;
    readonly fiscalYearStartMonth?: number;
    readonly fiscalYearLabel?: "start-year" | "end-year";
    readonly relativeTimeStyle?: "long" | "short" | "narrow";
}

/**
 * Copies and checks a config. The caller's object is not frozen or mutated.
 *
 * @param config - Defaults for one instance. Omit it for the built-in defaults.
 * @returns A frozen config.
 * @throws {@link TypeError} When a field has the wrong type.
 * @throws {@link RangeError} When a zone, locale, weekday, or other setting is unusable.
 */
export function freezeDateTimeConfig(
    config?: DateTimeConfig,
): FrozenDateTimeConfig {
    const source = config ?? {};
    const frozen: {
        -readonly [
            Key in keyof FrozenDateTimeConfig
        ]: FrozenDateTimeConfig[Key];
    } = {};
    if (source.timeZone !== undefined) {
        frozen.timeZone = assertTimeZoneName(source.timeZone);
    }
    if (source.locale !== undefined) {
        assertLocale(source.locale);
        frozen.locale = Object.freeze(
            typeof source.locale === "string"
                ? source.locale
                : [...source.locale],
        );
    }
    if (source.weekStartsOn !== undefined) {
        frozen.weekStartsOn = resolveWeekStartsOn(source.weekStartsOn);
    }
    if (source.minimumDaysInFirstWeek !== undefined) {
        frozen.minimumDaysInFirstWeek = assertIntegerInRange(
            source.minimumDaysInFirstWeek,
            "minimumDaysInFirstWeek",
            1,
            7,
        );
    }
    if (source.workingDays !== undefined) {
        frozen.workingDays = Object.freeze([
            ...assertWorkingDays(source.workingDays),
        ]);
    }
    if (source.businessHours !== undefined) {
        frozen.businessHours = Object.freeze(
            assertBusinessHours(source.businessHours).map((range) => ({
                ...range,
            })),
        );
    }
    if (source.disambiguation !== undefined) {
        frozen.disambiguation = resolveDisambiguation(source.disambiguation);
    }
    if (source.now !== undefined) {
        if (typeof source.now !== "function") {
            throw typeError(
                "now",
                "a function that returns the current date",
                source.now,
            );
        }
        frozen.now = source.now;
    }
    if (source.holidays !== undefined) {
        frozen.holidays = Object.freeze(
            assertHolidays(source.holidays, frozen.timeZone),
        );
    }
    if (source.numeric !== undefined) {
        frozen.numeric = assertEnum(source.numeric, "numeric", [
            "always",
            "auto",
        ] as const);
    }
    if (source.overflow !== undefined) {
        frozen.overflow = assertEnum(source.overflow, "overflow", [
            "constrain",
            "reject",
        ] as const);
    }
    if (source.formatPattern !== undefined) {
        if (typeof source.formatPattern !== "string") {
            throw typeError("formatPattern", "a string", source.formatPattern);
        }
        frozen.formatPattern = source.formatPattern;
    }
    if (source.fiscalYearStartMonth !== undefined) {
        frozen.fiscalYearStartMonth = assertIntegerInRange(
            source.fiscalYearStartMonth,
            "fiscalYearStartMonth",
            1,
            12,
        );
    }
    if (source.fiscalYearLabel !== undefined) {
        frozen.fiscalYearLabel = assertEnum(
            source.fiscalYearLabel,
            "fiscalYearLabel",
            ["start-year", "end-year"] as const,
        );
    }
    if (source.relativeTimeStyle !== undefined) {
        frozen.relativeTimeStyle = assertEnum(
            source.relativeTimeStyle,
            "relativeTimeStyle",
            ["long", "short", "narrow"] as const,
        );
    }
    return Object.freeze(frozen);
}

/**
 * Fills omitted call fields from a frozen config.
 *
 * A call field set to `undefined` does not erase the config value.
 * `now` from the config is read during this call. `formatPattern` and
 * `relativeTimeStyle` are applied only when `pattern` or `style` is requested.
 *
 * @param config - The instance defaults.
 * @param params - The fields this call passed.
 * @param extras - `pattern` and `style` gates for fields whose config names differ.
 * @returns The merged fields.
 */
export function applyDateTimeConfig<Params extends object>(
    config: FrozenDateTimeConfig,
    params: Params,
    extras?: { pattern?: boolean; style?: boolean },
): Params {
    const merged: Record<string, unknown> = {};
    copyDefined(merged, "timeZone", config.timeZone);
    copyDefined(merged, "locale", config.locale);
    copyDefined(merged, "weekStartsOn", config.weekStartsOn);
    copyDefined(
        merged,
        "minimumDaysInFirstWeek",
        config.minimumDaysInFirstWeek,
    );
    copyDefined(merged, "workingDays", config.workingDays);
    copyDefined(merged, "businessHours", config.businessHours);
    copyDefined(merged, "disambiguation", config.disambiguation);
    copyDefined(merged, "holidays", config.holidays);
    copyDefined(merged, "numeric", config.numeric);
    copyDefined(merged, "overflow", config.overflow);
    copyDefined(merged, "fiscalYearStartMonth", config.fiscalYearStartMonth);
    copyDefined(merged, "fiscalYearLabel", config.fiscalYearLabel);
    if (extras?.pattern === true) {
        copyDefined(merged, "pattern", config.formatPattern);
    }
    if (extras?.style === true) {
        copyDefined(merged, "style", config.relativeTimeStyle);
    }
    const paramsRecord = params as Record<string, unknown>;
    for (const key of Object.keys(paramsRecord)) {
        if (paramsRecord[key] !== undefined) {
            merged[key] = paramsRecord[key];
        }
    }
    if (paramsRecord.now === undefined && config.now !== undefined) {
        merged.now = config.now();
    }
    return merged as Params;
}

/**
 * @param target - The object being filled.
 * @param key - The field name.
 * @param value - The config value. `undefined` is skipped.
 */
function copyDefined(
    target: Record<string, unknown>,
    key: string,
    value: unknown,
): void {
    if (value !== undefined) {
        target[key] = value;
    }
}

/**
 * @param holidays - The caller's holiday list.
 * @param timeZone - Zone for a date-only string, when the config set one.
 * @returns A frozen copy.
 * @throws {@link TypeError} When an entry is not a date or `{ date, name? }`.
 * @throws {@link RangeError} When a holiday date is not a real date.
 */
function assertHolidays(
    holidays: readonly ConfiguredHoliday[],
    timeZone: string | undefined,
): ConfiguredHoliday[] {
    if (!Array.isArray(holidays)) {
        throw typeError("holidays", "an array of { date, name? }", holidays);
    }
    return holidays.map((holiday, index) => {
        const argumentName = `holidays[${String(index)}]`;
        const entry = normalizeHoliday(holiday, argumentName);
        if (readDateInput(entry.date, timeZone) === undefined) {
            throw rangeError(`${argumentName}.date`, "a real date", entry.date);
        }
        return entry;
    });
}

/**
 * @param holiday - One list entry.
 * @param argumentName - The parameter name used in an error.
 * @returns A `{ date, name? }` entry.
 * @throws {@link TypeError} When the entry is not a date or a holiday object.
 */
function normalizeHoliday(
    holiday: ConfiguredHoliday | DateInput,
    argumentName: string,
): ConfiguredHoliday {
    if (
        isDateValue(holiday) ||
        typeof holiday === "string" ||
        typeof holiday === "number"
    ) {
        return { date: holiday };
    }
    if (
        holiday === null ||
        typeof holiday !== "object" ||
        !("date" in holiday)
    ) {
        throw typeError(argumentName, "{ date, name? }", holiday);
    }
    const date = holiday.date;
    if (
        !isDateValue(date) &&
        typeof date !== "string" &&
        typeof date !== "number"
    ) {
        throw typeError(`${argumentName}.date`, "a date", date);
    }
    if (holiday.name !== undefined && typeof holiday.name !== "string") {
        throw typeError(`${argumentName}.name`, "a string", holiday.name);
    }
    if (holiday.name === undefined) {
        return { date };
    }
    return { date, name: holiday.name };
}

/**
 * @param value - The caller's enum value.
 * @param argumentName - The parameter name used in an error.
 * @param allowed - The accepted values.
 * @returns The value when it is one of `allowed`.
 * @throws {@link RangeError} When `value` is not one of `allowed`.
 */
function assertEnum<Value extends string>(
    value: unknown,
    argumentName: string,
    allowed: readonly Value[],
): Value {
    if (typeof value !== "string" || !allowed.includes(value as Value)) {
        throw rangeError(argumentName, allowed.join(" or "), value);
    }
    return value as Value;
}
