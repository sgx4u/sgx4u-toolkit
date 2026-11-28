import type { Iteratee } from "./iteratee.types.js";

/**
 * Sort direction for one key.
 */
export type Direction = "ascending" | "descending";

/**
 * One sort key.
 *
 * A property key or function uses the call-level direction, locale, numeric
 * mode, sensitivity, and null placement. An object overrides those for this
 * key only.
 */
export type SortKey<Item> =
    | Iteratee<Item>
    | {
          by: Iteratee<Item>;
          /**
           * Direction for this key.
           * @defaultValue "ascending"
           */
          direction?: Direction;
          /**
           * BCP 47 language tag or list for this key.
           * @defaultValue the call-level locale, or the runtime locale
           */
          locale?: string | readonly string[];
          /**
           * When true, number-like parts of strings compare as numbers.
           * @defaultValue the call-level `numeric`, or false
           */
          numeric?: boolean;
          /**
           * Collator sensitivity for this key.
           * @defaultValue the call-level sensitivity, or "variant"
           */
          sensitivity?: "base" | "accent" | "case" | "variant";
          /**
           * Where nullish keys, and `NaN` keys, go.
           * @defaultValue the call-level `nulls`, or "last"
           */
          nulls?: "first" | "last";
      };
