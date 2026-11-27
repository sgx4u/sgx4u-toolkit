/**
 * Public entry for `@sgx4u/boolean`.
 *
 * This module only re-exports. Import one name and a bundler can drop the rest.
 */

export { allPass } from "./all-pass/all-pass.js";
export { anyPass } from "./any-pass/any-pass.js";
export { exactlyOnePass } from "./exactly-one-pass/exactly-one-pass.js";
export { impliesPass } from "./implies-pass/implies-pass.js";
export type { ImpliesPassInput } from "./implies-pass/implies-pass.types.js";
export { negate } from "./negate/negate.js";
export { nonePass } from "./none-pass/none-pass.js";

export { all } from "./all/all.js";
export { any } from "./any/any.js";
export { areEqual } from "./are-equal/are-equal.js";
export { countTrue } from "./count-true/count-true.js";
export { exactlyOne } from "./exactly-one/exactly-one.js";
export { implies } from "./implies/implies.js";
export type { ImpliesInput } from "./implies/implies.types.js";
export { isMajorityTrue } from "./is-majority-true/is-majority-true.js";
export { nand } from "./nand/nand.js";
export { none } from "./none/none.js";
export { nor } from "./nor/nor.js";
export { not } from "./not/not.js";
export { toggle } from "./toggle/toggle.js";
export { xnor } from "./xnor/xnor.js";
export { xor } from "./xor/xor.js";

export { formatBoolean } from "./format-boolean/format-boolean.js";
export { getBooleanWords } from "./get-boolean-words/get-boolean-words.js";
export { isBoolean } from "./is-boolean/is-boolean.js";
export { isFalsy } from "./is-falsy/is-falsy.js";
export { isParseableBoolean } from "./is-parseable-boolean/is-parseable-boolean.js";
export { isTruthy } from "./is-truthy/is-truthy.js";
export { listBooleanLocales } from "./list-boolean-locales/list-boolean-locales.js";
export { parseBoolean } from "./parse-boolean/parse-boolean.js";

export type { Predicate } from "./types/predicate.types.js";
export type {
    BooleanCapitalization,
    BooleanFormatStyle,
    FormatBooleanInput,
} from "./types/format-options.types.js";
export type {
    BooleanParseOptions,
    BooleanWordCategory,
    BooleanWords,
    GetBooleanWordsInput,
    IsParseableBooleanInput,
    ParseBooleanInput,
    WordListMode,
} from "./types/parse-options.types.js";
