import { isOptionsRecord, readEnum } from "../utils/assertions.utils.js";
import { getPluralRules } from "../utils/intl-cache.utils.js";
import { readLocale, type LocaleArgument } from "../utils/locale.utils.js";
import type { GetPluralCategoryOptions } from "./get-plural-category.types.js";

const pluralTypes = ["cardinal", "ordinal"] as const;

/**
 * Returns the `Intl.PluralRules` category for a count.
 *
 * An omitted locale uses the runtime locale. A count that is not a finite
 * number returns `undefined` and does not throw. The input is not changed.
 *
 * @param options - The count, an optional locale, and an optional type.
 * @returns A category such as `"one"` or `"other"`, or `undefined` when `count` is not a finite number.
 * @throws {@link RangeError} When `type` is not `"cardinal"` or `"ordinal"`, or a provided locale is empty.
 * @throws {@link TypeError} When `type` or `locale` is present and has the wrong type.
 * @example
 * getPluralCategory({ count: 1 });
 */
export function getPluralCategory(
    options: GetPluralCategoryOptions,
): Intl.LDMLPluralRule | undefined {
    if (!isOptionsRecord(options)) {
        return undefined;
    }
    const type = readEnum("type", options.type, pluralTypes, "cardinal");
    const locale = readCategoryLocale(options.locale);
    if (typeof options.count !== "number" || !Number.isFinite(options.count)) {
        return undefined;
    }
    return getPluralRules(locale, type).select(options.count);
}

/**
 * @param value - The locale option. `undefined` keeps the runtime locale.
 * @returns The locale `Intl` should use.
 */
function readCategoryLocale(value: unknown): LocaleArgument | undefined {
    if (value === undefined) {
        return undefined;
    }
    return readLocale(value);
}
