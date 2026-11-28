import type { Predicate } from "../types/predicate.types.js";

/**
 * The two predicates of a material implication.
 */
export interface ImpliesPassInput<Value> {
    /**
     * Called first. When it returns `false`, `consequent` is not called.
     */
    antecedent: Predicate<Value>;
    /** Called only when `antecedent` returns `true`. */
    consequent: Predicate<Value>;
}
