import type { StringUnit } from "../types/string-unit.types.js";
import type { TruncationLocation } from "../types/string-unit.types.js";
import {
    readEnum,
    readInteger,
    readOptionalString,
} from "./assertions.utils.js";
import { measureDisplayWidth } from "./display-width.utils.js";
import { readOptionsCall } from "./read-call.utils.js";
import { readUnit, splitIntoUnits } from "./units.utils.js";

/**
 * Repeats `padString` until it covers `count` units, then slices it.
 *
 * @param padString - The text to repeat. An empty string throws.
 * @param count - How many units to produce.
 * @param unit - The unit used to slice the pad.
 * @returns The pad text.
 * @throws {@link RangeError} When `padString` is empty.
 */
export function repeatPad(
    padString: string,
    count: number,
    unit: StringUnit,
): string {
    if (padString.length === 0) {
        throw new RangeError('padString must not be empty. Received "".');
    }
    if (count === 0) {
        return "";
    }
    const padUnits = splitIntoUnits(padString, unit);
    const produced: string[] = [];
    while (produced.length < count) {
        produced.push(...padUnits);
    }
    return produced.slice(0, count).join("");
}

/**
 * Pads `value` out to `maximumLength` units.
 *
 * @param value - The text.
 * @param maximumLength - The length to reach.
 * @param padString - The text to repeat.
 * @param align - Where the original text sits.
 * @param unit - The unit of `maximumLength`.
 * @returns `value` when it is already long enough, otherwise the padded string.
 */
export function padToLength(
    value: string,
    maximumLength: number,
    padString: string,
    align: "start" | "end" | "center",
    unit: StringUnit,
): string {
    const length = splitIntoUnits(value, unit).length;
    if (length >= maximumLength) {
        return value;
    }
    const deficit = maximumLength - length;
    if (align === "end") {
        return value + repeatPad(padString, deficit, unit);
    }
    if (align === "start") {
        return repeatPad(padString, deficit, unit) + value;
    }
    const startCount = Math.floor(deficit / 2);
    const padding = splitIntoUnits(repeatPad(padString, deficit, unit), unit);
    return (
        padding.slice(0, startCount).join("") +
        value +
        padding.slice(startCount).join("")
    );
}

/**
 * Reads the shared pad options.
 *
 * @param options - The call.
 * @param alignFallback - Used when `align` is omitted. Pass `undefined` when the function has no align option.
 * @returns The checked options and the string, or `undefined` when `value` is not a string.
 */
export function readPadCall(
    options: unknown,
    alignFallback: "start" | "end" | "center" | undefined,
):
    | {
          value: string;
          maximumLength: number;
          padString: string;
          align: "start" | "end" | "center";
          unit: StringUnit;
      }
    | undefined {
    const resolved = readOptionsCall(options, (record) => ({
        maximumLength: readInteger(
            "maximumLength",
            record.maximumLength,
            0,
            undefined,
        ),
        padString: readOptionalString("padString", record.padString) ?? " ",
        align:
            alignFallback === undefined
                ? "start"
                : readEnum(
                      "align",
                      record.align,
                      ["start", "end", "center"] as const,
                      alignFallback,
                  ),
        unit: readUnit(record.unit),
    }));
    if (resolved === undefined || typeof resolved.record.value !== "string") {
        return undefined;
    }
    return { value: resolved.record.value, ...resolved.options };
}

const locations = ["end", "start", "middle"] as const;

/**
 * Truncates unit arrays without cutting a unit.
 *
 * @param units - The units of the original string.
 * @param maximumLength - The maximum number of units in the result.
 * @param omission - The omission text, already split into the same unit.
 * @param location - Which side keeps the original text.
 * @returns The truncated units joined with the omission.
 */
export function truncateUnits(
    units: readonly string[],
    maximumLength: number,
    omission: readonly string[],
    location: TruncationLocation,
): string {
    if (units.length <= maximumLength) {
        return units.join("");
    }
    if (omission.length >= maximumLength) {
        return omission.slice(0, maximumLength).join("");
    }
    const contentLength = maximumLength - omission.length;
    if (location === "start") {
        return (
            omission.join("") +
            units.slice(units.length - contentLength).join("")
        );
    }
    if (location === "middle") {
        const headLength = Math.ceil(contentLength / 2);
        const tailLength = contentLength - headLength;
        return (
            units.slice(0, headLength).join("") +
            omission.join("") +
            units.slice(units.length - tailLength).join("")
        );
    }
    return units.slice(0, contentLength).join("") + omission.join("");
}

/**
 * Trims a truncated prefix back to the last separator.
 *
 * @param text - The kept prefix, without the omission.
 * @param separator - A literal string or a regular expression.
 * @returns The prefix up to and excluding the last separator, or `text` when there is none.
 */
export function trimToSeparator(
    text: string,
    separator: string | RegExp,
): string {
    if (typeof separator === "string") {
        const index = text.lastIndexOf(separator);
        return index === -1 ? text : text.slice(0, index);
    }
    const flags = separator.flags.includes("g")
        ? separator.flags
        : `${separator.flags}g`;
    const expression = new RegExp(separator.source, flags);
    let lastIndex = -1;
    for (const match of text.matchAll(expression)) {
        lastIndex = match.index;
    }
    return lastIndex === -1 ? text : text.slice(0, lastIndex);
}

/**
 * Truncates by display columns.
 *
 * @param value - The text.
 * @param maximumWidth - The column budget.
 * @param omission - The omission text.
 * @param location - Which side keeps the original text.
 * @returns The truncated string.
 */
/**
 * Takes graphemes from `graphemes` while the display width stays within `budget`.
 *
 * @param graphemes - Graphemes in the order they should be considered.
 * @param budget - The maximum column count.
 * @returns The graphemes that fit, in the same order.
 */
function graphemesThatFit(
    graphemes: readonly string[],
    budget: number,
): string[] {
    const fitting: string[] = [];
    for (const grapheme of graphemes) {
        const next = [...fitting, grapheme].join("");
        if (measureDisplayWidth(next, false) > budget) {
            break;
        }
        fitting.push(grapheme);
    }
    return fitting;
}

export function truncateByWidth(
    value: string,
    maximumWidth: number,
    omission: string,
    location: TruncationLocation,
): string {
    if (measureDisplayWidth(value, false) <= maximumWidth) {
        return value;
    }
    const omissionWidth = measureDisplayWidth(omission, false);
    if (omissionWidth >= maximumWidth) {
        return graphemesThatFit(
            splitIntoUnits(omission, "grapheme"),
            maximumWidth,
        ).join("");
    }
    const budget = maximumWidth - omissionWidth;
    const graphemes = splitIntoUnits(value, "grapheme");
    if (location === "start") {
        const tail = graphemesThatFit([...graphemes].reverse(), budget)
            .reverse()
            .join("");
        return omission + tail;
    }
    if (location === "middle") {
        const headBudget = Math.ceil(budget / 2);
        const head = graphemesThatFit(graphemes, headBudget);
        const tailBudget = budget - measureDisplayWidth(head.join(""), false);
        const tail = graphemesThatFit([...graphemes].reverse(), tailBudget)
            .reverse()
            .join("");
        return head.join("") + omission + tail;
    }
    return graphemesThatFit(graphemes, budget).join("") + omission;
}

export { locations };
