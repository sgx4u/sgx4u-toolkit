import { readInteger, readOptionalString } from "../utils/assertions.utils.js";
import { readStringCall } from "../utils/read-call.utils.js";
import { splitIntoUnits } from "../utils/units.utils.js";
import type { ToFilenameOptions } from "./to-filename.types.js";

/**
 * Windows device names that cannot be a file stem, ignoring case.
 *
 * `COM` and `LPT` are reserved only for the digits 1 through 9.
 */
const reservedDeviceNames: ReadonlySet<string> = new Set([
    "CON",
    "PRN",
    "AUX",
    "NUL",
    "COM1",
    "COM2",
    "COM3",
    "COM4",
    "COM5",
    "COM6",
    "COM7",
    "COM8",
    "COM9",
    "LPT1",
    "LPT2",
    "LPT3",
    "LPT4",
    "LPT5",
    "LPT6",
    "LPT7",
    "LPT8",
    "LPT9",
]);

const reservedCharacters: ReadonlySet<string> = new Set([
    "<",
    ">",
    ":",
    '"',
    "/",
    "\\",
    "|",
    "?",
    "*",
]);

/**
 * Settings after defaults and checks have been applied.
 */
interface ToFilenameSettings {
    /** Safe replacement for a reserved or control run. */
    replacement: string;
    /** Grapheme cap. At least 1. */
    maximumLength: number;
}

/**
 * Turns `value` into one safe file name.
 *
 * The input should be a base name, not a path. `\` and `/` are replaced;
 * they are not treated as directories. Reserved characters
 * `<>:"/\\|?*` and control characters (`U+0000`–`U+001F` and
 * `U+007F`–`U+009F`) are replaced. A run of those characters becomes one
 * replacement. Trailing ASCII spaces and periods are removed. An empty
 * result becomes `_`. `CON`, `PRN`, `AUX`, `NUL`, `COM1`–`COM9`, and
 * `LPT1`–`LPT9` get `_` appended to the stem, including names such as
 * `CON.txt`. The input is not changed.
 *
 * @param value - A base name to clean.
 * @returns A single safe path segment.
 * @example
 * toFilename("CON.txt");
 */
export function toFilename(value: string): string;
/**
 * @param options - `value` plus optional replacement and length.
 * @returns The safe name, or `undefined` when `value` is not a string.
 * @throws {@link TypeError} When an option has the wrong type.
 * @throws {@link RangeError} When `maximumLength` is below 1 or is not an integer.
 */
export function toFilename(options: ToFilenameOptions): string | undefined;
/**
 * @param valueOrOptions - A string, or one flat options object.
 * @returns The safe name, or `undefined` when the text is not a string.
 */
export function toFilename(valueOrOptions: unknown): string | undefined {
    const resolved = readStringCall(valueOrOptions, readToFilenameOptions);
    if (resolved === undefined) {
        return undefined;
    }
    return buildFilename(resolved.value, resolved.options);
}

/**
 * @param record - The options object, or an empty object for a bare string.
 * @returns Checked settings.
 */
function readToFilenameOptions(
    record: Record<string, unknown>,
): ToFilenameSettings {
    const requested =
        readOptionalString("replacement", record.replacement) ?? "-";
    return {
        replacement: sanitizeReplacement(requested),
        maximumLength: readInteger(
            "maximumLength",
            record.maximumLength,
            1,
            undefined,
            255,
        ),
    };
}

/**
 * @param value - The caller's base name.
 * @param settings - Checked filename settings.
 * @returns One safe segment.
 */
function buildFilename(value: string, settings: ToFilenameSettings): string {
    let cleaned = trimTrailingDotsAndSpaces(
        replaceReservedRuns(value, settings.replacement),
    );
    if (cleaned.length === 0) {
        cleaned = "_";
    }
    cleaned = suffixReservedDeviceName(cleaned);
    return limitFilenameLength(cleaned, settings.maximumLength);
}

