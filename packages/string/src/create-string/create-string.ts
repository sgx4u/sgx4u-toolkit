import type { StringConfig } from "../types/string-config.types.js";
import { atString } from "../at-string/at-string.js";
import { capitalize } from "../capitalize/capitalize.js";
import { collapseWhitespace } from "../collapse-whitespace/collapse-whitespace.js";
import { compareNatural } from "../compare-natural/compare-natural.js";
import { compareStrings } from "../compare-strings/compare-strings.js";
import { convertCase } from "../convert-case/convert-case.js";
import { countBytes } from "../count-bytes/count-bytes.js";
import { countLines } from "../count-lines/count-lines.js";
import { countOccurrences } from "../count-occurrences/count-occurrences.js";
import { countSentences } from "../count-sentences/count-sentences.js";
import { countWords } from "../count-words/count-words.js";
import { decodeBase64 } from "../decode-base64/decode-base64.js";
import { decodeBase64URL } from "../decode-base64-url/decode-base64-url.js";
import { decodeHex } from "../decode-hex/decode-hex.js";
import { dedent } from "../dedent/dedent.js";
import { drop } from "../drop/drop.js";
import { dropLast } from "../drop-last/drop-last.js";
import { encodeBase64 } from "../encode-base64/encode-base64.js";
import { encodeBase64URL } from "../encode-base64-url/encode-base64-url.js";
import { encodeHex } from "../encode-hex/encode-hex.js";
import { endsWith } from "../ends-with/ends-with.js";
import { ensurePrefix } from "../ensure-prefix/ensure-prefix.js";
import { ensureSuffix } from "../ensure-suffix/ensure-suffix.js";
import { equalsIgnoreCase } from "../equals-ignore-case/equals-ignore-case.js";
import { equalsNormalized } from "../equals-normalized/equals-normalized.js";
import { equalsString } from "../equals-string/equals-string.js";
import { escapeCSV } from "../escape-csv/escape-csv.js";
import { escapeHTML } from "../escape-html/escape-html.js";
import { escapeJavaScriptString } from "../escape-javascript-string/escape-javascript-string.js";
import { escapeMarkdown } from "../escape-markdown/escape-markdown.js";
import { escapeRegExp } from "../escape-reg-exp/escape-reg-exp.js";
import { extractEmails } from "../extract-emails/extract-emails.js";
import { extractHashtags } from "../extract-hashtags/extract-hashtags.js";
import { extractMentions } from "../extract-mentions/extract-mentions.js";
import { extractURLs } from "../extract-urls/extract-urls.js";
import { findClosestMatch } from "../find-closest-match/find-closest-match.js";
import { findClosestMatches } from "../find-closest-matches/find-closest-matches.js";
import { formatCount } from "../format-count/format-count.js";
import { formatCreditCardNumber } from "../format-credit-card-number/format-credit-card-number.js";
import { formatIBAN } from "../format-iban/format-iban.js";
import { formatList } from "../format-list/format-list.js";
import { formatSprintf } from "../format-sprintf/format-sprintf.js";
import { fromPunycode } from "../from-punycode/from-punycode.js";
import { fromUTF8Bytes } from "../from-utf8-bytes/from-utf8-bytes.js";
import { getDamerauLevenshteinDistance } from "../get-damerau-levenshtein-distance/get-damerau-levenshtein-distance.js";
import { getDiceCoefficient } from "../get-dice-coefficient/get-dice-coefficient.js";
import { getDisplayWidth } from "../get-display-width/get-display-width.js";
import { getDoubleMetaphone } from "../get-double-metaphone/get-double-metaphone.js";
import { getExcerpt } from "../get-excerpt/get-excerpt.js";
import { getHammingDistance } from "../get-hamming-distance/get-hamming-distance.js";
import { getIndefiniteArticle } from "../get-indefinite-article/get-indefinite-article.js";
import { getInitials } from "../get-initials/get-initials.js";
import { getJaroWinklerSimilarity } from "../get-jaro-winkler-similarity/get-jaro-winkler-similarity.js";
import { getLevenshteinDistance } from "../get-levenshtein-distance/get-levenshtein-distance.js";
import { getLongestCommonPrefix } from "../get-longest-common-prefix/get-longest-common-prefix.js";
import { getLongestCommonSubsequence } from "../get-longest-common-subsequence/get-longest-common-subsequence.js";
import { getLongestCommonSubstring } from "../get-longest-common-substring/get-longest-common-substring.js";
import { getLongestCommonSuffix } from "../get-longest-common-suffix/get-longest-common-suffix.js";
import { getMetaphone } from "../get-metaphone/get-metaphone.js";
import { getNgrams } from "../get-ngrams/get-ngrams.js";
import { getOrdinal } from "../get-ordinal/get-ordinal.js";
import { getPluralCategory } from "../get-plural-category/get-plural-category.js";
import { getReadingTime } from "../get-reading-time/get-reading-time.js";
import { getSimilarity } from "../get-similarity/get-similarity.js";
import { getSoundex } from "../get-soundex/get-soundex.js";
import { getStringLength } from "../get-string-length/get-string-length.js";
import { getSubstringAfter } from "../get-substring-after/get-substring-after.js";
import { getSubstringAfterLast } from "../get-substring-after-last/get-substring-after-last.js";
import { getSubstringBefore } from "../get-substring-before/get-substring-before.js";
import { getSubstringBeforeLast } from "../get-substring-before-last/get-substring-before-last.js";
import { getSubstringBetween } from "../get-substring-between/get-substring-between.js";
import { hasFullWidthCharacter } from "../has-full-width-character/has-full-width-character.js";
import { hasHalfWidthCharacter } from "../has-half-width-character/has-half-width-character.js";
import { highlightMatches } from "../highlight-matches/highlight-matches.js";
import { humanize } from "../humanize/humanize.js";
import { includes } from "../includes/includes.js";
import { includesAll } from "../includes-all/includes-all.js";
import { includesAny } from "../includes-any/includes-any.js";
import { indent } from "../indent/indent.js";
import { indexOfMatch } from "../index-of-match/index-of-match.js";
import { insertString } from "../insert-string/insert-string.js";
import { interpolate } from "../interpolate/interpolate.js";
import { isAlpha } from "../is-alpha/is-alpha.js";
import { isAlphanumeric } from "../is-alphanumeric/is-alphanumeric.js";
import { isASCII } from "../is-ascii/is-ascii.js";
import { isBase32 } from "../is-base32/is-base32.js";
import { isBase64 } from "../is-base64/is-base64.js";
import { isBase64URL } from "../is-base64-url/is-base64-url.js";
import { isBIC } from "../is-bic/is-bic.js";
import { isBlank } from "../is-blank/is-blank.js";
import { isCamelCase } from "../is-camel-case/is-camel-case.js";
import { isCapitalized } from "../is-capitalized/is-capitalized.js";
import { isConstantCase } from "../is-constant-case/is-constant-case.js";
import { isCreditCard } from "../is-credit-card/is-credit-card.js";
import { isCUID } from "../is-cuid/is-cuid.js";
import { isCUID2 } from "../is-cuid2/is-cuid2.js";
import { isDataURI } from "../is-data-uri/is-data-uri.js";
import { isE164 } from "../is-e164/is-e164.js";
import { isEAN } from "../is-ean/is-ean.js";
import { isEmail } from "../is-email/is-email.js";
import { isEmptyString } from "../is-empty-string/is-empty-string.js";
import { isFQDN } from "../is-fqdn/is-fqdn.js";
import { isHash } from "../is-hash/is-hash.js";
import { isHexColor } from "../is-hex-color/is-hex-color.js";
import { isHexadecimal } from "../is-hexadecimal/is-hexadecimal.js";
import { isHSLColor } from "../is-hsl-color/is-hsl-color.js";
import { isIBAN } from "../is-iban/is-iban.js";
import { isIP } from "../is-ip/is-ip.js";
import { isIPRange } from "../is-ip-range/is-ip-range.js";
import { isIPv4 } from "../is-ipv4/is-ipv4.js";
import { isIPv6 } from "../is-ipv6/is-ipv6.js";
import { isISBN } from "../is-isbn/is-isbn.js";
import { isISSN } from "../is-issn/is-issn.js";
import { isJSON } from "../is-json/is-json.js";
import { isJWT } from "../is-jwt/is-jwt.js";
import { isKebabCase } from "../is-kebab-case/is-kebab-case.js";
import { isLatLong } from "../is-lat-long/is-lat-long.js";
import { isLocaleIdentifier } from "../is-locale-identifier/is-locale-identifier.js";
import { isLowerCase } from "../is-lower-case/is-lower-case.js";
import { isLuhn } from "../is-luhn/is-luhn.js";
import { isMACAddress } from "../is-mac-address/is-mac-address.js";
import { isMailtoURI } from "../is-mailto-uri/is-mailto-uri.js";
import { isMimeType } from "../is-mime-type/is-mime-type.js";
import { isMongoObjectId } from "../is-mongo-object-id/is-mongo-object-id.js";
import { isNanoID } from "../is-nano-id/is-nano-id.js";
import { isNonEmptyString } from "../is-non-empty-string/is-non-empty-string.js";
import { isNormalized } from "../is-normalized/is-normalized.js";
import { isNumericString } from "../is-numeric-string/is-numeric-string.js";
import { isPascalCase } from "../is-pascal-case/is-pascal-case.js";
import { isPlural } from "../is-plural/is-plural.js";
import { isPort } from "../is-port/is-port.js";
import { isRGBColor } from "../is-rgb-color/is-rgb-color.js";
import { isSemVer } from "../is-sem-ver/is-sem-ver.js";
import { isSingular } from "../is-singular/is-singular.js";
import { isSlug } from "../is-slug/is-slug.js";
import { isSnakeCase } from "../is-snake-case/is-snake-case.js";
import { isString } from "../is-string/is-string.js";
import { isStrongPassword } from "../is-strong-password/is-strong-password.js";
import { isTrainCase } from "../is-train-case/is-train-case.js";
import { isULID } from "../is-ulid/is-ulid.js";
import { isUpperCase } from "../is-upper-case/is-upper-case.js";
import { isURL } from "../is-url/is-url.js";
import { isUUID } from "../is-uuid/is-uuid.js";
import { isWellFormedString } from "../is-well-formed-string/is-well-formed-string.js";
import { lastIndexOfMatch } from "../last-index-of-match/last-index-of-match.js";
import { maskCreditCard } from "../mask-credit-card/mask-credit-card.js";
import { maskEmail } from "../mask-email/mask-email.js";
import { maskString } from "../mask-string/mask-string.js";
import { matches } from "../matches/matches.js";
import { normalizeUnicode } from "../normalize-unicode/normalize-unicode.js";
import { pad } from "../pad/pad.js";
import { padEnd } from "../pad-end/pad-end.js";
import { padStart } from "../pad-start/pad-start.js";
import { pluralize } from "../pluralize/pluralize.js";
import { quoteString } from "../quote-string/quote-string.js";
import { removeDiacritics } from "../remove-diacritics/remove-diacritics.js";
import { removePrefix } from "../remove-prefix/remove-prefix.js";
import { removeSuffix } from "../remove-suffix/remove-suffix.js";
import { repeatString } from "../repeat-string/repeat-string.js";
import { replaceAllOccurrences } from "../replace-all-occurrences/replace-all-occurrences.js";
import { replaceRange } from "../replace-range/replace-range.js";
import { reverseString } from "../reverse-string/reverse-string.js";
import { singularize } from "../singularize/singularize.js";
import { sliceString } from "../slice-string/slice-string.js";
import { slugify } from "../slugify/slugify.js";
import { soundsAlike } from "../sounds-alike/sounds-alike.js";
import { splitCodePoints } from "../split-code-points/split-code-points.js";
import { splitGraphemes } from "../split-graphemes/split-graphemes.js";
import { splitLines } from "../split-lines/split-lines.js";
import { splitOnce } from "../split-once/split-once.js";
import { splitSentences } from "../split-sentences/split-sentences.js";
import { splitWords } from "../split-words/split-words.js";
import { startsWith } from "../starts-with/starts-with.js";
import { stripANSI } from "../strip-ansi/strip-ansi.js";
import { stripBOM } from "../strip-bom/strip-bom.js";
import { stripHTMLTags } from "../strip-html-tags/strip-html-tags.js";
import { stripIndent } from "../strip-indent/strip-indent.js";
import { surround } from "../surround/surround.js";
import { swapCase } from "../swap-case/swap-case.js";
import { take } from "../take/take.js";
import { takeLast } from "../take-last/take-last.js";
import { toCamelCase } from "../to-camel-case/to-camel-case.js";
import { toCapitalCase } from "../to-capital-case/to-capital-case.js";
import { toConstantCase } from "../to-constant-case/to-constant-case.js";
import { toDotCase } from "../to-dot-case/to-dot-case.js";
import { toFilename } from "../to-filename/to-filename.js";
import { toKebabCase } from "../to-kebab-case/to-kebab-case.js";
import { toLowerCase } from "../to-lower-case/to-lower-case.js";
import { toNoCase } from "../to-no-case/to-no-case.js";
import { toPascalCase } from "../to-pascal-case/to-pascal-case.js";
import { toPascalSnakeCase } from "../to-pascal-snake-case/to-pascal-snake-case.js";
import { toPathCase } from "../to-path-case/to-path-case.js";
import { toPunycode } from "../to-punycode/to-punycode.js";
import { toSentenceCase } from "../to-sentence-case/to-sentence-case.js";
import { toSnakeCase } from "../to-snake-case/to-snake-case.js";
import { toTitleCase } from "../to-title-case/to-title-case.js";
import { toTrainCase } from "../to-train-case/to-train-case.js";
import { toUpperCase } from "../to-upper-case/to-upper-case.js";
import { toUTF8Bytes } from "../to-utf8-bytes/to-utf8-bytes.js";
import { toWellFormedString } from "../to-well-formed-string/to-well-formed-string.js";
import { trim } from "../trim/trim.js";
import { trimEnd } from "../trim-end/trim-end.js";
import { trimStart } from "../trim-start/trim-start.js";
import { truncate } from "../truncate/truncate.js";
import { truncateToBytes } from "../truncate-to-bytes/truncate-to-bytes.js";
import { truncateToDisplayWidth } from "../truncate-to-display-width/truncate-to-display-width.js";
import { uncapitalize } from "../uncapitalize/uncapitalize.js";
import { unescapeHTML } from "../unescape-html/unescape-html.js";
import { unquoteString } from "../unquote-string/unquote-string.js";
import { unwrapText } from "../unwrap-text/unwrap-text.js";
import { wrapText } from "../wrap-text/wrap-text.js";
import type { StringLibrary } from "./create-string.types.js";

