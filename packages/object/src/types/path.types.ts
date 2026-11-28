/**
 * One step in an object path. A number addresses an array index.
 */
export type PathSegment = string | number;

/**
 * A path into an object.
 *
 * A string is parsed with `pathStyle`. A number is a single array index.
 * An array is used as-is: `["a.b", 0]` is the key `"a.b"` and then index `0`.
 */
export type ObjectPath = string | number | readonly PathSegment[];

/**
 * How a string path is parsed.
 *
 * `"dot"` reads `a.b[0].c`. `"json-pointer"` reads RFC 6901 pointers.
 */
export type PathStyle = "dot" | "json-pointer";