/**
 * @param character - One code point from the file name.
 * @returns `true` for a Windows reserved character or a control character.
 */
function isReservedOrControl(character: string): boolean {
    if (reservedCharacters.has(character)) {
        return true;
    }
    const codePoint = character.codePointAt(0) ?? 0;
    return (
        (codePoint >= 0 && codePoint <= 0x1f) ||
        (codePoint >= 0x7f && codePoint <= 0x9f)
    );
}

/**
 * Removes reserved and control characters from a replacement.
 *
 * @param replacement - The caller's replacement.
 * @returns A replacement that can appear inside a file name.
 */
function sanitizeReplacement(replacement: string): string {
    let sanitized = "";
    for (const character of replacement) {
        if (!isReservedOrControl(character)) {
            sanitized += character;
        }
    }
    return sanitized;
}

/**
 * Replaces each run of reserved or control characters with one replacement.
 *
 * Characters that are already safe, including hyphens the caller wrote,
 * stay as they are.
 *
 * @param value - The original base name.
 * @param replacement - The safe replacement. It may be empty.
 * @returns A new string.
 */
function replaceReservedRuns(value: string, replacement: string): string {
    let result = "";
    let pendingReplacement = false;
    for (const character of value) {
        if (isReservedOrControl(character)) {
            pendingReplacement = true;
            continue;
        }
        if (pendingReplacement) {
            result += replacement;
            pendingReplacement = false;
        }
        result += character;
    }
    if (pendingReplacement) {
        result += replacement;
    }
    return result;
}

/**
 * @param value - A cleaned name.
 * @returns `value` without trailing ASCII spaces or periods.
 */
function trimTrailingDotsAndSpaces(value: string): string {
    let end = value.length;
    while (end > 0) {
        const character = value[end - 1];
        if (character !== "." && character !== " ") {
            break;
        }
        end -= 1;
    }
    return value.slice(0, end);
}

/**
 * @param value - A cleaned name that may still be a device name.
 * @returns The name, with `_` inserted after a reserved stem.
 */
function suffixReservedDeviceName(value: string): string {
    const dotIndex = value.indexOf(".");
    const stem = dotIndex === -1 ? value : value.slice(0, dotIndex);
    if (!isReservedDeviceStem(stem)) {
        return value;
    }
    const extension = dotIndex === -1 ? "" : value.slice(dotIndex);
    return `${stem}_${extension}`;
}

/**
 * @param stem - The name before the first period.
 * @returns `true` when Windows reserves that device name.
 */
function isReservedDeviceStem(stem: string): boolean {
    return reservedDeviceNames.has(stem.toLocaleUpperCase("en"));
}

/**
 * Shortens `value` to `maximumLength` graphemes and repairs the tail.
 *
 * A slice that lands on a reserved device name replaces the last grapheme
 * of the stem with `_`, so the length does not grow.
 *
 * @param value - The cleaned name, already suffixed when it was reserved.
 * @param maximumLength - The grapheme cap.
 * @returns A name no longer than `maximumLength` graphemes.
 */
function limitFilenameLength(value: string, maximumLength: number): string {
    const graphemes = splitIntoUnits(value, "grapheme");
    if (graphemes.length <= maximumLength) {
        return value;
    }
    const shortened = trimTrailingDotsAndSpaces(
        graphemes.slice(0, maximumLength).join(""),
    );
    if (shortened.length === 0) {
        return "_";
    }
    const dotIndex = shortened.indexOf(".");
    const stem = dotIndex === -1 ? shortened : shortened.slice(0, dotIndex);
    if (!isReservedDeviceStem(stem)) {
        return shortened;
    }
    const extension = dotIndex === -1 ? "" : shortened.slice(dotIndex);
    const stemGraphemes = splitIntoUnits(stem, "grapheme");
    const head = stemGraphemes.slice(0, -1).join("");
    return `${head}_${extension}`;
}
