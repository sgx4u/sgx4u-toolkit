/**
 * The two booleans of a material implication.
 */
export interface ImpliesInput {
    /** The condition. When this is `false`, the implication is `true`. */
    antecedent: unknown;
    /** The result required when `antecedent` is `true`. */
    consequent: unknown;
}
