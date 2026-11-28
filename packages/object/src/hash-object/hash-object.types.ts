/**
 * Digests `hashObject` can compute.
 *
 * `"fnv1a64"` is a 64-bit FNV-1a checksum. `"sha256"` is SHA-256 from Web
 * Crypto and the result is a promise.
 */
export type HashAlgorithm = "fnv1a64" | "sha256";

/**
 * Arguments for `hashObject`.
 */
export interface HashObjectParams {
    /** The value to hash. It must be JSON. */
    value: unknown;

    /**
     * The digest algorithm.
     *
     * @defaultValue `"fnv1a64"`
     */
    algorithm?: HashAlgorithm;
}
