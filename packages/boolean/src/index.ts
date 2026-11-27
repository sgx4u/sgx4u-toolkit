/**
 * Public entry for `@sgx4u/boolean`.
 *
 * This module only re-exports. Import one name and a bundler can drop the rest.
 */

export { getBooleanWords } from "./get-boolean-words/get-boolean-words.js";
export { isBoolean } from "./is-boolean/is-boolean.js";
export { isFalsy } from "./is-falsy/is-falsy.js";
export { isParseableBoolean } from "./is-parseable-boolean/is-parseable-boolean.js";
export { isTruthy } from "./is-truthy/is-truthy.js";
export { listBooleanLocales } from "./list-boolean-locales/list-boolean-locales.js";
export { parseBoolean } from "./parse-boolean/parse-boolean.js";

export type {
    BooleanParseOptions,
    BooleanWordCategory,
    BooleanWords,
    GetBooleanWordsInput,
    IsParseableBooleanInput,
    ParseBooleanInput,
    WordListMode,
} from "./types/parse-options.types.js";
