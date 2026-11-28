/**
 * One language's yes words and no words, stored in primary-word order.
 *
 * The first truthy word and the first falsy word are what `formatBoolean`
 * emits for `yes-no` and `y-n`. These are assent and dissent, not
 * translations of the identifiers `true` and `false`.
 */
export interface LocaleWordPair {
    /** Words that mean yes, primary word first. */
    readonly truthy: readonly string[];
    /** Words that mean no, primary word first. */
    readonly falsy: readonly string[];
}

/**
 * Yes/no words keyed by BCP 47 language subtag.
 *
 * `en` is present so `listBooleanLocales` can name it. Its yes/no words
 * already sit in the default English tokens. This is a curated table, not
 * a CLDR dump.
 */
export const localeWordsByLanguage: Readonly<Record<string, LocaleWordPair>> = {
    ar: { truthy: ["نعم"], falsy: ["لا"] },
    bn: { truthy: ["হ্যাঁ"], falsy: ["না"] },
    cs: { truthy: ["ano"], falsy: ["ne"] },
    da: { truthy: ["ja"], falsy: ["nej"] },
    de: { truthy: ["ja"], falsy: ["nein"] },
    el: { truthy: ["ναι"], falsy: ["όχι"] },
    en: { truthy: ["yes", "y"], falsy: ["no", "n"] },
    es: { truthy: ["sí", "si"], falsy: ["no"] },
    fi: { truthy: ["kyllä"], falsy: ["ei"] },
    fr: { truthy: ["oui"], falsy: ["non"] },
    gu: { truthy: ["હા"], falsy: ["નહીં"] },
    he: { truthy: ["כן"], falsy: ["לא"] },
    hi: { truthy: ["हाँ", "हां", "जी"], falsy: ["नहीं", "ना"] },
    hu: { truthy: ["igen"], falsy: ["nem"] },
    id: { truthy: ["ya"], falsy: ["tidak"] },
    it: { truthy: ["sì", "si"], falsy: ["no"] },
    ja: { truthy: ["はい"], falsy: ["いいえ"] },
    ko: { truthy: ["네", "예"], falsy: ["아니요", "아니오"] },
    mr: { truthy: ["हो"], falsy: ["नाही"] },
    nb: { truthy: ["ja"], falsy: ["nei"] },
    nl: { truthy: ["ja"], falsy: ["nee"] },
    pa: { truthy: ["ਹਾਂ"], falsy: ["ਨਹੀਂ"] },
    pl: { truthy: ["tak"], falsy: ["nie"] },
    pt: { truthy: ["sim"], falsy: ["não", "nao"] },
    ro: { truthy: ["da"], falsy: ["nu"] },
    ru: { truthy: ["да"], falsy: ["нет"] },
    sv: { truthy: ["ja"], falsy: ["nej"] },
    sw: { truthy: ["ndiyo"], falsy: ["hapana"] },
    ta: { truthy: ["ஆம்"], falsy: ["இல்லை"] },
    te: { truthy: ["అవును"], falsy: ["కాదు"] },
    th: { truthy: ["ใช่"], falsy: ["ไม่"] },
    tr: { truthy: ["evet"], falsy: ["hayır", "hayir"] },
    uk: { truthy: ["так"], falsy: ["ні"] },
    ur: { truthy: ["ہاں"], falsy: ["نہیں"] },
    vi: { truthy: ["có"], falsy: ["không"] },
    zh: { truthy: ["是", "对", "對"], falsy: ["否", "不是"] },
};
