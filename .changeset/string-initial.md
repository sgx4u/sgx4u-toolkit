---
"@sgx4u/string": minor
---

Summary: Grapheme-safe string helpers for case, width, validation, encoding, and formatting, with no runtime dependencies.

Added: `createString` binds locale, unit, case, slug, truncation, mask, collation, and template defaults for the 212 root functions.
`transliterate`, `slugifyTransliterated`, and `createTransliterate` map Latin, Greek, Cyrillic, Arabic, Hebrew, and Devanagari on `@sgx4u/string/transliterate`.
`escapeHTMLEntities`, `unescapeHTMLEntities`, and `createHTMLEntities` encode named entities on `@sgx4u/string/html-entities`. The default level is HTML5.
`isPostalCode`, `listPostalCodeCountries`, `isVAT`, and `listVATCountries` check postal codes and VAT numbers on `@sgx4u/string/validators/locale`.
