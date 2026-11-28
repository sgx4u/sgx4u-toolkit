import {
    readBoolean,
    readInteger,
    readOptionalString,
} from "../utils/assertions.utils.js";
import { measureDisplayWidth } from "../utils/display-width.utils.js";
import { readOptionsCall } from "../utils/read-call.utils.js";
import { splitIntoUnits } from "../utils/units.utils.js";
import type { WrapTextOptions } from "./wrap-text.types.js";

/**
 * Wraps `value` onto lines of at most `maximumWidth` display columns.
 *
 * Breaks happen on whitespace. A grapheme wider than `maximumWidth` sits
 * on its own line. `indent` is prefixed to every line. The input is not changed.
 *
 * @param options - `value`, `maximumWidth`, and the wrap options.
 * @returns The wrapped string, or `undefined` when `value` is not a string.
 * @throws {@link RangeError} When `maximumWidth` is less than 1.
 * @example
 * wrapText({ value: "hello world", maximumWidth: 8 });
 */
export function wrapText(options: WrapTextOptions): string | undefined {
    const resolved = readOptionsCall(options, (record) => ({
        maximumWidth: readInteger(
            "maximumWidth",
            record.maximumWidth,
            1,
            undefined,
        ),
        breakLongWords: readBoolean(
            "breakLongWords",
            record.breakLongWords,
            true,
        ),
        newline: readOptionalString("newline", record.newline) ?? "\n",
        indent: readOptionalString("indent", record.indent) ?? "",
    }));
    if (resolved === undefined || typeof resolved.record.value !== "string") {
        return undefined;
    }
    const width = resolved.options.maximumWidth;
    const indentWidth = measureDisplayWidth(resolved.options.indent, false);
    const budget = Math.max(1, width - indentWidth);
    const lines: string[] = [];
    for (const paragraph of resolved.record.value.split(/\r\n|\n|\r/u)) {
        let current = "";
        for (const word of paragraph.split(/(\s+)/u)) {
            if (word.length === 0) {
                continue;
            }
            const candidate = current + word;
            if (
                measureDisplayWidth(candidate, false) <= budget ||
                current.length === 0
            ) {
                if (
                    measureDisplayWidth(word, false) > budget &&
                    resolved.options.breakLongWords &&
                    !/^\s+$/u.test(word)
                ) {
                    if (current.trim().length > 0) {
                        lines.push(current.trimEnd());
                    }
                    let piece = "";
                    for (const grapheme of splitIntoUnits(word, "grapheme")) {
                        const next = piece + grapheme;
                        if (
                            piece.length > 0 &&
                            measureDisplayWidth(next, false) > budget
                        ) {
                            lines.push(piece);
                            piece = grapheme;
                        } else {
                            piece = next;
                        }
                    }
                    current = piece;
                } else {
                    current = candidate;
                }
            } else {
                lines.push(current.trimEnd());
                current = word.trimStart();
            }
        }
        lines.push(current.trimEnd());
    }
    return lines
        .map((line) => resolved.options.indent + line)
        .join(resolved.options.newline);
}
