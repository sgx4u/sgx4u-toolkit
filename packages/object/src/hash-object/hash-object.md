# `hashObject`

Hashes the RFC 8785 canonical form of `value`. The digest is lowercase hex. A value that cannot be canonicalized returns `undefined`.

`"fnv1a64"` returns a string. `"sha256"` returns a promise, because Web Crypto's `digest` is asynchronous.

## Import

```ts
import { hashObject } from "@sgx4u/object/hash";
```

## Signature

```ts
function hashObject(
    params: HashObjectParams & { algorithm: "sha256" },
): Promise<string | undefined>;

function hashObject(
    params: HashObjectParams & { algorithm?: "fnv1a64" },
): string | undefined;

function hashObject(
    params: HashObjectParams,
): string | undefined | Promise<string | undefined>;
```

```ts
interface HashObjectParams {
    value: unknown;
    algorithm?: "fnv1a64" | "sha256"; // default "fnv1a64"
}
```

## Algorithms

`"fnv1a64"` is FNV-1a over the UTF-8 bytes of the canonical text. The offset basis is `0xcbf29ce484222325` and the prime is `0x100000001b3`. The hash is masked to 64 bits and written as 16 hex characters. It is a checksum, not a cryptographic digest.

`"sha256"` calls `globalThis.crypto.subtle.digest("SHA-256", bytes)` and writes 64 hex characters. The return type is `Promise<string | undefined>` even when the value is not JSON: the promise resolves to `undefined`. If `crypto.subtle.digest` is missing, the promise resolves to `undefined` and does not throw.

An unknown algorithm string throws `RangeError`, so a typo is visible. Any other algorithm value, such as a number, returns `undefined`.

Two objects with the same JSON data and different key order have the same digest, because the canonical form sorts keys.

## Examples

```ts
hashObject({ value: null });
// "5b9bc4ba528108e4"

hashObject({ value: { b: 1, a: 2 } });
hashObject({ value: { a: 2, b: 1 } });
// the same 16 character digest

await hashObject({ value: null, algorithm: "sha256" });
// 64 lowercase hex characters
```

## Edge cases

| Call                                                    | Result                   |
| ------------------------------------------------------- | ------------------------ |
| `{ value: Number.NaN }`                                 | `undefined`              |
| `{ value: Number.NaN, algorithm: "sha256" }`            | a promise of `undefined` |
| `algorithm: "md5"`                                      | throws `RangeError`      |
| `algorithm: 1`                                          | `undefined`              |
| SubtleCrypto is missing and the algorithm is `"sha256"` | a promise of `undefined` |
| `params` is not a plain object                          | throws `TypeError`       |
