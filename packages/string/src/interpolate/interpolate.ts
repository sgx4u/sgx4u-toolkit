import { isOptionsRecord, readEnum } from "../utils/assertions.utils.js";
import { describeReceived } from "../utils/describe-received.utils.js";
import type {
    InterpolateMissing,
    InterpolateOptions,
    InterpolatePattern,
} from "./interpolate.types.js";

const patterns = ["curly", "double-curly"] as const;
const missingModes = ["empty", "keep"] as const;

/**
 * Settings after defaults and checks have been applied.
 */
interface InterpolateSettings {
    /** Placeholder style. */
    pattern: InterpolatePattern;
    /** Missing-key policy. */
    missing: InterpolateMissing;
    /** Own properties copied from the caller. The object is not changed. */
    values: Record<string, unknown>;
}

/**
 * Replaces `{name}` or `{{name}}` placeholders with string values.
 *
 * A key is one or more ASCII letters, digits, or underscores. There is no
 * evaluation: the template is not parsed as code. A missing key becomes
 * an empty string, or stays as the placeholder when `missing` is `"keep"`.
 * Present values are stringified with `String`. The `values` object is
 * not changed.
 *
 * @param options - The template, the values, and the optional pattern.
 * @returns The filled template, or `undefined` when `template` is not a string.
 * @throws {@link TypeError} When `values` is not a non-null object.
 * @throws {@link RangeError} When `pattern` or `missing` is not a known value.
 * @example
 * interpolate({ template: "Hello {name}", values: { name: "Ada" } });
 */
export function interpolate(options: InterpolateOptions): string | undefined {
    if (!isOptionsRecord(options)) {
        return undefined;
    }
    const settings = readInterpolateOptions(options);
    if (typeof options.template !== "string") {
        return undefined;
    }
    return fillTemplate(options.template, settings);
}

/**
 * @param record - The options object.
 * @returns Checked pattern, missing policy, and values.
 */
function readInterpolateOptions(
    record: Record<string, unknown>,
): InterpolateSettings {
    return {
        pattern: readEnum("pattern", record.pattern, patterns, "curly"),
        missing: readEnum("missing", record.missing, missingModes, "empty"),
        values: readValues(record.values),
    };
}

/**
 * @param value - The `values` option.
 * @returns The same object when it can be read as a record.
 */
function readValues(value: unknown): Record<string, unknown> {
    if (typeof value !== "object" || value === null || Array.isArray(value)) {
        throw new TypeError(
            `values must be an object. Received ${describeReceived(value)}.`,
        );
    }
    return value as Record<string, unknown>;
}

/**
 * @param template - The template text.
 * @param settings - Checked interpolate settings.
 * @returns The template with placeholders replaced.
 */
function fillTemplate(template: string, settings: InterpolateSettings): string {
    const opener = settings.pattern === "double-curly" ? "{{" : "{";
    const closer = settings.pattern === "double-curly" ? "}}" : "}";
    let result = "";
    let index = 0;
    while (index < template.length) {
        const start = template.indexOf(opener, index);
        if (start === -1) {
            result += template.slice(index);
            break;
        }
        result += template.slice(index, start);
        const keyEnd = readKeyEnd(template, start + opener.length);
        if (keyEnd === undefined || !template.startsWith(closer, keyEnd)) {
            result += opener;
            index = start + opener.length;
            continue;
        }
        const key = template.slice(start + opener.length, keyEnd);
        if (Object.hasOwn(settings.values, key)) {
            result += String(settings.values[key]);
        } else if (settings.missing === "keep") {
            result += template.slice(start, keyEnd + closer.length);
        }
        index = keyEnd + closer.length;
    }
    return result;
}

/**
 * @param template - The template text.
 * @param start - The first index of a possible key.
 * @returns The index after the key, or `undefined` when no key starts here.
 */
function readKeyEnd(template: string, start: number): number | undefined {
    let index = start;
    while (index < template.length && isKeyCharacter(template[index] ?? "")) {
        index += 1;
    }
    if (index === start) {
        return undefined;
    }
    return index;
}

/**
 * @param character - One code unit.
 * @returns `true` for an ASCII letter, digit, or underscore.
 */
function isKeyCharacter(character: string): boolean {
    return (
        (character >= "A" && character <= "Z") ||
        (character >= "a" && character <= "z") ||
        (character >= "0" && character <= "9") ||
        character === "_"
    );
}
