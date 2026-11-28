/**
 * Digest name accepted by `isHash`.
 *
 * The check is the hexadecimal length for that algorithm. It does not
 * compute a digest.
 */
export type HashAlgorithm =
    | "md5"
    | "sha1"
    | "sha224"
    | "sha256"
    | "sha384"
    | "sha512"
    | "sha3-256"
    | "sha3-512";

/**
 * Options for `isHash`.
 *
 * `algorithm` is required. There is no value-only call.
 */
export interface IsHashOptions {
    /** The digest text to test. */
    value: string;
    /** Which digest length to expect. */
    algorithm: HashAlgorithm | string;
}
