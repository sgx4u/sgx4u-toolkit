---
"@sgx4u/object": minor
---

Summary: First release of @sgx4u/object, an immutable object API for paths, merge, clone, equality, and safe JSON.

Added: Root functions such as `getPath`, `setPath`, `mergeDeep`, `cloneDeep`, `isEqual`, `convertKeys`, and `parseJSON` return a new value and leave the input unchanged. `__proto__`, `prototype`, and `constructor` are skipped on write unless `prototypeKeys` is `"keep"` or `"throw"`.

Added: `createObject(config)` returns those functions with the config bound in. A field on a later call replaces the config. Separate instances do not share state.

Added: `@sgx4u/object/json-patch` reads RFC 6901 pointers and applies RFC 6902 JSON Patch and RFC 7396 JSON Merge Patch. `createObjectJSONPatch(config)` binds the same style of config.

Added: `@sgx4u/object/hash` canonicalizes JSON with RFC 8785. `hashObject` returns a lowercase hex digest. `fnv1a64` is synchronous and is not a cryptographic hash. `sha256` uses Web Crypto and returns a promise. `createObjectHash(config)` validates the shared config.
