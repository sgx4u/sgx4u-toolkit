/**
 * Case name accepted by `convertCase`.
 *
 * `"train"` is the HTTP header form (`Two-Words`). `"capital"` puts a
 * space between capitalized words. `"no-case"` is space-separated lower
 * case. `"pascal-snake"` is `Two_Words`.
 */
export type CaseName =
    | "camel"
    | "pascal"
    | "snake"
    | "kebab"
    | "constant"
    | "dot"
    | "path"
    | "train"
    | "pascal-snake"
    | "sentence"
    | "title"
    | "capital"
    | "no-case"
    | "lower"
    | "upper";
