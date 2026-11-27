/**
 * The BCP 47 language subtag of `locale`, compared in lowercase.
 *
 * `hi-IN` is `hi`, `zh-Hans` is `zh`, and `pt-BR` is `pt`. The separator is
 * a hyphen. The subtag is folded with `toLowerCase()`, which is not locale
 * sensitive, so a Turkish environment does not rewrite `I`.
 *
 * @param locale - A BCP 47 tag. An empty string yields an empty subtag.
 * @returns The first subtag, in lowercase.
 */
export function languageSubtag(locale: string): string {
    const separatorIndex = locale.indexOf("-");
    const subtag =
        separatorIndex === -1 ? locale : locale.slice(0, separatorIndex);
    return subtag.toLowerCase();
}
