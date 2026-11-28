import { localeWordsByLanguage } from "../data/locale-words.data.js";

/**
 * Lists the language subtags that have yes/no words.
 *
 * The result includes `"en"` and is sorted. Each call returns a new array,
 * so the caller can sort or push without changing later calls. The function
 * never throws.
 *
 * @returns A new array of language subtags.
 * @example
 * listBooleanLocales().includes("hi"); // true
 */
export function listBooleanLocales(): string[] {
    return Object.keys(localeWordsByLanguage).sort();
}