const knownKeys = new Set([
    "locale",
    "unit",
    "keepConsecutiveUppercase",
    "mergeAmbiguousCharacters",
    "titleCaseStyle",
    "smallWords",
    "slugifySeparator",
    "slugifyLowerCase",
    "truncationOmission",
    "truncationLocation",
    "maskCharacter",
    "unmaskedStartLength",
    "unmaskedEndLength",
    "collatorSensitivity",
    "numericCollation",
    "normalizeForm",
    "wordsPerMinute",
    "templatePattern",
]);

/**
 * Returns the root string functions with `config` bound in.
 *
 * A value on a single call overrides the bound default. Two instances do
 * not share mutable state. There is no global setter.
 *
 * @param config - Defaults. Omit it for the published defaults.
 * @returns A new object of root functions.
 * @throws {@link RangeError} When a key is not a known option.
 * @throws {@link TypeError} When a known option has the wrong type.
 * @example
 * const strings = createString({ locale: "en" });
 */
export function createString(config: StringConfig = {}): StringLibrary {
    if (
        config === null ||
        typeof config !== "object" ||
        Array.isArray(config)
    ) {
        throw new TypeError("config must be an object.");
    }
    for (const key of Object.keys(config)) {
        if (!knownKeys.has(key)) {
            throw new RangeError(
                `Unknown string config key ${JSON.stringify(key)}.`,
            );
        }
    }
    validateConfig(config);
    const defaults = boundDefaults(config);
    return {
        atString: bindFunction(atString, defaults, ["unit"]),
        capitalize: bindFunction(capitalize, defaults, ["locale"]),
        collapseWhitespace,
        compareNatural: bindFunction(compareNatural, defaults, [
            "locale",
            "sensitivity",
        ]),
        compareStrings: bindFunction(compareStrings, defaults, [
            "locale",
            "sensitivity",
            "numeric",
        ]),
        convertCase: bindFunction(convertCase, defaults, [
            "locale",
            "keepConsecutiveUppercase",
            "mergeAmbiguousCharacters",
            "style",
            "smallWords",
        ]),
        countBytes,
        countLines,
        countOccurrences: bindFunction(countOccurrences, defaults, ["locale"]),
        countSentences,
        countWords: bindFunction(countWords, defaults, ["locale"]),
        decodeBase64,
        decodeBase64URL,
        decodeHex,
        dedent,
        drop: bindFunction(drop, defaults, ["unit"]),
        dropLast: bindFunction(dropLast, defaults, ["unit"]),
        encodeBase64,
        encodeBase64URL,
        encodeHex,
        endsWith: bindFunction(endsWith, defaults, ["locale", "unit"]),
        ensurePrefix,
        ensureSuffix,
        equalsIgnoreCase: bindFunction(equalsIgnoreCase, defaults, ["locale"]),
        equalsNormalized: bindFunction(equalsNormalized, defaults, ["form"]),
        equalsString: bindFunction(equalsString, defaults, [
            "locale",
            "sensitivity",
        ]),
        escapeCSV,
        escapeHTML,
        escapeJavaScriptString,
        escapeMarkdown,
        escapeRegExp,
        extractEmails,
        extractHashtags,
        extractMentions,
        extractURLs,
        findClosestMatch,
        findClosestMatches,
        formatCount: bindFunction(formatCount, defaults, ["locale"]),
        formatCreditCardNumber,
        formatIBAN,
        formatList: bindFunction(formatList, defaults, ["locale"]),
        formatSprintf,
        fromPunycode,
        fromUTF8Bytes,
        getDamerauLevenshteinDistance: bindFunction(
            getDamerauLevenshteinDistance,
            defaults,
            ["unit"],
        ),
        getDiceCoefficient: bindFunction(getDiceCoefficient, defaults, [
            "unit",
        ]),
        getDisplayWidth,
        getDoubleMetaphone,
        getExcerpt: bindFunction(getExcerpt, defaults, ["omission"]),
        getHammingDistance: bindFunction(getHammingDistance, defaults, [
            "unit",
        ]),
        getIndefiniteArticle: bindFunction(getIndefiniteArticle, defaults, [
            "locale",
        ]),
        getInitials: bindFunction(getInitials, defaults, ["locale"]),
        getJaroWinklerSimilarity,
        getLevenshteinDistance: bindFunction(getLevenshteinDistance, defaults, [
            "unit",
        ]),
        getLongestCommonPrefix,
        getLongestCommonSubsequence: bindFunction(
            getLongestCommonSubsequence,
            defaults,
            ["unit"],
        ),
        getLongestCommonSubstring,
        getLongestCommonSuffix,
        getMetaphone,
        getNgrams: bindFunction(getNgrams, defaults, ["unit"]),
        getOrdinal: bindFunction(getOrdinal, defaults, ["locale"]),
        getPluralCategory: bindFunction(getPluralCategory, defaults, [
            "locale",
        ]),
        getReadingTime: bindFunction(getReadingTime, defaults, [
            "wordsPerMinute",
        ]),
        getSimilarity,
        getSoundex,
        getStringLength: bindFunction(getStringLength, defaults, ["unit"]),
        getSubstringAfter,
        getSubstringAfterLast,
        getSubstringBefore,
        getSubstringBeforeLast,
        getSubstringBetween,
        hasFullWidthCharacter,
        hasHalfWidthCharacter,
        highlightMatches,
        humanize,
        includes: bindFunction(includes, defaults, ["locale"]),
        includesAll: bindFunction(includesAll, defaults, ["locale"]),
        includesAny: bindFunction(includesAny, defaults, ["locale"]),
        indent,
        indexOfMatch: bindFunction(indexOfMatch, defaults, ["locale", "unit"]),
        insertString: bindFunction(insertString, defaults, ["unit"]),
        interpolate: bindFunction(interpolate, defaults, ["pattern"]),
        isAlpha: bindFunction(isAlpha, defaults, ["locale"]),
        isAlphanumeric: bindFunction(isAlphanumeric, defaults, ["locale"]),
        isASCII,
        isBase32,
        isBase64,
        isBase64URL,
        isBIC,
        isBlank,
        isCamelCase,
        isCapitalized,
        isConstantCase,
        isCreditCard,
        isCUID,
        isCUID2,
        isDataURI,
        isE164,
        isEAN,
        isEmail,
        isEmptyString,
        isFQDN,
        isHash,
        isHexColor,
        isHexadecimal,
        isHSLColor,
        isIBAN,
        isIP,
        isIPRange,
        isIPv4,
        isIPv6,
        isISBN,
        isISSN,
        isJSON,
        isJWT,
        isKebabCase,
        isLatLong,
        isLocaleIdentifier,
        isLowerCase,
        isLuhn,
        isMACAddress,
        isMailtoURI,
        isMimeType,
        isMongoObjectId,
        isNanoID,
        isNonEmptyString,
        isNormalized: bindFunction(isNormalized, defaults, ["form"]),
        isNumericString,
        isPascalCase,
        isPlural: bindFunction(isPlural, defaults, ["locale"]),
        isPort,
        isRGBColor,
        isSemVer,
        isSingular: bindFunction(isSingular, defaults, ["locale"]),
        isSlug,
        isSnakeCase,
        isString,
        isStrongPassword,
        isTrainCase,
        isULID,
        isUpperCase,
        isURL,
        isUUID,
        isWellFormedString,
        lastIndexOfMatch: bindFunction(lastIndexOfMatch, defaults, [
            "locale",
            "unit",
        ]),
        maskCreditCard: bindFunction(maskCreditCard, defaults, [
            "maskCharacter",
            "unmaskedEndLength",
        ]),
        maskEmail: bindFunction(maskEmail, defaults, ["maskCharacter"]),
        maskString: bindFunction(maskString, defaults, [
            "maskCharacter",
            "unmaskedStartLength",
            "unmaskedEndLength",
            "unit",
        ]),
        matches,
        normalizeUnicode: bindFunction(normalizeUnicode, defaults, ["form"]),
        pad: bindFunction(pad, defaults, ["unit"]),
        padEnd: bindFunction(padEnd, defaults, ["unit"]),
        padStart: bindFunction(padStart, defaults, ["unit"]),
        pluralize: bindFunction(pluralize, defaults, ["locale"]),
        quoteString,
        removeDiacritics,
        removePrefix,
        removeSuffix,
        repeatString,
        replaceAllOccurrences,
        replaceRange: bindFunction(replaceRange, defaults, ["unit"]),
        reverseString: bindFunction(reverseString, defaults, ["unit"]),
        singularize: bindFunction(singularize, defaults, ["locale"]),
        sliceString: bindFunction(sliceString, defaults, ["unit"]),
        slugify: bindFunction(slugify, defaults, ["separator", "lowerCase"]),
        soundsAlike,
        splitCodePoints,
        splitGraphemes,
        splitLines,
        splitOnce,
        splitSentences: bindFunction(splitSentences, defaults, ["locale"]),
        splitWords: bindFunction(splitWords, defaults, [
            "locale",
            "mergeAmbiguousCharacters",
        ]),
        startsWith: bindFunction(startsWith, defaults, ["locale", "unit"]),
        stripANSI,
        stripBOM,
        stripHTMLTags,
        stripIndent,
        surround,
        swapCase: bindFunction(swapCase, defaults, ["locale"]),
        take: bindFunction(take, defaults, ["unit"]),
        takeLast: bindFunction(takeLast, defaults, ["unit"]),
        toCamelCase: bindFunction(toCamelCase, defaults, [
            "locale",
            "keepConsecutiveUppercase",
            "mergeAmbiguousCharacters",
        ]),
        toCapitalCase: bindFunction(toCapitalCase, defaults, ["locale"]),
        toConstantCase: bindFunction(toConstantCase, defaults, [
            "locale",
            "keepConsecutiveUppercase",
            "mergeAmbiguousCharacters",
        ]),
        toDotCase: bindFunction(toDotCase, defaults, [
            "locale",
            "keepConsecutiveUppercase",
            "mergeAmbiguousCharacters",
        ]),
        toFilename,
        toKebabCase: bindFunction(toKebabCase, defaults, [
            "locale",
            "keepConsecutiveUppercase",
            "mergeAmbiguousCharacters",
        ]),
        toLowerCase: bindFunction(toLowerCase, defaults, ["locale"]),
        toNoCase: bindFunction(toNoCase, defaults, ["locale"]),
        toPascalCase: bindFunction(toPascalCase, defaults, [
            "locale",
            "keepConsecutiveUppercase",
            "mergeAmbiguousCharacters",
        ]),
        toPascalSnakeCase: bindFunction(toPascalSnakeCase, defaults, [
            "locale",
            "keepConsecutiveUppercase",
            "mergeAmbiguousCharacters",
        ]),
        toPathCase: bindFunction(toPathCase, defaults, [
            "locale",
            "keepConsecutiveUppercase",
            "mergeAmbiguousCharacters",
        ]),
        toPunycode,
        toSentenceCase: bindFunction(toSentenceCase, defaults, ["locale"]),
        toSnakeCase: bindFunction(toSnakeCase, defaults, [
            "locale",
            "keepConsecutiveUppercase",
            "mergeAmbiguousCharacters",
        ]),
        toTitleCase: bindFunction(toTitleCase, defaults, [
            "locale",
            "style",
            "smallWords",
        ]),
        toTrainCase: bindFunction(toTrainCase, defaults, [
            "locale",
            "keepConsecutiveUppercase",
            "mergeAmbiguousCharacters",
        ]),
        toUpperCase: bindFunction(toUpperCase, defaults, ["locale"]),
        toUTF8Bytes,
        toWellFormedString,
        trim,
        trimEnd,
        trimStart,
        truncate: bindFunction(truncate, defaults, [
            "omission",
            "location",
            "unit",
        ]),
        truncateToBytes: bindFunction(truncateToBytes, defaults, ["omission"]),
        truncateToDisplayWidth: bindFunction(truncateToDisplayWidth, defaults, [
            "omission",
            "location",
        ]),
        uncapitalize: bindFunction(uncapitalize, defaults, ["locale"]),
        unescapeHTML,
        unquoteString,
        unwrapText,
        wrapText,
    };
}

