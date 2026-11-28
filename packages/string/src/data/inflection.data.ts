/**
 * English singular to plural for words that do not follow the suffix rules.
 *
 * `index` uses `indexes`. `octopus` uses `octopuses`. Keys are lowercase.
 */
export const irregularPlurals: Readonly<Record<string, string>> = {
    person: "people",
    child: "children",
    mouse: "mice",
    goose: "geese",
    foot: "feet",
    tooth: "teeth",
    woman: "women",
    man: "men",
    datum: "data",
    index: "indexes",
    octopus: "octopuses",
    ox: "oxen",
};

/**
 * Words whose singular and plural are the same.
 */
export const uncountableWords: readonly string[] = [
    "sheep",
    "series",
    "species",
    "information",
    "rice",
    "money",
    "news",
    "fish",
    "deer",
    "aircraft",
    "equipment",
    "homework",
    "knowledge",
    "luggage",
    "furniture",
    "music",
    "advice",
];

/**
 * Words that take "an" even though they start with a consonant letter.
 *
 * The match is on the lowercase word.
 */
export const anBeforeWords: readonly string[] = [
    "honest",
    "honour",
    "honor",
    "hour",
    "heir",
];

/**
 * Words that take "a" even though they start with a vowel letter.
 *
 * These start with a "you" sound.
 */
export const aBeforeWords: readonly string[] = [
    "unicorn",
    "unique",
    "university",
    "user",
    "european",
    "eulogy",
    "one",
    "once",
];
