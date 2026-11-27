import type { ObjectPath, PathSegment } from "./path.types.js";

/**
 * String keys of `T`, as an array type.
 */
export type ObjectKeys<T> = Extract<keyof T, string>[];

/**
 * Values of the string keys of `T`, as an array type.
 */
export type ObjectValues<T> = T[Extract<keyof T, string>][];

/**
 * Entries of the string keys of `T`.
 */
export type ObjectEntries<T> = {
    [Key in Extract<keyof T, string>]: [Key, T[Key]];
}[Extract<keyof T, string>][];

/** Built-ins that stay leaves in the deep mapped types. */
type DeepLeaf =
    | Date
    | RegExp
    | Map<unknown, unknown>
    | Set<unknown>
    | WeakMap<object, unknown>
    | WeakSet<object>
    | Error
    | URL
    | URLSearchParams
    | ArrayBuffer
    | DataView
    | Promise<unknown>
    | ((...args: never[]) => unknown);

/**
 * `Partial` applied at every plain-object level. Arrays are mapped.
 */
export type PartialDeep<T> = T extends DeepLeaf
    ? T
    : T extends readonly (infer Element)[]
      ? PartialDeep<Element>[]
      : T extends object
        ? { [Key in keyof T]?: PartialDeep<T[Key]> }
        : T;

/**
 * `Required` applied at every plain-object level. Arrays are mapped.
 */
export type RequiredDeep<T> = T extends DeepLeaf
    ? T
    : T extends readonly (infer Element)[]
      ? RequiredDeep<Element>[]
      : T extends object
        ? { [Key in keyof T]-?: RequiredDeep<T[Key]> }
        : T;

/**
 * `Readonly` applied at every plain-object level. Arrays become readonly.
 */
export type ReadonlyDeep<T> = T extends DeepLeaf
    ? T
    : T extends readonly (infer Element)[]
      ? readonly ReadonlyDeep<Element>[]
      : T extends object
        ? { readonly [Key in keyof T]: ReadonlyDeep<T[Key]> }
        : T;

/**
 * Removes `readonly` at every plain-object level.
 */
export type WritableDeep<T> = T extends DeepLeaf
    ? T
    : T extends readonly (infer Element)[]
      ? WritableDeep<Element>[]
      : T extends object
        ? { -readonly [Key in keyof T]: WritableDeep<T[Key]> }
        : T;

/**
 * Deep merge of `Left` and `Right`. Arrays are replaced by the right side.
 */
export type MergeDeep<Left, Right> = Right extends readonly unknown[]
    ? Right
    : Left extends readonly unknown[]
      ? Right
      : Left extends object
        ? Right extends object
            ? Omit<Left, keyof Right> & {
                  [Key in keyof Right]: Key extends keyof Left
                      ? MergeDeep<Left[Key], Right[Key]>
                      : Right[Key];
              }
            : Right
        : Right;

type DepthStep = [never, 0, 1, 2, 3, 4];

type JoinPath<Left extends string, Right extends string> = Right extends ""
    ? Left
    : `${Left}.${Right}`;

/**
 * Dot paths of `T`, limited to five levels so the union stays finite.
 */
export type Paths<T, Depth extends number = 4> = Depth extends 0
    ? never
    : T extends DeepLeaf
      ? never
      : T extends readonly (infer Element)[]
        ? Paths<Element, DepthStep[Depth]> extends infer Nested
            ? Nested extends string
                ? number | `${number}` | JoinPath<`${number}`, Nested>
                : number | `${number}`
            : never
        : T extends object
          ? {
                [Key in Extract<keyof T, string>]: Paths<
                    T[Key],
                    DepthStep[Depth]
                > extends infer Nested
                    ? Nested extends string
                        ? Key | JoinPath<Key, Nested>
                        : Key
                    : Key;
            }[Extract<keyof T, string>]
          : never;

type IndexAt<
    T,
    Key extends string | number,
> = T extends readonly (infer Element)[]
    ? Key extends number
        ? Element
        : Key extends `${number}`
          ? Element
          : unknown
    : Key extends keyof T
      ? T[Key]
      : unknown;

type SegmentsValue<
    T,
    Segments extends readonly PathSegment[],
> = Segments extends readonly [infer Head, ...infer Rest]
    ? Rest extends readonly PathSegment[]
        ? Head extends string | number
            ? SegmentsValue<IndexAt<T, Head>, Rest>
            : unknown
        : unknown
    : T;

type StringValue<T, Path extends string> = string extends Path
    ? unknown
    : Path extends `${infer Head}.${infer Rest}`
      ? StringValue<IndexAt<T, Head>, Rest>
      : Path extends `${infer Head}[${infer Index}]${infer Rest}`
        ? Rest extends `.${infer After}`
            ? StringValue<IndexAt<IndexAt<T, Head>, Index>, After>
            : Rest extends ""
              ? IndexAt<IndexAt<T, Head>, Index>
              : StringValue<IndexAt<IndexAt<T, Head>, Index>, Rest>
        : IndexAt<T, Path>;

/**
 * The type at `Path` in `T`.
 *
 * A wide `string` or `number` path resolves to `unknown`. A literal dot path
 * such as `"a.b"` or `"a[0].b"` resolves to the property type.
 */
export type PathValue<
    T,
    Path extends string | readonly PathSegment[],
> = Path extends readonly PathSegment[]
    ? SegmentsValue<T, Path>
    : Path extends string
      ? StringValue<T, Path>
      : unknown;

type BuildFromPath<T, Path extends string> = string extends Path
    ? PartialDeep<T>
    : Path extends `${infer Head}.${infer Rest}`
      ? Head extends keyof T
          ? { [Key in Head]: BuildFromPath<T[Head], Rest> }
          : PartialDeep<T>
      : Path extends keyof T
        ? { [Key in Path]: T[Path] }
        : PartialDeep<T>;

type UnionToIntersection<Union> = (
    Union extends unknown ? (value: Union) => void : never
) extends (value: infer Intersection) => void
    ? Intersection
    : never;

/**
 * `T` narrowed to the given string paths.
 *
 * Non-string paths fall back to a deep partial of `T`.
 */
export type PickDeep<T, PathsList extends readonly ObjectPath[]> =
    Extract<PathsList[number], string> extends never
        ? PartialDeep<T>
        : UnionToIntersection<
              BuildFromPath<T, Extract<PathsList[number], string>>
          >;

/**
 * `T` with the given string paths removed at the type level.
 *
 * The runtime `omitPaths` result is wider than this helper can always express,
 * so the type is a deep partial when a path is not a plain string.
 */
export type OmitDeep<
    T,
    PathsList extends readonly ObjectPath[],
> = PathsList extends readonly ObjectPath[] ? PartialDeep<T> : never;