/**
 * @param implementation - A root function.
 * @param defaults - Option names this function understands.
 * @returns The function with those defaults applied when the call omits them.
 */
function bindFunction<FunctionType extends (argument: never) => unknown>(
    implementation: FunctionType,
    defaults: Record<string, unknown>,
    keys: readonly string[],
): FunctionType {
    const present = Object.fromEntries(
        keys
            .filter((key) => defaults[key] !== undefined)
            .map((key) => [key, defaults[key]]),
    );
    if (Object.keys(present).length === 0) {
        return implementation;
    }
    return ((argument: unknown) => {
        if (typeof argument === "string") {
            return implementation({ value: argument, ...present } as never);
        }
        if (
            argument !== null &&
            typeof argument === "object" &&
            !Array.isArray(argument)
        ) {
            return implementation({ ...present, ...argument } as never);
        }
        return implementation(argument as never);
    }) as unknown as FunctionType;
}

/**
 * @param config - The caller config.
 * @returns Option names used by the bound functions.
 */
function boundDefaults(config: StringConfig): Record<string, unknown> {
    return {
        locale: config.locale,
        unit: config.unit,
        keepConsecutiveUppercase: config.keepConsecutiveUppercase,
        mergeAmbiguousCharacters: config.mergeAmbiguousCharacters,
        style: config.titleCaseStyle,
        smallWords: config.smallWords,
        separator: config.slugifySeparator,
        lowerCase: config.slugifyLowerCase,
        omission: config.truncationOmission,
        location: config.truncationLocation,
        maskCharacter: config.maskCharacter,
        unmaskedStartLength: config.unmaskedStartLength,
        unmaskedEndLength: config.unmaskedEndLength,
        wordsPerMinute: config.wordsPerMinute,
        pattern: config.templatePattern,
        form: config.normalizeForm,
        sensitivity: config.collatorSensitivity,
        numeric: config.numericCollation,
    };
}

/**
 * @param config - The caller config.
 * @returns Nothing.
 * @throws {@link TypeError} When a value has the wrong type.
 * @throws {@link RangeError} When a number or enum is out of range.
 */
function validateConfig(config: StringConfig): void {
    if (config.locale !== undefined) {
        const locale = config.locale;
        if (typeof locale !== "string" && !Array.isArray(locale)) {
            throw new TypeError(
                "locale must be a string or a list of strings.",
            );
        }
        const empty =
            typeof locale === "string"
                ? locale.length === 0
                : locale.length === 0 ||
                  locale.some((entry) => entry.length === 0);
        if (empty) {
            throw new RangeError("locale must not be empty.");
        }
    }
    if (
        config.unit !== undefined &&
        !["grapheme", "codePoint", "codeUnit"].includes(config.unit)
    ) {
        throw new RangeError(
            `unit must be grapheme, codePoint, or codeUnit. Received ${JSON.stringify(config.unit)}.`,
        );
    }
    if (
        config.wordsPerMinute !== undefined &&
        (!(typeof config.wordsPerMinute === "number") ||
            config.wordsPerMinute <= 0)
    ) {
        throw new RangeError("wordsPerMinute must be a number greater than 0.");
    }
}
