<a id="readme-top"></a>

<div align="center">
    <a href="https://github.com/sgx4u/sgx4u-toolkit">
        <img src="https://github.com/sgx4u/sgx4u-toolkit/blob/develop/logo.svg?raw=true" width="75" alt="SGX4U" />
    </a>

<h1 align="center">🌟 @sgx4u/string 🌟</h1>

<h3 align="center">Grapheme-safe string helpers with no runtime dependencies.</h3>

<p align="center">
    <a href="../../.github/workflows/ci.yml"><img src="https://img.shields.io/github/actions/workflow/status/sgx4u/sgx4u-toolkit/ci.yml?branch=develop&style=for-the-badge&label=ci&labelColor=353535" alt="ci" /></a>
    <a href="../../LICENSE"><img src="https://img.shields.io/github/license/sgx4u/sgx4u-toolkit?style=for-the-badge&labelColor=353535&color=4f46e5" alt="License: MIT" /></a>
    <a href="./package.json"><img src="https://img.shields.io/badge/node-%3E%3D22.12-339933?style=for-the-badge&logo=nodedotjs&logoColor=white&labelColor=353535" alt="Node &gt;=22.12" /></a>
    <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
</p>

<p align="center">Part of <a href="../../README.md">@sgx4u/toolkit</a>.</p>
</div>

<br />

<h2 id="about">💫 About</h2>

`@sgx4u/string` works in graphemes by default. Length, slice, pad, truncate, and case conversion use `Intl.Segmenter` unless a call asks for code points or code units. Invalid input returns `undefined`. An `is*` check returns `false`. A throw is reserved for a wrong option type or a number or enum that would make `undefined` look like a successful empty result.

One value is passed directly. Several values go in one flat object, with options spread in that same object. `toCamelCase("foo bar")` and `toCamelCase({ value: "foo bar", locale: "en" })` are the two forms. The package does not take `(value, options)`.

The root entry stays small. Transliteration tables, the named HTML entity table, and country-specific postal and VAT checks live on subpaths.

The complete parameter table is [FUNCTIONS.md](./FUNCTIONS.md).

Experimental (`0.x`). Breaking changes may land in minor versions until 1.0.0.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br />

<h2 id="installation">📥 Installation</h2>

```sh
pnpm add @sgx4u/string       # pnpm
npm install @sgx4u/string    # npm
yarn add @sgx4u/string       # yarn
```

Requires Node `>=22.12`. The package publishes ESM (`import`) and CommonJS (`require`).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br />

<h2 id="usage">💡 Usage</h2>

```ts
import { createString, slugify, toCamelCase } from "@sgx4u/string";

toCamelCase("XMLHttpRequest"); // "xmlHttpRequest"
slugify("Café au lait"); // "cafe-au-lait"

const strings = createString({ locale: "tr-TR" });
strings.toLowerCase("I"); // "ı"
strings.toLowerCase({ value: "I", locale: "en" }); // "i"
```

