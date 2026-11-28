import { all } from "../all/all.js";
import { allPass } from "../all-pass/all-pass.js";
import { any } from "../any/any.js";
import { anyPass } from "../any-pass/any-pass.js";
import { areEqual } from "../are-equal/are-equal.js";
import { countTrue } from "../count-true/count-true.js";
import { exactlyOne } from "../exactly-one/exactly-one.js";
import { exactlyOnePass } from "../exactly-one-pass/exactly-one-pass.js";
import { formatBoolean as formatBooleanRoot } from "../format-boolean/format-boolean.js";
import { getBooleanWords as getBooleanWordsRoot } from "../get-boolean-words/get-boolean-words.js";
import { implies } from "../implies/implies.js";
import { impliesPass } from "../implies-pass/implies-pass.js";
import { isBoolean } from "../is-boolean/is-boolean.js";
import { isFalsy } from "../is-falsy/is-falsy.js";
import { isMajorityTrue } from "../is-majority-true/is-majority-true.js";
import { isTruthy } from "../is-truthy/is-truthy.js";
import { listBooleanLocales } from "../list-boolean-locales/list-boolean-locales.js";
import { nand } from "../nand/nand.js";
import { negate } from "../negate/negate.js";
import { none } from "../none/none.js";
import { nonePass } from "../none-pass/none-pass.js";
import { nor } from "../nor/nor.js";
import { not } from "../not/not.js";
import { toggle } from "../toggle/toggle.js";
import { xnor } from "../xnor/xnor.js";
import { xor } from "../xor/xor.js";
import type { BooleanConfig } from "../types/boolean-config.types.js";
import type {
    BooleanCapitalization,
    BooleanFormatStyle,
    FormatBooleanInput,
} from "../types/format-options.types.js";
import type {
    GetBooleanWordsInput,
    WordListMode,
} from "../types/parse-options.types.js";
import { resolveFormatOptions } from "../utils/assert-format-options.utils.js";
import { describeReceived } from "../utils/describe-received.utils.js";
import {
    normalizeParseRequest,
    type NormalizedParseRequest,
} from "../utils/normalize-parse-request.utils.js";
import { readBooleanToken } from "../utils/read-boolean-token.utils.js";
import {
    resolveParseSettings,
    type RawParseOptions,
} from "../utils/resolve-parse-settings.utils.js";
import type { BooleanInstance } from "./create-boolean.types.js";

/**
 * Returns every boolean function with `config` bound in as the defaults.
 *
 * A value on a single call replaces the stored one. Two instances do not
 * share arrays or option objects, and nothing is written to module state
 * or `globalThis`. The package functions stay on their own defaults.
 * `createBoolean` is not copied onto the instance. Validation runs now:
 * a bad option or an overlapping word throws before the instance is returned.
 *
 * Omitted config fields use `locale` `"en"`, empty custom word lists,
 * `wordListMode` `"extend"`, `caseSensitive` `false`, `trim` `true`,
 * `lenient` `false`, no `fallback`, `formatStyle` `"true-false"`, and
 * `formatCapitalization` `"lower"`.
 *
 * @param config - Defaults for parse, word lookup, and format. Omit it for the package defaults.
 * @returns An instance whose configurable methods close over a copy of `config`.
 * @throws {TypeError} When `config` is not an object, or an option has the wrong type.
 * @throws {RangeError} When the folded truthy and falsy words share a word.
 * @example
 * createBoolean({ locale: "fr" }).parseBoolean("oui"); // true
 */
