import type { all } from "../all/all.js";
import type { allPass } from "../all-pass/all-pass.js";
import type { any } from "../any/any.js";
import type { anyPass } from "../any-pass/any-pass.js";
import type { areEqual } from "../are-equal/are-equal.js";
import type { countTrue } from "../count-true/count-true.js";
import type { exactlyOne } from "../exactly-one/exactly-one.js";
import type { exactlyOnePass } from "../exactly-one-pass/exactly-one-pass.js";
import type { formatBoolean } from "../format-boolean/format-boolean.js";
import type { getBooleanWords } from "../get-boolean-words/get-boolean-words.js";
import type { implies } from "../implies/implies.js";
import type { impliesPass } from "../implies-pass/implies-pass.js";
import type { isBoolean } from "../is-boolean/is-boolean.js";
import type { isFalsy } from "../is-falsy/is-falsy.js";
import type { isMajorityTrue } from "../is-majority-true/is-majority-true.js";
import type { isTruthy } from "../is-truthy/is-truthy.js";
import type { listBooleanLocales } from "../list-boolean-locales/list-boolean-locales.js";
import type { nand } from "../nand/nand.js";
import type { negate } from "../negate/negate.js";
import type { none } from "../none/none.js";
import type { nonePass } from "../none-pass/none-pass.js";
import type { nor } from "../nor/nor.js";
import type { not } from "../not/not.js";
import type { toggle } from "../toggle/toggle.js";
import type { xnor } from "../xnor/xnor.js";
import type { xor } from "../xor/xor.js";
import type { BooleanConfig } from "../types/boolean-config.types.js";
import type {
    IsParseableBooleanInput,
    ParseBooleanInput,
} from "../types/parse-options.types.js";

/**
 * Result of `parseBoolean` on an instance.
 *
 * A config that sets `fallback` makes a bare parse return `boolean`. A
 * config that omits `fallback` still returns `boolean | undefined`, unless
 * that call passes its own `fallback`.
 */
export type ParseBooleanResult<Config extends BooleanConfig> = Config extends {
    fallback: boolean;
}
    ? boolean
    : boolean | undefined;

/**
 * Every public function with one config's defaults bound in.
 *
 * `createBoolean` itself is not on the instance. Calling the package
 * `createBoolean` again builds a separate instance and does not change this
 * one. Methods that ignore the config are the same functions as the package
 * root.
 */
export interface BooleanInstance<Config extends BooleanConfig = BooleanConfig> {
    /** Same function as the package `isBoolean`. */
    readonly isBoolean: typeof isBoolean;
    /** Same function as the package `isTruthy`. */
    readonly isTruthy: typeof isTruthy;
    /** Same function as the package `isFalsy`. */
    readonly isFalsy: typeof isFalsy;
    /**
     * `isParseableBoolean` using this config's parse defaults.
     *
     * A field on the call replaces the stored one. Config `fallback` is not
     * used: an unrecognized value returns `false`.
     */
    isParseableBoolean(input: IsParseableBooleanInput): boolean;
    /** @param value - A candidate token, parsed with the stored defaults. */
    isParseableBoolean(value: unknown): boolean;
    /**
     * `parseBoolean` using this config's defaults.
     *
     * A field on the call replaces the stored one. When this call sets
     * `fallback`, the result is `boolean`.
     */
    parseBoolean(input: ParseBooleanInput & { fallback: boolean }): boolean;
    /** @param input - Parse options. Omitted fields use the stored defaults. */
    parseBoolean(input: ParseBooleanInput): ParseBooleanResult<Config>;
    /** @param value - A candidate token, parsed with the stored defaults. */
    parseBoolean(value: unknown): ParseBooleanResult<Config>;
    /**
     * `getBooleanWords` with this config's locale as the default locale.
     */
    readonly getBooleanWords: typeof getBooleanWords;
    /** Same function as the package `listBooleanLocales`. */
    readonly listBooleanLocales: typeof listBooleanLocales;
    /**
     * `formatBoolean` using this config's locale, style, and capitalization.
     *
     * A field on the call replaces the stored one.
     */
    readonly formatBoolean: typeof formatBoolean;
    /** Same function as the package `not`. */
    readonly not: typeof not;
    /** Same function as the package `toggle`. */
    readonly toggle: typeof toggle;
    /** Same function as the package `all`. */
    readonly all: typeof all;
    /** Same function as the package `any`. */
    readonly any: typeof any;
    /** Same function as the package `none`. */
    readonly none: typeof none;
    /** Same function as the package `nand`. */
    readonly nand: typeof nand;
    /** Same function as the package `nor`. */
    readonly nor: typeof nor;
    /** Same function as the package `xor`. */
    readonly xor: typeof xor;
    /** Same function as the package `xnor`. */
    readonly xnor: typeof xnor;
    /** Same function as the package `implies`. */
    readonly implies: typeof implies;
    /** Same function as the package `exactlyOne`. */
    readonly exactlyOne: typeof exactlyOne;
    /** Same function as the package `areEqual`. */
    readonly areEqual: typeof areEqual;
    /** Same function as the package `countTrue`. */
    readonly countTrue: typeof countTrue;
    /** Same function as the package `isMajorityTrue`. */
    readonly isMajorityTrue: typeof isMajorityTrue;
    /** Same function as the package `allPass`. */
    readonly allPass: typeof allPass;
    /** Same function as the package `anyPass`. */
    readonly anyPass: typeof anyPass;
    /** Same function as the package `nonePass`. */
    readonly nonePass: typeof nonePass;
    /** Same function as the package `negate`. */
    readonly negate: typeof negate;
    /** Same function as the package `exactlyOnePass`. */
    readonly exactlyOnePass: typeof exactlyOnePass;
    /** Same function as the package `impliesPass`. */
    readonly impliesPass: typeof impliesPass;
}
