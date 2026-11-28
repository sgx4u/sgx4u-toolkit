---
"@sgx4u/object": minor
---

Summary: First release of @sgx4u/object, an immutable object API for paths, merge, clone, equality, and safe JSON.

Added: `getPath` reads a value at a path and returns the default when the path is missing. `setPath`, `mergeDeep`, `cloneDeep`, and `parseJSON` return a new value and leave the input unchanged. `__proto__`, `prototype`, and `constructor` are skipped on write unless `prototypeKeys` is `"keep"` or `"throw"`.

Added: `createObject` returns the root functions with `config` bound in. A field on a later call replaces the config. Separate instances do not share state.

Added: `createJSONPatch` builds an RFC 6902 patch from two values. `@sgx4u/object/json-patch` also applies that patch and an RFC 7396 merge patch. `createObjectJSONPatch` binds the same config shape.

Added: `canonicalizeJSON` writes RFC 8785 canonical JSON. `hashObject` returns a lowercase hex digest. `fnv1a64` is synchronous and is not a cryptographic hash. `sha256` returns a promise. `createObjectHash` validates the shared config.
