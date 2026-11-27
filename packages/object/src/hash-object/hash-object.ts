import { describeReceived } from "../utils/describe-received.utils.js";
import { isPlainObjectValue } from "../utils/value-kind.utils.js";
import { canonicalizeJSON } from "../canonicalize-json/canonicalize-json.js";
import type { HashObjectParams } from "./hash-object.types.js";

const fnvOffsetBasis = 0xcbf29ce484222325n;
const fnvPrime = 0x100000001b3n;
const fnvMask = 0xffffffffffffffffn;

interface DigestSubtle {
    digest(algorithm: string, data: Uint8Array): Promise<ArrayBuffer>;
}

interface HashObjectInput {
    value: unknown;
    algorithm?: unknown;
}

/**
 * Hashes the RFC 8785 canonical form of `value`.
 *
 * `"sha256"` uses `globalThis.crypto.subtle.digest`. That API is
 * asynchronous, so this algorithm returns `Promise<string | undefined>`
 * instead of a string. When SubtleCrypto is missing, the promise resolves to
 * `undefined` and does not throw.
 *
 * `"fnv1a64"` is FNV-1a over the UTF-8 bytes of the canonical text. The
 * offset basis is `0xcbf29ce484222325` and the prime is `0x100000001b3`. The
 * hash is masked to 64 bits. It is a checksum, not a cryptographic digest.
 * Omitted `algorithm` selects `"fnv1a64"` and returns a string.
 *
 * Both digests are lowercase hex: 16 characters for FNV-1a 64, 64 characters
 * for SHA-256. A value that cannot be canonicalized returns `undefined`, or
 * a promise of `undefined` for SHA-256. An unknown algorithm string throws
 * `RangeError`. Any other algorithm value returns `undefined`.
 *
 * @param params - The value and the algorithm.
 * @returns The hex digest. SHA-256 returns a promise.
 * @throws {TypeError} When `params` is not a plain object.
 * @throws {RangeError} When `algorithm` is a string other than `"fnv1a64"` or `"sha256"`.
 * @example
 * hashObject({ value: { b: 1, a: 2 } });
 */
export function hashObject(
    params: HashObjectParams & { algorithm: "sha256" },
): Promise<string | undefined>;
/**
 * @param params - The value, with FNV-1a 64 selected or omitted.
 */
export function hashObject(
    params: HashObjectParams & { algorithm?: "fnv1a64" },
): string | undefined;
/**
 * @param params - The value and an algorithm that is not known statically.
 */
export function hashObject(
    params: HashObjectParams,
): string | undefined | Promise<string | undefined>;
/**
 * @param params - The value and the algorithm, checked at runtime.
 */
export function hashObject(
    params: HashObjectInput,
): string | undefined | Promise<string | undefined> {
    if (!isPlainObjectValue(params)) {
        throw new TypeError(
            `\`params\` must be a plain object; received ${describeReceived(params)}.`,
        );
    }
    const algorithm = params.algorithm;
    if (algorithm === undefined || algorithm === "fnv1a64") {
        return fnv1a64Hex(canonicalizeJSON(params.value));
    }
    if (algorithm === "sha256") {
        return sha256Hex(canonicalizeJSON(params.value));
    }
    if (typeof algorithm === "string") {
        throw new RangeError(
            `\`algorithm\` must be "fnv1a64" or "sha256"; received ${describeReceived(algorithm)}.`,
        );
    }
    return undefined;
}

/**
 * The FNV-1a 64 hex digest of canonical JSON.
 *
 * @param canonical - Canonical JSON, or `undefined` when the value is not JSON.
 * @returns 16 lowercase hex characters, or `undefined`.
 */
function fnv1a64Hex(canonical: string | undefined): string | undefined {
    if (canonical === undefined) {
        return undefined;
    }
    let hash = fnvOffsetBasis;
    for (const byte of utf8Bytes(canonical)) {
        hash ^= BigInt(byte);
        hash = (hash * fnvPrime) & fnvMask;
    }
    return hash.toString(16).padStart(16, "0");
}

/**
 * The SHA-256 hex digest of canonical JSON.
 *
 * @param canonical - Canonical JSON, or `undefined` when the value is not JSON.
 * @returns A promise of 64 lowercase hex characters, or `undefined`.
 */
async function sha256Hex(
    canonical: string | undefined,
): Promise<string | undefined> {
    if (canonical === undefined) {
        return undefined;
    }
    const subtle = readSubtleDigest();
    if (subtle === undefined) {
        return undefined;
    }
    const digest = await subtle.digest("SHA-256", utf8Bytes(canonical));
    let hex = "";
    for (const byte of new Uint8Array(digest)) {
        hex += byte.toString(16).padStart(2, "0");
    }
    return hex;
}

/**
 * Reads Web Crypto when `digest` is a function.
 *
 * @returns The subtle interface, or `undefined` when it is missing.
 */
function readSubtleDigest(): DigestSubtle | undefined {
    const cryptoObject = (globalThis as { crypto?: { subtle?: DigestSubtle } })
        .crypto;
    const subtle = cryptoObject?.subtle;
    if (subtle === undefined || typeof subtle.digest !== "function") {
        return undefined;
    }
    return subtle;
}

/**
 * UTF-8 bytes of `text`.
 *
 * `TextEncoder` is the platform encoder. Hashing uses these bytes, not
 * UTF-16 code units.
 *
 * @param text - Canonical JSON text.
 * @returns The UTF-8 bytes.
 */
function utf8Bytes(text: string): Uint8Array {
    const Encoder = (
        globalThis as {
            TextEncoder: new () => { encode(input: string): Uint8Array };
        }
    ).TextEncoder;
    return new Encoder().encode(text);
}