export function createBoolean<Config extends BooleanConfig = BooleanConfig>(
    config?: Config,
): BooleanInstance<Config> {
    if (
        config !== undefined &&
        (typeof config !== "object" || config === null || Array.isArray(config))
    ) {
        throw new TypeError(
            `config must be an object. Received ${describeReceived(config)}.`,
        );
    }

    const source: BooleanConfig = config ?? {};
    const locale = source.locale ?? "en";
    resolveParseSettings({
        locale,
        truthyWords: source.truthyWords,
        falsyWords: source.falsyWords,
        wordListMode: source.wordListMode,
        caseSensitive: source.caseSensitive,
        trim: source.trim,
        lenient: source.lenient,
        fallback: source.fallback,
    });
    resolveFormatOptions(
        source.formatStyle,
        locale,
        source.formatCapitalization,
    );

    const boundTruthyWords =
        source.truthyWords === undefined ? [] : [...source.truthyWords];
    const boundFalsyWords =
        source.falsyWords === undefined ? [] : [...source.falsyWords];
    const boundWordListMode: WordListMode = source.wordListMode ?? "extend";
    const boundCaseSensitive = source.caseSensitive ?? false;
    const boundTrim = source.trim ?? true;
    const boundLenient = source.lenient ?? false;
    const boundFallback = source.fallback;
    const boundFormatStyle: BooleanFormatStyle =
        source.formatStyle ?? "true-false";
    const boundCapitalization: BooleanCapitalization =
        source.formatCapitalization ?? "lower";

    const boundOptions: RawParseOptions = {
        locale,
        truthyWords: boundTruthyWords,
        falsyWords: boundFalsyWords,
        wordListMode: boundWordListMode,
        caseSensitive: boundCaseSensitive,
        trim: boundTrim,
        lenient: boundLenient,
    };
    if (boundFallback !== undefined) {
        boundOptions.fallback = boundFallback;
    }

    // The instance signatures depend on `Config`. The functions below return
    // the runtime values those signatures describe.
    const instance = {
        isBoolean,
        isTruthy,
        isFalsy,
        isParseableBoolean(valueOrInput: unknown): boolean {
            const request = normalizeParseRequest(valueOrInput);
            const settings = resolveParseSettings(
                mergeParseOptions(request, boundOptions),
            );
            return readBooleanToken(request.value, settings) !== undefined;
        },
        parseBoolean(valueOrInput: unknown): boolean | undefined {
            const request = normalizeParseRequest(valueOrInput);
            const settings = resolveParseSettings(
                mergeParseOptions(request, boundOptions),
            );
            const parsed = readBooleanToken(request.value, settings);
            if (parsed !== undefined) {
                return parsed;
            }
            return settings.fallback;
        },
        getBooleanWords(input?: GetBooleanWordsInput) {
            if (
                input !== undefined &&
                (typeof input !== "object" ||
                    input === null ||
                    Array.isArray(input))
            ) {
                return getBooleanWordsRoot(input);
            }
            if (input?.locale !== undefined) {
                return getBooleanWordsRoot(input);
            }
            return getBooleanWordsRoot({
                ...input,
                locale,
            });
        },
        listBooleanLocales,
        formatBoolean(input: FormatBooleanInput): string | undefined {
            if (
                typeof input !== "object" ||
                input === null ||
                Array.isArray(input)
            ) {
                return formatBooleanRoot(input);
            }
            return formatBooleanRoot({
                value: input.value,
                style: pickFormatOption(input, "style", boundFormatStyle),
                locale: pickFormatOption(input, "locale", locale),
                capitalization: pickFormatOption(
                    input,
                    "capitalization",
                    boundCapitalization,
                ),
            });
        },
        not,
        toggle,
        all,
        any,
        none,
        nand,
        nor,
        xor,
        xnor,
        implies,
        exactlyOne,
        areEqual,
        countTrue,
        isMajorityTrue,
        allPass,
        anyPass,
        nonePass,
        negate,
        exactlyOnePass,
        impliesPass,
    } as BooleanInstance<Config>;
    return instance;
}

/**
 * Copies the stored options and lets keys on this call replace them.
 *
 * The stored object and its word arrays are not written to. A key whose
 * value is `undefined` is omitted, so a hole keeps the stored default.
 *
 * @param request - The call split into a value and the keys it set.
 * @param boundOptions - Defaults captured when the instance was created.
 * @returns A new option bag for `resolveParseSettings`.
 */
function mergeParseOptions(
    request: NormalizedParseRequest,
    boundOptions: RawParseOptions,
): RawParseOptions {
    const merged: RawParseOptions = { ...boundOptions };
    for (const key of request.providedKeys) {
        const value = request.options[key];
        if (value === undefined) {
            continue;
        }
        merged[key] = value;
    }
    return merged;
}

/**
 * Uses the stored format default unless this call set the field.
 *
 * `undefined` is treated as omitted so a hole does not clear the default.
 * Any other value is passed through, including a value the formatter rejects.
 *
 * @param input - The format argument.
 * @param key - `style`, `locale`, or `capitalization`.
 * @param boundValue - The stored default.
 * @returns The call's value, or `boundValue` when the call omitted it.
 */
function pickFormatOption<Value>(
    input: FormatBooleanInput,
    key: "style" | "locale" | "capitalization",
    boundValue: Value,
): Value {
    if (!Object.hasOwn(input, key)) {
        return boundValue;
    }
    const value = input[key];
    if (value === undefined) {
        return boundValue;
    }
    return value as Value;
}