```ts
import { transliterate } from "@sgx4u/string/transliterate";
import { escapeHTMLEntities } from "@sgx4u/string/html-entities";
import { isPostalCode } from "@sgx4u/string/validators/locale";

transliterate({ value: "Über", locale: "de" }); // "Ueber"
escapeHTMLEntities("<a>"); // "&lt;a&gt;"
isPostalCode({ value: "560001", country: "IN" }); // true
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br />

<h2 id="create-string">🏭 createString</h2>

`createString(config)` returns the root functions with `config` bound in. A field on one call overrides the bound default. Two instances do not share state. There is no global setter.

`createTransliterate` and `createHTMLEntities` take the same config shape and do not read a root instance. `/validators/locale` has no factory.

| Option                     | Default                       |
| -------------------------- | ----------------------------- |
| `locale`                   | the runtime locale            |
| `unit`                     | `"grapheme"`                  |
| `keepConsecutiveUppercase` | `false`                       |
| `mergeAmbiguousCharacters` | `false`                       |
| `titleCaseStyle`           | `"capitalize-every-word"`     |
| `smallWords`               | the list for `titleCaseStyle` |
| `slugifySeparator`         | `"-"`                         |
| `slugifyLowerCase`         | `true`                        |
| `truncationOmission`       | `"…"` (U+2026)                |
| `truncationLocation`       | `"end"`                       |
| `maskCharacter`            | `"*"`                         |
| `unmaskedStartLength`      | `0`                           |
| `unmaskedEndLength`        | `0`                           |
| `collatorSensitivity`      | `"variant"`                   |
| `numericCollation`         | `false`                       |
| `normalizeForm`            | `"NFC"`                       |
| `wordsPerMinute`           | `200`                         |
| `templatePattern`          | `"curly"`                     |

An unknown key throws `RangeError`. An empty locale throws `RangeError`. A locale `Intl` does not recognize is kept, and `Intl` falls back.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br />

<h2 id="functions">📘 Functions</h2>

### Predicates

- [`isAlpha`](./src/is-alpha/is-alpha.md) Reports whether every grapheme in `value` is a letter.
- [`isAlphanumeric`](./src/is-alphanumeric/is-alphanumeric.md) Reports whether every grapheme is a letter or a decimal digit.
- [`isASCII`](./src/is-ascii/is-ascii.md) Reports whether every code point in `value` is in the range 0 through 127.
- [`isBase32`](./src/is-base32/is-base32.md) Reports whether `value` is RFC 4648 Base32.
- [`isBase64`](./src/is-base64/is-base64.md) Reports whether `value` is Base64 text.
- [`isBase64URL`](./src/is-base64-url/is-base64-url.md) Reports whether `value` is URL-safe Base64.
- [`isBIC`](./src/is-bic/is-bic.md) Reports whether `value` is a BIC, also called a SWIFT code.
- [`isBlank`](./src/is-blank/is-blank.md) Unicode White_Space, including a non-breaking space. U+FEFF is not included. _/ const unicodeWhitespaceExpression = /^\p{White_Space}_$/u;
- [`isCapitalized`](./src/is-capitalized/is-capitalized.md) Reports whether the first grapheme of `value` is an uppercase letter.
- [`isCreditCard`](./src/is-credit-card/is-credit-card.md) Reports whether `value` is a payment-card number.
- [`isCUID`](./src/is-cuid/is-cuid.md) Reports whether `value` is a CUID.
- [`isCUID2`](./src/is-cuid2/is-cuid2.md) Reports whether `value` is a CUID2.
- [`isDataURI`](./src/is-data-uri/is-data-uri.md) Reports whether `value` is a `data:` URL.
- [`isE164`](./src/is-e164/is-e164.md) Reports whether `value` has an E.164 shape.
- [`isEAN`](./src/is-ean/is-ean.md) Reports whether `value` is an EAN-8 or EAN-13 code.
- [`isEmail`](./src/is-email/is-email.md) Resolved email options after defaults are applied. / interface EmailCheckOptions { /** Whether `Name <user@domain>` is accepted. _/ allowDisplayName: boolean; /_* Whether the domain needs a dotted top-level label. _/ requireTopLevelDomain: boolean; /_* Whether `[IPv4]` and `[IPv6]` domains are accepted. _/ allowIPDomain: boolean; /_* Whether the local part may contain Unicode letters and numbers. */ allowUTF8LocalPart: boolean; }
- [`isEmptyString`](./src/is-empty-string/is-empty-string.md) Reports whether `value` is exactly the empty string.
- [`isFQDN`](./src/is-fqdn/is-fqdn.md) Resolved FQDN options after defaults are applied. / interface FQDNCheckOptions { /** Whether a dotted top-level label is required. _/ requireTopLevelDomain: boolean; /_* Whether `_` may appear in a label. _/ allowUnderscore: boolean; /_* Whether a leading `*.` label is accepted. */ allowWildcard: boolean; }
- [`isHash`](./src/is-hash/is-hash.md) Reports whether `value` is a hexadecimal digest of `algorithm`.
- [`isHexColor`](./src/is-hex-color/is-hex-color.md) Resolved hex-color options after defaults are applied. / interface HexColorCheckOptions { /** Whether 3-digit and 4-digit forms are accepted. _/ allowShort: boolean; /_* Whether 4-digit and 8-digit forms are accepted. */ allowAlpha: boolean; }
- [`isHexadecimal`](./src/is-hexadecimal/is-hexadecimal.md) Reports whether `value` is hexadecimal digits with no `0x` prefix.
- [`isHSLColor`](./src/is-hsl-color/is-hsl-color.md) Reports whether `value` is a CSS Color Level 4 `hsl()` or `hsla()` color.
- [`isIBAN`](./src/is-iban/is-iban.md) Reports whether `value` is an IBAN.
- [`isIP`](./src/is-ip/is-ip.md) Reports whether `value` is an IPv4 or IPv6 address.
- [`isIPRange`](./src/is-ip-range/is-ip-range.md) Reports whether `value` is CIDR notation.
- [`isIPv4`](./src/is-ipv4/is-ipv4.md) Reports whether `value` is a dotted IPv4 address.
- [`isIPv6`](./src/is-ipv6/is-ipv6.md) Reports whether `value` is an IPv6 address.
- [`isISBN`](./src/is-isbn/is-isbn.md) Reports whether `value` is an ISBN-10 or ISBN-13.
- [`isISSN`](./src/is-issn/is-issn.md) Reports whether `value` is an ISSN.
- [`isJSON`](./src/is-json/is-json.md) Reports whether `value` is text that `JSON.parse` accepts.
- [`isJWT`](./src/is-jwt/is-jwt.md) Reports whether `value` has the three-part shape of a JSON Web Token.
- [`isLatLong`](./src/is-lat-long/is-lat-long.md) Reports whether `value` is a `latitude, longitude` pair.
- [`isLocaleIdentifier`](./src/is-locale-identifier/is-locale-identifier.md) Reports whether `value` is a locale identifier `Intl` accepts.
- [`isLuhn`](./src/is-luhn/is-luhn.md) Reports whether `value` passes the Luhn check.
- [`isMACAddress`](./src/is-mac-address/is-mac-address.md) Reports whether `value` is a 48-bit MAC address.
- [`isMailtoURI`](./src/is-mailto-uri/is-mailto-uri.md) Reports whether `value` is a `mailto:` URL with an address-shaped path.
- [`isMimeType`](./src/is-mime-type/is-mime-type.md) Reports whether `value` is a media type of `type/subtype`.
- [`isMongoObjectId`](./src/is-mongo-object-id/is-mongo-object-id.md) Reports whether `value` is a MongoDB ObjectId.
- [`isNanoID`](./src/is-nano-id/is-nano-id.md) Resolved NanoID options after defaults are applied. / interface NanoIDCheckOptions { /** Expected number of code points. _/ length: number; /_* Characters the identifier may use. */ alphabet: string; }
- [`isNonEmptyString`](./src/is-non-empty-string/is-non-empty-string.md) Reports whether `value` is a string with at least one UTF-16 code unit. Whitespace counts as content.
- [`isNormalized`](./src/is-normalized/is-normalized.md) Reports whether `value` is already in the requested normalization form.
- [`isNumericString`](./src/is-numeric-string/is-numeric-string.md) Reports whether `value` is an ASCII number.
- [`isPlural`](./src/is-plural/is-plural.md) Reports whether an English noun is plural.
- [`isPort`](./src/is-port/is-port.md) Reports whether `value` is a TCP or UDP port as a digit string.
- [`isRGBColor`](./src/is-rgb-color/is-rgb-color.md) Reports whether `value` is a CSS Color Level 4 `rgb()` or `rgba()` color.
- [`isSemVer`](./src/is-sem-ver/is-sem-ver.md) Reports whether `value` is a Semantic Versioning 2.0.0 version.
- [`isSingular`](./src/is-singular/is-singular.md) Reports whether an English noun is singular.
- [`isSlug`](./src/is-slug/is-slug.md) Reports whether `value` is a slug.
- [`isString`](./src/is-string/is-string.md) Reports whether `value` is a string primitive, including an empty string.
- [`isStrongPassword`](./src/is-strong-password/is-strong-password.md) Resolved password-policy options after defaults are applied. / interface PasswordCheckOptions { /** Minimum code-point count. _/ minimumLength: number; /_* Whether a lowercase letter is required. _/ requireLowercase: boolean; /_* Whether an uppercase letter is required. _/ requireUppercase: boolean; /_* Whether a decimal digit is required. _/ requireNumber: boolean; /_* Whether a symbol is required. */ requireSymbol: boolean; }
- [`isULID`](./src/is-ulid/is-ulid.md) Reports whether `value` is a ULID.
- [`isURL`](./src/is-url/is-url.md) Resolved URL options after defaults are applied. / interface URLCheckOptions { /** Protocol names without a trailing colon. _/ protocols: readonly string[]; /_* Whether the input must already contain a protocol. _/ requireProtocol: boolean; /_* Whether a dotted top-level label is required. _/ requireTopLevelDomain: boolean; /_* Whether `localhost` is accepted. _/ allowLocalhost: boolean; /_* Whether a username or password is accepted. _/ allowCredentials: boolean; /_* Whether an IP hostname is accepted. */ allowIP: boolean; }
- [`isUUID`](./src/is-uuid/is-uuid.md) Resolved UUID options after defaults are applied. / interface UUIDCheckOptions { /** Version selector, including `"any"`, `"nil"`, and `"max"`. _/ version: UUIDVersion; /_* Whether `urn:uuid:` may appear in front of the identifier. */ allowURN: boolean; }
- [`isWellFormedString`](./src/is-well-formed-string/is-well-formed-string.md) Reports whether `value` is a well-formed string of UTF-16 code units.

### Case checks

- [`isCamelCase`](./src/is-camel-case/is-camel-case.md) Punctuation or whitespace. Camel case has none. */ const separatorExpression = /[\p{P}\p{Z}\s]/u;
- [`isConstantCase`](./src/is-constant-case/is-constant-case.md) Reports whether `value` is already constantCase.
- [`isKebabCase`](./src/is-kebab-case/is-kebab-case.md) Reports whether `value` is already kebabCase.
- [`isLowerCase`](./src/is-lower-case/is-lower-case.md) Reports whether `value` is already in lower case and contains a cased letter.
- [`isPascalCase`](./src/is-pascal-case/is-pascal-case.md) Punctuation or whitespace. Pascal case has none. */ const separatorExpression = /[\p{P}\p{Z}\s]/u;
- [`isSnakeCase`](./src/is-snake-case/is-snake-case.md) Reports whether `value` is already snakeCase.
- [`isTrainCase`](./src/is-train-case/is-train-case.md) Reports whether `value` is already trainCase.
- [`isUpperCase`](./src/is-upper-case/is-upper-case.md) Reports whether `value` is already in upper case and contains a cased letter.

### Case conversion

- [`capitalize`](./src/capitalize/capitalize.md) Uppercases the first grapheme of `value`.
- [`convertCase`](./src/convert-case/convert-case.md) Converts `value` to the named case.
- [`humanize`](./src/humanize/humanize.md) Turns a token into a short sentence-style phrase.
- [`swapCase`](./src/swap-case/swap-case.md) Swaps the case of every cased character in `value`.
- [`toCamelCase`](./src/to-camel-case/to-camel-case.md) Converts `value` to camel case (`fooBar`).
- [`toCapitalCase`](./src/to-capital-case/to-capital-case.md) Converts `value` to capital case.
- [`toConstantCase`](./src/to-constant-case/to-constant-case.md) Converts `value` to constant case (`FOO_BAR`).
- [`toDotCase`](./src/to-dot-case/to-dot-case.md) Converts `value` to dot case (`foo.bar`).
- [`toKebabCase`](./src/to-kebab-case/to-kebab-case.md) Converts `value` to kebab case (`foo-bar`).
- [`toLowerCase`](./src/to-lower-case/to-lower-case.md) Returns `value` converted with `toLocaleLowerCase`.
- [`toNoCase`](./src/to-no-case/to-no-case.md) Converts `value` to space-separated lower case.
- [`toPascalCase`](./src/to-pascal-case/to-pascal-case.md) Converts `value` to pascal case (`FooBar`).
- [`toPascalSnakeCase`](./src/to-pascal-snake-case/to-pascal-snake-case.md) Converts `value` to pascal snake case (`Foo_Bar`).
- [`toPathCase`](./src/to-path-case/to-path-case.md) Converts `value` to path case (`foo/bar`).
- [`toSentenceCase`](./src/to-sentence-case/to-sentence-case.md) Converts `value` to sentence case.
- [`toSnakeCase`](./src/to-snake-case/to-snake-case.md) Converts `value` to snake case (`foo_bar`).
- [`toTitleCase`](./src/to-title-case/to-title-case.md) Converts `value` to title case.
- [`toTrainCase`](./src/to-train-case/to-train-case.md) Converts `value` to train case (`Foo-Bar`), the HTTP header form.
- [`toUpperCase`](./src/to-upper-case/to-upper-case.md) Returns `value` converted with `toLocaleUpperCase`.
- [`uncapitalize`](./src/uncapitalize/uncapitalize.md) Lowercases the first grapheme of `value` and leaves the rest unchanged.

### Shape

- [`collapseWhitespace`](./src/collapse-whitespace/collapse-whitespace.md) Whitespace at either end. U+FEFF is not whitespace. */ const edgeWhitespaceExpression = /^\p{White_Space}+|\p{White_Space}+$/gu;
- [`dedent`](./src/dedent/dedent.md) Removes the common leading indent and one leading and trailing newline.
- [`indent`](./src/indent/indent.md) Prefixes every non-empty line with `character` repeated `count` times.
- [`pad`](./src/pad/pad.md) Pads `value` out to `maximumLength` units.
- [`padEnd`](./src/pad-end/pad-end.md) Pads `value` on the right until it reaches `maximumLength` units.
- [`padStart`](./src/pad-start/pad-start.md) Pads `value` on the left until it reaches `maximumLength` units.
- [`quoteString`](./src/quote-string/quote-string.md) Wraps `value` in quotes and escapes that quote and backslashes inside it.
- [`stripIndent`](./src/strip-indent/strip-indent.md) Removes the common indent and keeps a first line that has no indent.
- [`surround`](./src/surround/surround.md) Wraps `value` with `prefix` and `suffix`.
- [`trim`](./src/trim/trim.md) Trims graphemes from both ends of `value`.
- [`trimEnd`](./src/trim-end/trim-end.md) Trims graphemes from the end of `value`.
- [`trimStart`](./src/trim-start/trim-start.md) Trims graphemes from the start of `value`.
- [`unquoteString`](./src/unquote-string/unquote-string.md) Removes one matching surrounding quote pair and unescapes it.
- [`unwrapText`](./src/unwrap-text/unwrap-text.md) Joins wrapped lines back into paragraphs.
- [`wrapText`](./src/wrap-text/wrap-text.md) Wraps `value` onto lines of at most `maximumWidth` display columns.

### Slice and search

- [`atString`](./src/at-string/at-string.md) Returns one unit at `index`.
- [`countBytes`](./src/count-bytes/count-bytes.md) Returns the UTF-8 byte length of `value`.
- [`countLines`](./src/count-lines/count-lines.md) Counts lines with the same split as `splitLines`.
- [`countOccurrences`](./src/count-occurrences/count-occurrences.md) Counts how many times `search` occurs in `value`.
- [`countSentences`](./src/count-sentences/count-sentences.md) Counts sentences with the same split as `splitSentences`.
- [`countWords`](./src/count-words/count-words.md) Counts words with the same split as `splitWords`.
- [`drop`](./src/drop/drop.md) Returns part of `value` measured in `unit`.
- [`dropLast`](./src/drop-last/drop-last.md) Returns part of `value` measured in `unit`.
- [`endsWith`](./src/ends-with/ends-with.md) Reports whether `value` ends with `search` at `position`.
- [`ensurePrefix`](./src/ensure-prefix/ensure-prefix.md) Returns `value` with `prefix` applied once.
- [`ensureSuffix`](./src/ensure-suffix/ensure-suffix.md) Returns `value` with `suffix` applied once.
- [`getStringLength`](./src/get-string-length/get-string-length.md) Counts `value` in the chosen unit.
- [`getSubstringAfter`](./src/get-substring-after/get-substring-after.md) Returns the text around `separator`.
- [`getSubstringAfterLast`](./src/get-substring-after-last/get-substring-after-last.md) Returns the text around `separator`.
- [`getSubstringBefore`](./src/get-substring-before/get-substring-before.md) Returns the text around `separator`.
- [`getSubstringBeforeLast`](./src/get-substring-before-last/get-substring-before-last.md) Returns the text around `separator`.
- [`getSubstringBetween`](./src/get-substring-between/get-substring-between.md) Returns the text between the first `start` and the next `end`.
- [`includes`](./src/includes/includes.md) Reports whether `value` contains `search`.
- [`includesAll`](./src/includes-all/includes-all.md) Reports whether `value` contains every string in `searches`.
- [`includesAny`](./src/includes-any/includes-any.md) Reports whether `value` contains any string in `searches`.
- [`indexOfMatch`](./src/index-of-match/index-of-match.md) Returns the unit index of the first `search`, or -1 when it is missing.
- [`insertString`](./src/insert-string/insert-string.md) Inserts `insertion` at `index` in the chosen unit.
- [`lastIndexOfMatch`](./src/last-index-of-match/last-index-of-match.md) Returns the last unit index of `search`, or -1 when it is missing.
- [`matches`](./src/matches/matches.md) Reports whether `value` matches `pattern`.
- [`removePrefix`](./src/remove-prefix/remove-prefix.md) Returns `value` with `prefix` applied once.
- [`removeSuffix`](./src/remove-suffix/remove-suffix.md) Returns `value` with `suffix` applied once.
- [`repeatString`](./src/repeat-string/repeat-string.md) Repeats `value` `count` times.
- [`replaceAllOccurrences`](./src/replace-all-occurrences/replace-all-occurrences.md) Replaces every match of `pattern` with `replacement`.
- [`replaceRange`](./src/replace-range/replace-range.md) Replaces the units from `start` to `end` with `replacement`.
- [`reverseString`](./src/reverse-string/reverse-string.md) Reverses `value` in the chosen unit.
- [`sliceString`](./src/slice-string/slice-string.md) Returns a slice of `value` in the chosen unit.
- [`splitLines`](./src/split-lines/split-lines.md) Splits `value` on `\n`, `\r\n`, and `\r`.
- [`splitOnce`](./src/split-once/split-once.md) Splits `value` on the first or last `separator`.
- [`splitSentences`](./src/split-sentences/split-sentences.md) Splits `value` into sentences with `Intl.Segmenter` and trims each one.
- [`splitWords`](./src/split-words/split-words.md) Splits `value` into words for case conversion.
- [`startsWith`](./src/starts-with/starts-with.md) Reports whether `value` starts with `search` at `position`.
- [`take`](./src/take/take.md) Returns part of `value` measured in `unit`.
- [`takeLast`](./src/take-last/take-last.md) Returns part of `value` measured in `unit`.

### Compare

- [`compareNatural`](./src/compare-natural/compare-natural.md) Compares two strings with numeric collation.
- [`compareStrings`](./src/compare-strings/compare-strings.md) Compares two strings with `Intl.Collator`.
- [`equalsIgnoreCase`](./src/equals-ignore-case/equals-ignore-case.md) Reports whether two strings are equal ignoring case.
- [`equalsNormalized`](./src/equals-normalized/equals-normalized.md) Reports whether two strings are equal after Unicode normalization.
- [`equalsString`](./src/equals-string/equals-string.md) Reports whether two strings are equal under `Intl.Collator`.

### Width and truncation

- [`getDisplayWidth`](./src/get-display-width/get-display-width.md) Returns the monospaced columns `value` occupies.
- [`getExcerpt`](./src/get-excerpt/get-excerpt.md) Excerpt options after defaults are applied. / interface ExcerptOptions { /** Maximum graphemes, including the omission. _/ maximumLength: number; /_* Whether to retreat to a word boundary. _/ breakOnWord: boolean; /_* Text appended when the value is shortened. */ omission: string; }
- [`hasFullWidthCharacter`](./src/has-full-width-character/has-full-width-character.md) Reports whether `value` contains a wide or fullwidth character.
- [`hasHalfWidthCharacter`](./src/has-half-width-character/has-half-width-character.md) Reports whether `value` contains a halfwidth character.
- [`stripANSI`](./src/strip-ansi/strip-ansi.md) Removes ANSI escape sequences from `value`.
- [`truncate`](./src/truncate/truncate.md) Shortens `value` to `maximumLength` units and adds an omission.
- [`truncateToBytes`](./src/truncate-to-bytes/truncate-to-bytes.md) Shortens `value` so its UTF-8 encoding is at most `maximumBytes`.
- [`truncateToDisplayWidth`](./src/truncate-to-display-width/truncate-to-display-width.md) Shortens `value` so its display width is at most `maximumWidth`.

### Slug and filename

- [`normalizeUnicode`](./src/normalize-unicode/normalize-unicode.md) Returns `value` in the requested Unicode normalization form.
- [`removeDiacritics`](./src/remove-diacritics/remove-diacritics.md) Removes diacritics and maps a few Latin letters to ASCII.
- [`slugify`](./src/slugify/slugify.md) Settings after defaults and checks have been applied. / interface SlugifySettings { /** Separator between letter and digit runs. _/ separator: string; /_* Whether the slug is lowercased. _/ lowerCase: boolean; /_* Grapheme cap, or `undefined` when the slug is not shortened. */ maximumLength: number | undefined; }
- [`toFilename`](./src/to-filename/to-filename.md) Windows device names that cannot be a file stem, ignoring case.

### Escape and strip

- [`escapeCSV`](./src/escape-csv/escape-csv.md) Quotes a CSV field when the field would otherwise split or break a line.
- [`escapeHTML`](./src/escape-html/escape-html.md) Escapes the five ASCII characters that start HTML markup.
- [`escapeJavaScriptString`](./src/escape-javascript-string/escape-javascript-string.md) Escapes `value` so it can sit inside a JavaScript or JSON string literal.
- [`escapeMarkdown`](./src/escape-markdown/escape-markdown.md) Escapes ASCII punctuation so CommonMark renders the text literally.
- [`escapeRegExp`](./src/escape-reg-exp/escape-reg-exp.md) ASCII punctuation escaped as `\xHH` when it is not already a syntax character.
- [`stripHTMLTags`](./src/strip-html-tags/strip-html-tags.md) One tag the scanner accepted. / interface ParsedTag { /** The lowercase tag name, without `<` or `/`. _/ name: string; /_* The original slice, including brackets and attributes. _/ raw: string; /_* Index just after the closing `>`. */ end: number; }
- [`unescapeHTML`](./src/unescape-html/unescape-html.md) Reverses {@link escapeHTML} and decodes numeric character references.

### Templates and sprintf

- [`formatSprintf`](./src/format-sprintf/format-sprintf.md) One specifier read from a template. / interface ParsedSpecifier { /** `"percent"` for `%%`. `"value"` for a conversion. _/ kind: "percent" | "value"; /_* The conversion letter. Absent for `%%`. _/ specifier?: string; /_* Zero-based argument index for a numbered specifier such as `%1$s`. _/ argumentIndex?: number; /_* Index just after the specifier. */ end: number; }
- [`interpolate`](./src/interpolate/interpolate.md) Settings after defaults and checks have been applied. / interface InterpolateSettings { /** Placeholder style. _/ pattern: InterpolatePattern; /_* Missing-key policy. _/ missing: InterpolateMissing; /_* Own properties copied from the caller. The object is not changed. */ values: Record<string, unknown>; }

### Inflection

- [`formatCount`](./src/format-count/format-count.md) Settings after checks have been applied. / interface FormatCountSettings { /** A finite count. _/ count: number; /_* An English locale passed to `Intl.NumberFormat`. */ locale: LocaleArgument; }
- [`getIndefiniteArticle`](./src/get-indefinite-article/get-indefinite-article.md) Returns the English indefinite article for a word.
- [`getOrdinal`](./src/get-ordinal/get-ordinal.md) Writes an English ordinal such as `1st`, `2nd`, `3rd`, or `11th`.
- [`getPluralCategory`](./src/get-plural-category/get-plural-category.md) Returns the `Intl.PluralRules` category for a count.
- [`pluralize`](./src/pluralize/pluralize.md) Settings after defaults and checks have been applied. / interface PluralizeSettings { /** A finite count. `1` selects the singular. _/ count: number; /_* An English locale. It is checked and then unused, because the rules are English. */ locale: LocaleArgument; }
- [`singularize`](./src/singularize/singularize.md) Returns the English singular of a noun.

### Masking

- [`maskCreditCard`](./src/mask-credit-card/mask-credit-card.md) Settings after defaults and checks have been applied. / interface MaskCreditCardSettings { /** The first grapheme of the mask text. _/ mask: string; /_* Digits left visible at the end. */ unmaskedEndLength: number; }
- [`maskEmail`](./src/mask-email/mask-email.md) Settings after defaults and checks have been applied. / interface MaskEmailSettings { /** The first grapheme of the mask text. _/ mask: string; /_* Visible graphemes at the start of the local part. _/ unmaskedLocalLength: number; /_* Whether the domain is copied unchanged. */ unmaskedDomain: boolean; }
- [`maskString`](./src/mask-string/mask-string.md) Settings after defaults and checks have been applied. / interface MaskStringSettings { /** The first grapheme of the caller's mask text. _/ mask: string; /_* Visible units at the start. _/ unmaskedStartLength: number; /_* Visible units at the end. _/ unmaskedEndLength: number; /_* Unit used to split `value`. */ unit: StringUnit; }

### Distance

- [`findClosestMatch`](./src/find-closest-match/find-closest-match.md) Settings after checks have been applied. / interface FindClosestMatchSettings { /** The ranking algorithm. _/ algorithm: SimilarityAlgorithm; /_* Scores below this value are skipped. _/ minimumScore: number; /_* The candidate list. Entries that are not strings are skipped. */ candidates: readonly unknown[]; }
- [`findClosestMatches`](./src/find-closest-matches/find-closest-matches.md) Settings after checks have been applied. / interface FindClosestMatchesSettings { /** The ranking algorithm. _/ algorithm: SimilarityAlgorithm; /_* Scores below this value are skipped. _/ minimumScore: number; /_* How many matches to keep. _/ limit: number; /_* The candidate list. Entries that are not strings are skipped. */ candidates: readonly unknown[]; }
- [`getDamerauLevenshteinDistance`](./src/get-damerau-levenshtein-distance/get-damerau-levenshtein-distance.md) Returns the Damerau-Levenshtein distance between two strings.
- [`getDiceCoefficient`](./src/get-dice-coefficient/get-dice-coefficient.md) Returns the Sørensen–Dice coefficient of two strings, from 0 to 1.
- [`getHammingDistance`](./src/get-hamming-distance/get-hamming-distance.md) Returns the Hamming distance between two strings of equal length.
- [`getJaroWinklerSimilarity`](./src/get-jaro-winkler-similarity/get-jaro-winkler-similarity.md) Returns the Jaro-Winkler similarity of two strings, from 0 to 1.
- [`getLevenshteinDistance`](./src/get-levenshtein-distance/get-levenshtein-distance.md) Returns the Levenshtein distance between two strings.
- [`getLongestCommonSubsequence`](./src/get-longest-common-subsequence/get-longest-common-subsequence.md) Returns the longest common subsequence of two strings.
- [`getNgrams`](./src/get-ngrams/get-ngrams.md) Settings after defaults and checks have been applied. / interface GetNgramsSettings { /** How many units each group contains. At least 1. _/ size: number; /_* The unit used to split `value`. */ unit: StringUnit; }
- [`getSimilarity`](./src/get-similarity/get-similarity.md) Returns a similarity score from 0 to 1.

### Phonetics

- [`getDoubleMetaphone`](./src/get-double-metaphone/get-double-metaphone.md) One step of the dual encoder. / interface DualStep { /** Symbol appended to the primary code. Empty when the letter is skipped. _/ primary: string; /_* Symbol appended to the secondary code. _/ secondary: string; /_* How many source letters this step consumes. */ advance: number; }
- [`getMetaphone`](./src/get-metaphone/get-metaphone.md) Returns the original Metaphone code of an English word.
- [`getSoundex`](./src/get-soundex/get-soundex.md) Returns the American Soundex code of an English name.
- [`soundsAlike`](./src/sounds-alike/sounds-alike.md) Reports whether two words share a phonetic code.

### Extract

- [`extractEmails`](./src/extract-emails/extract-emails.md) Finds email addresses in `value`.
- [`extractHashtags`](./src/extract-hashtags/extract-hashtags.md) Finds hashtags in `value`.
- [`extractMentions`](./src/extract-mentions/extract-mentions.md) Finds @-mentions in `value`.
- [`extractURLs`](./src/extract-urls/extract-urls.md) Finds URLs in `value`.

### Format

- [`formatCreditCardNumber`](./src/format-credit-card-number/format-credit-card-number.md) Groups the digits in `value` into fours.
- [`formatIBAN`](./src/format-iban/format-iban.md) Groups the letters and digits in `value` into fours.
- [`formatList`](./src/format-list/format-list.md) Formats `values` with `Intl.ListFormat`.
- [`getInitials`](./src/get-initials/get-initials.md) Returns the first grapheme of each word, sliced to `maximumLength`. @param value - The name. @returns The initials, or `undefined` when `value` is not a string. @example getInitials("Mary Jane Watson");
- [`getReadingTime`](./src/get-reading-time/get-reading-time.md) Estimates how long `value` takes to read.
- [`highlightMatches`](./src/highlight-matches/highlight-matches.md) Wraps literal matches of `query` with `prefix` and `suffix`.

### Encoding

- [`decodeBase64`](./src/decode-base64/decode-base64.md) Decodes standard Base64 to a string.
- [`decodeBase64URL`](./src/decode-base64-url/decode-base64-url.md) Decodes URL-safe Base64 to a string.
- [`decodeHex`](./src/decode-hex/decode-hex.md) Decodes hexadecimal text to a string.
- [`encodeBase64`](./src/encode-base64/encode-base64.md) Encodes `value` as standard Base64.
- [`encodeBase64URL`](./src/encode-base64-url/encode-base64-url.md) Encodes `value` as URL-safe Base64 without padding.
- [`encodeHex`](./src/encode-hex/encode-hex.md) Encodes `value` as lowercase hexadecimal.
- [`fromPunycode`](./src/from-punycode/from-punycode.md) Converts a punycode domain or label to Unicode.
- [`fromUTF8Bytes`](./src/from-utf8-bytes/from-utf8-bytes.md) Decodes UTF-8 bytes to a string.
- [`getLongestCommonPrefix`](./src/get-longest-common-prefix/get-longest-common-prefix.md) Returns the longest shared grapheme prefix of `values`.
- [`getLongestCommonSubstring`](./src/get-longest-common-substring/get-longest-common-substring.md) Returns the longest contiguous shared substring.
- [`getLongestCommonSuffix`](./src/get-longest-common-suffix/get-longest-common-suffix.md) Returns the longest shared grapheme suffix of `values`.
- [`splitCodePoints`](./src/split-code-points/split-code-points.md) Splits `value` into Unicode code points.
- [`splitGraphemes`](./src/split-graphemes/split-graphemes.md) Splits `value` into grapheme clusters.
- [`stripBOM`](./src/strip-bom/strip-bom.md) Removes one leading U+FEFF byte order mark.
- [`toPunycode`](./src/to-punycode/to-punycode.md) Converts a domain or label to ASCII punycode.
- [`toUTF8Bytes`](./src/to-utf8-bytes/to-utf8-bytes.md) Encodes `value` as UTF-8 bytes.
- [`toWellFormedString`](./src/to-well-formed-string/to-well-formed-string.md) Replaces lone surrogates the way `String.prototype.toWellFormed` does.

### Factory

- [`createString`](./src/create-string/create-string.md) Returns the root string functions with `config` bound in.

### Transliteration

- [`transliterate`](./src/transliterate-string/transliterate.md) Maps `value` to Latin letters.
- [`createTransliterate`](./src/create-transliterate/create-transliterate.md) Bound slug settings. / interface BoundSlug { /** Locale from the config, or `undefined` for the plain map. _/ locale: LocaleArgument | undefined; /_* Separator from `slugifySeparator`. _/ separator: string; /_* Lowercase flag from `slugifyLowerCase`. */ lowerCase: boolean; }
- [`slugifyTransliterated`](./src/slugify-transliterated/slugify-transliterated.md) Slug options after defaults are applied. / interface SlugOptions { /** Locale for transliteration and lowercase. _/ locale: LocaleArgument | undefined; /_* Separator between runs. _/ separator: string; /_* Whether the slug is lowercased. */ lowerCase: boolean; }

### HTML entities

- [`createHTMLEntities`](./src/create-html-entities/create-html-entities.md) Returns escape and unescape functions bound to one entity level.
- [`escapeHTMLEntities`](./src/escape-html-entities/escape-html-entities.md) Escapes characters that HTML or XML would treat as markup.
- [`unescapeHTMLEntities`](./src/unescape-html-entities/unescape-html-entities.md) Decodes HTML character references in `value`.

### Locale validators

- [`isPostalCode`](./src/is-postal-code/is-postal-code.md) Reports whether `value` matches the postal-code shape for `country`.
- [`isVAT`](./src/is-vat/is-vat.md) Reports whether `value` is a VAT number for a known prefix.
- [`listPostalCodeCountries`](./src/list-postal-code-countries/list-postal-code-countries.md) Lists the countries `isPostalCode` knows.
- [`listVATCountries`](./src/list-vat-countries/list-vat-countries.md) Lists the VAT prefixes `isVAT` knows.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br />

<h2 id="limits">🚧 What this package does not do</h2>

`stripHTMLTags` removes tags. It is not a sanitizer. Use a dedicated sanitizer such as DOMPurify before inserting text into HTML.

`escapeHTML` escapes five characters. It is not a sanitizer either.

`isEmail` is a practical address check. It is not an RFC 5322 parser.

`isE164` checks the shape of a phone number. It does not check that the number is assigned.

`interpolate` and `formatSprintf` never evaluate the template as JavaScript. `formatSprintf` accepts `%%`, `%s`, `%d`, `%i`, `%f`, `%j`, and numbered forms such as `%1$s`. Any other specifier throws `RangeError`.

Dates belong in `@sgx4u/date-time`. Object-key case will live in `@sgx4u/object`.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br />

<h2 id="throws">❗ Throws</h2>

A bad option throws. A bad value returns `undefined` or `false`.

- `atString` throws RangeError when `index` is not an integer.
- `capitalize` throws TypeError when an option has the wrong type; RangeError when `locale` is empty.
- `compareNatural` throws RangeError when `sensitivity` is unknown; TypeError when `locale` or `sensitivity` has the wrong type.
- `convertCase` throws RangeError when `case` is not a known name; TypeError when an option has the wrong type.
- `countWords` throws TypeError when `locale` is not a string or a list of strings; RangeError when `locale` is empty.
- `drop` throws RangeError when `count` is negative or not an integer.
- `dropLast` throws RangeError when `count` is negative or not an integer.
- `endsWith` throws RangeError when `position` is not an integer or `unit` is unknown; TypeError when `search` is not a string.
- `ensurePrefix` throws TypeError when `prefix` is not a string.
- `ensureSuffix` throws TypeError when `suffix` is not a string.
- `equalsIgnoreCase` throws TypeError when `locale` is not a string or a list of strings; RangeError when `locale` is empty.
- `equalsNormalized` throws RangeError when `form` is unknown.
- `equalsString` throws RangeError when `sensitivity` is unknown.
- `escapeCSV` throws TypeError when `delimiter` is present and is not a string; RangeError when `delimiter` is empty.
- `findClosestMatch` throws TypeError when `candidates` is not an array, or `minimumScore` is not a number; RangeError when `algorithm` is unknown, or `minimumScore` is not finite.
- `findClosestMatches` throws TypeError when `candidates` is not an array, or a number option has the wrong type; RangeError when `algorithm` is unknown, `minimumScore` is not finite, or `limit` is negative or not an integer.
- `formatCount` throws TypeError when `count` is missing or is not a number, or the argument is not an object; RangeError when `count` is not finite, or `locale` is not English.
- `formatList` throws TypeError when `values` is not an array or an element is not a string; RangeError when `type` or `style` is unknown.
- `formatSprintf` throws TypeError when `values` is not an array. `JSON.stringify` and `Number` may also throw for values they cannot convert; RangeError when a specifier is unknown or its argument is missing.
- `getDamerauLevenshteinDistance` throws RangeError when `unit` is not a known unit; TypeError when `unit` is present and is not a string.
- `getDiceCoefficient` throws RangeError when `unit` is not a known unit; TypeError when `unit` is present and is not a string.
- `getDisplayWidth` throws TypeError when `countAnsiEscapeCodes` is not a boolean.
- `getExcerpt` throws TypeError when an option has the wrong type; RangeError when `maximumLength` is not an integer of at least 1.
- `getHammingDistance` throws RangeError when `unit` is not a known unit; TypeError when `unit` is present and is not a string.
- `getIndefiniteArticle` throws RangeError when `locale` is not English; TypeError when `locale` is present and is not a string or a list of strings.
- `getLevenshteinDistance` throws RangeError when `unit` is not a known unit; TypeError when `unit` is present and is not a string.
- `getLongestCommonSubsequence` throws RangeError when `unit` is not a known unit; TypeError when `unit` is present and is not a string.
- `getNgrams` throws RangeError when `size` is below 1 or is not an integer, or `unit` is unknown; TypeError when `size` or `unit` has the wrong type.
- `getOrdinal` throws TypeError when `count` is missing or is not a number, or the argument is not an object; RangeError when `count` is not a safe integer, or `locale` is not English.
- `getPluralCategory` throws RangeError when `type` is not `"cardinal"` or `"ordinal"`, or a provided locale is empty; TypeError when `type` or `locale` is present and has the wrong type.
- `getReadingTime` throws TypeError when `wordsPerMinute` is present and is not a number; RangeError when `wordsPerMinute` is not finite or is not greater than 0.
- `getSimilarity` throws RangeError when `algorithm` is not a known algorithm; TypeError when `algorithm` is present and is not a string.
- `getStringLength` throws RangeError when `unit` is not a known unit; TypeError when `unit` is present and is not a string.
- `getSubstringAfter` throws TypeError when `separator` is not a string; RangeError when `missing` is not `"empty"` or `"whole"`.
- `getSubstringAfterLast` throws TypeError when `separator` is not a string; RangeError when `missing` is not `"empty"` or `"whole"`.
- `getSubstringBefore` throws TypeError when `separator` is not a string; RangeError when `missing` is not `"empty"` or `"whole"`.
- `getSubstringBeforeLast` throws TypeError when `separator` is not a string; RangeError when `missing` is not `"empty"` or `"whole"`.
- `getSubstringBetween` throws TypeError when `start` or `end` is not a string; RangeError when `missing` is not `"empty"` or `"whole"`.
- `highlightMatches` throws TypeError when `query`, `prefix`, `suffix`, or a flag has the wrong type.
- `includesAll` throws TypeError when `searches` is not an array of strings; TypeError when `value` is not an array of strings.
- `includesAny` throws TypeError when `searches` is not an array of strings; TypeError when `value` is not an array of strings.
- `indent` throws RangeError when `count` is negative or not an integer.
- `indexOfMatch` throws RangeError when `fromIndex` is not an integer or `unit` is unknown; TypeError when `search` is not a string.
- `insertString` throws RangeError when `index` is not an integer.
- `interpolate` throws TypeError when `values` is not a non-null object; RangeError when `pattern` or `missing` is not a known value.
- `isAlpha` throws TypeError when `locale` is present and is not a string; TypeError when `value` is present and is not a string.
- `isAlphanumeric` throws TypeError when `locale` is present and is not a string; TypeError when `value` is present and is not a string.
- `isBase64` throws TypeError when an option has the wrong type; RangeError when `padding` is not `"required"` or `"optional"`.
- `isCUID2` throws TypeError when `length` is present and is not a number; RangeError when `length` is less than 1 or is not an integer.
- `isEmail` throws TypeError when an option is present and has the wrong type; TypeError when a flag is present and is not a boolean.
- `isFQDN` throws TypeError when an option is present and is not a boolean; TypeError when a flag is present and is not a boolean.
- `isHash` throws TypeError when `algorithm` is present and is not a string; RangeError when `algorithm` is missing or is not a known name.
- `isHexColor` throws TypeError when a flag is present and is not a boolean.
- `isIP` throws TypeError when `version` is not a number or a string; RangeError when `version` is not `4`, `6`, or `"any"`.
- `isMACAddress` throws TypeError when `format` is present and is not a string; RangeError when `format` is not a known format.
- `isNanoID` throws TypeError when an option has the wrong type; RangeError when `length` is not a positive integer.
- `isNormalized` throws RangeError when `form` is not `NFC`, `NFD`, `NFKC`, or `NFKD`; TypeError when `form` is present and is not a string.
- `isNumericString` throws TypeError when a flag is present and is not a boolean.
- `isPlural` throws RangeError when `locale` is not English; TypeError when `locale` is present and is not a string or a list of strings.
- `isSemVer` throws TypeError when `allowPrefixV` is present and is not a boolean.
- `isSingular` throws RangeError when `locale` is not English; TypeError when `locale` is present and is not a string or a list of strings.
- `isStrongPassword` throws TypeError when an option has the wrong type; RangeError when `minimumLength` is less than 1 or is not an integer.
- `isURL` throws TypeError when an option has the wrong type, including a `protocols` value that is not an array of strings; RangeError when a protocol name is empty.
- `isUUID` throws TypeError when an option has the wrong type; RangeError when `version` is not 1 through 8, `"any"`, `"nil"`, or `"max"`. Version `0` throws.
- `maskCreditCard` throws TypeError when an option has the wrong type; RangeError when `unmaskedEndLength` is negative or not an integer, or `maskCharacter` is empty.
- `maskEmail` throws TypeError when an option has the wrong type; RangeError when `unmaskedLocalLength` is negative or not an integer, or `maskCharacter` is empty.
- `maskString` throws TypeError when an option has the wrong type; RangeError when a length is negative or not an integer, `maskCharacter` is empty, or `unit` is unknown.
- `matches` throws TypeError when `pattern` is neither a string nor a `RegExp`; TypeError when `value` is neither a string nor a `RegExp`.
- `normalizeUnicode` throws RangeError when `form` is not a known form; TypeError when `form` is present and is not a string.
- `pad` throws RangeError when `maximumLength` is negative or not an integer, `align` is unknown, or `padString` is empty.
- `padEnd` throws RangeError when `maximumLength` is negative or not an integer.
- `padStart` throws RangeError when `maximumLength` is negative or not an integer.
- `pluralize` throws TypeError when `count` is present and is not a number; RangeError when `count` is not finite, or `locale` is not English.
- `quoteString` throws RangeError when `style` is unknown; TypeError when `style` is present and is not a string.
- `removePrefix` throws TypeError when `prefix` is not a string.
- `removeSuffix` throws TypeError when `suffix` is not a string.
- `repeatString` throws RangeError when `count` is negative or not an integer.
- `replaceAllOccurrences` throws TypeError when `pattern` is neither a string nor a `RegExp`; TypeError when `value` is neither a string nor a `RegExp`.
- `replaceRange` throws RangeError when `start` is after `end`.
- `reverseString` throws RangeError when `unit` is unknown; TypeError when `unit` is present and is not a string.
- `singularize` throws RangeError when `locale` is not English; TypeError when `locale` is present and is not a string or a list of strings.
- `sliceString` throws RangeError when an index is not an integer or `unit` is unknown.
- `slugify` throws TypeError when an option has the wrong type; RangeError when `separator` is empty, or `maximumLength` is negative or not an integer.
- `soundsAlike` throws RangeError when `algorithm` is not a known algorithm; TypeError when `algorithm` is present and is not a string.
- `splitLines` throws TypeError when `omitEmpty` is not a boolean.
- `splitOnce` throws RangeError when `separator` is empty or `from` is unknown.
- `splitSentences` throws RangeError when `locale` is empty.
- `splitWords` throws RangeError when `locale` is empty.
- `startsWith` throws RangeError when `position` is not an integer or `unit` is unknown; TypeError when `search` is not a string.
- `stripHTMLTags` throws TypeError when `allowedTags` is present and is not an array of strings.
- `surround` throws TypeError when `prefix` or `suffix` is not a string.
- `swapCase` throws RangeError when `locale` is empty.
- `take` throws RangeError when `count` is negative or not an integer.
- `takeLast` throws RangeError when `count` is negative or not an integer.
- `toCamelCase` throws TypeError when an option has the wrong type; RangeError when `locale` is an empty string.
- `toCapitalCase` throws RangeError when `locale` is empty.
- `toConstantCase` throws TypeError when an option has the wrong type; RangeError when `locale` is an empty string.
- `toDotCase` throws TypeError when an option has the wrong type; RangeError when `locale` is an empty string.
- `toFilename` throws TypeError when an option has the wrong type; RangeError when `maximumLength` is below 1 or is not an integer.
- `toKebabCase` throws TypeError when an option has the wrong type; RangeError when `locale` is an empty string.
- `toLowerCase` throws TypeError when `locale` is not a string or a list of strings; RangeError when `locale` is empty.
- `toNoCase` throws RangeError when `locale` is empty.
- `toPascalCase` throws TypeError when an option has the wrong type; RangeError when `locale` is an empty string.
- `toPascalSnakeCase` throws TypeError when an option has the wrong type; RangeError when `locale` is an empty string.
- `toPathCase` throws TypeError when an option has the wrong type; RangeError when `locale` is an empty string.
- `toSentenceCase` throws RangeError when `locale` is empty.
- `toSnakeCase` throws TypeError when an option has the wrong type; RangeError when `locale` is an empty string.
- `toTitleCase` throws RangeError when `style` is unknown or `locale` is empty.
- `toTrainCase` throws TypeError when an option has the wrong type; RangeError when `locale` is an empty string.
- `toUpperCase` throws TypeError when `locale` is not a string or a list of strings; RangeError when `locale` is empty.
- `trim` throws TypeError when `characters` is present and is not a string.
- `trimEnd` throws TypeError when `characters` is present and is not a string.
- `trimStart` throws TypeError when `characters` is present and is not a string.
- `truncate` throws RangeError when `maximumLength` is negative or not an integer, or `location` or `unit` is unknown; TypeError when `separator` is neither a string nor a `RegExp`.
- `truncateToBytes` throws RangeError when `maximumBytes` is negative.
- `truncateToDisplayWidth` throws RangeError when `maximumWidth` is negative or `location` is unknown.
- `uncapitalize` throws RangeError when `locale` is empty.
- `unquoteString` throws RangeError when `style` is unknown; TypeError when `style` is present and is not a string.
- `wrapText` throws RangeError when `maximumWidth` is less than 1.
- `createString` throws RangeError when a key is not a known option; TypeError when a known option has the wrong type.
- `transliterate` throws TypeError when `locale` is present and is not a string or a list of strings; RangeError when `locale` is empty.
- `createTransliterate` throws TypeError when `config` is not an object or a used option has the wrong type; RangeError when a key is unknown or `locale` is empty.
- `slugifyTransliterated` throws TypeError when an option has the wrong type; RangeError when `locale` is empty.
- `createHTMLEntities` throws TypeError when `config` is not an object, or `level` is not a string; RangeError when `level` is unknown or a key is not `level`.
- `escapeHTMLEntities` throws TypeError when `level` is present and is not a string; RangeError when `level` is not `xml`, `html4`, or `html5`.
- `unescapeHTMLEntities` throws TypeError when `level` is present and is not a string; RangeError when `level` is not `xml`, `html4`, or `html5`.
- `isPostalCode` throws TypeError when `country` is present and is not a string; RangeError when `country` is missing, empty, or not in the pattern table.
- `isVAT` throws TypeError when `country` is present and is not a string; RangeError when `country` is not a known VAT prefix.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br />

<h2 id="runtime-support">🌐 Runtime support</h2>

Runtime: `universal`. The same source runs in browsers, workers, and Node. It uses `Intl.Segmenter`, `Intl.Collator`, `Intl.PluralRules`, `Intl.ListFormat`, `Intl.NumberFormat`, `String.prototype.normalize`, `String.prototype.isWellFormed`, `String.prototype.toWellFormed`, `URL.canParse`, `TextEncoder`, and `TextDecoder`. Each `Intl` constructor is cached per locale on first use.

`RegExp.escape` exists only on newer engines. This package calls it when it is present and otherwise uses the ES2025 escape algorithm. Base64 and hex are implemented in the package. There are no runtime dependencies.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br />

<h2 id="contributing">🤝 Contributing</h2>

Repository rules are in [CONTRIBUTING.md](../../CONTRIBUTING.md).

Owner: `@sgx4u`

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br />

<h2 id="license">📄 License</h2>

[MIT](../../LICENSE) © 2026 Subhajit Ghosh

<p align="right">(<a href="#readme-top">back to top</a>)</p>
