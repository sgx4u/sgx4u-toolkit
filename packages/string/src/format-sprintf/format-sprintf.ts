import { describeReceived } from "../utils/describe-received.utils.js";
import { isOptionsRecord } from "../utils/assertions.utils.js";
import type { FormatSprintfOptions } from "./format-sprintf.types.js";

const valueSpecifiers: ReadonlySet<string> = new Set(["s", "d", "i", "f", "j"]);

/**
 * One specifier read from a template.
 */
interface ParsedSpecifier {
    /** `"percent"` for `%%`. `"value"` for a conversion. */
    kind: "percent" | "value";
    /** The conversion letter. Absent for `%%`. */
    specifier?: string;
    /** Zero-based argument index for a numbered specifier such as `%1$s`. */
    argumentIndex?: number;
    /** Index just after the specifier. */
    end: number;
}

/**
 * Formats a template with a small, safe `sprintf` subset.
 *
 * `%%` writes `%`. `%s` uses `String`. `%d` and `%i` write an integer
 * truncated toward zero. `%f` writes `Number`. `%j` writes
 * `JSON.stringify`, or the word `undefined` when that returns `undefined`.
 * `%1$s` selects the first argument. Numbered specifiers do not move the
 * cursor used by unnumbered ones. Nothing in the template is evaluated.
 * The `values` array is not changed.
 *
 * @param options - The template and the argument list.
 * @returns The formatted text, or `undefined` when `template` is not a string.
 * @throws {@link TypeError} When `values` is not an array. `JSON.stringify` and `Number` may also throw for values they cannot convert.
 * @throws {@link RangeError} When a specifier is unknown or its argument is missing.
 * @example
 * formatSprintf({ template: "%s %d", values: ["total", 1.9] });
 */
export function formatSprintf(
    options: FormatSprintfOptions,
): string | undefined {
    if (!isOptionsRecord(options)) {
        throw new TypeError(
            `values must be an array. Received ${describeReceived(options)}.`,
        );
    }
    if (!Array.isArray(options.values)) {
        throw new TypeError(
            `values must be an array. Received ${describeReceived(options.values)}.`,
        );
    }
    if (typeof options.template !== "string") {
        return undefined;
    }
    return formatTemplate(options.template, options.values);
}

/**
 * @param template - The template text.
 * @param values - The argument list. It is not changed.
 * @returns The formatted text.
 */
function formatTemplate(template: string, values: readonly unknown[]): string {
    let result = "";
    let index = 0;
    let nextArgument = 0;
    while (index < template.length) {
        if (template[index] !== "%") {
            result += template[index] ?? "";
            index += 1;
            continue;
        }
        const parsed = readSpecifier(template, index);
        if (parsed === undefined) {
            throw new RangeError(
                `template has an unknown specifier ${JSON.stringify(template.slice(index))}.`,
            );
        }
        if (parsed.kind === "percent") {
            result += "%";
            index = parsed.end;
            continue;
        }
        const argumentIndex = parsed.argumentIndex ?? nextArgument;
        if (parsed.argumentIndex === undefined) {
            nextArgument += 1;
        }
        if (argumentIndex < 0 || argumentIndex >= values.length) {
            throw new RangeError(
                `template is missing an argument for ${JSON.stringify(template.slice(index, parsed.end))}.`,
            );
        }
        result += formatArgument(
            parsed.specifier ?? "s",
            values[argumentIndex],
        );
        index = parsed.end;
    }
    return result;
}

/**
 * @param template - The template text.
 * @param start - The index of `%`.
 * @returns The specifier, or `undefined` when the text is not in the safe subset.
 */
function readSpecifier(
    template: string,
    start: number,
): ParsedSpecifier | undefined {
    let index = start + 1;
    if (template[index] === "%") {
        return { kind: "percent", end: index + 1 };
    }
    let argumentIndex: number | undefined;
    if (isDigit(template[index] ?? "")) {
        const numberStart = index;
        while (isDigit(template[index] ?? "")) {
            index += 1;
        }
        if (template[index] !== "$") {
            return undefined;
        }
        const number = Number(template.slice(numberStart, index));
        if (!Number.isSafeInteger(number) || number < 1) {
            return undefined;
        }
        argumentIndex = number - 1;
        index += 1;
    }
    const specifier = template[index] ?? "";
    if (!valueSpecifiers.has(specifier)) {
        return undefined;
    }
    return {
        kind: "value",
        specifier,
        ...(argumentIndex === undefined ? {} : { argumentIndex }),
        end: index + 1,
    };
}

/**
 * @param character - One code unit.
 * @returns `true` for ASCII `0` through `9`.
 */
function isDigit(character: string): boolean {
    return character >= "0" && character <= "9";
}

/**
 * @param specifier - `s`, `d`, `i`, `f`, or `j`.
 * @param argument - The selected value. It is not changed.
 * @returns The text for that specifier.
 */
function formatArgument(specifier: string, argument: unknown): string {
    if (specifier === "s") {
        return String(argument);
    }
    if (specifier === "d" || specifier === "i") {
        return String(Math.trunc(Number(argument)));
    }
    if (specifier === "f") {
        return String(Number(argument));
    }
    const json = JSON.stringify(argument);
    return json === undefined ? "undefined" : json;
}
